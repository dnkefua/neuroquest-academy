'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BiosyncConfig, CognitiveLoadReading, HeartRateData, FocusData } from '@/lib/biosync';
import { calculateCognitiveLoad, shouldSuggestNeuroBreak, getDifficultyAdjustment, DEFAULT_CONFIG } from '@/lib/biosync';

interface BiosyncState {
  config: BiosyncConfig;
  currentReading: CognitiveLoadReading | null;
  readingHistory: CognitiveLoadReading[];
  lastHeartRate: HeartRateData | null;
  lastFocus: FocusData | null;
  breakSuggestionsCount: number;
  totalMonitoringMinutes: number;

  updateConfig: (config: Partial<BiosyncConfig>) => void;
  enableBiosync: (source: BiosyncConfig['source']) => void;
  disableBiosync: () => void;
  submitHeartRate: (data: HeartRateData) => void;
  submitFocus: (data: FocusData) => void;
  computeReading: () => CognitiveLoadReading | null;
  shouldBreak: () => boolean;
  getDifficultyAdjustment: () => number;
  acknowledgeBreak: () => void;
  getAverageLoad: (minutes?: number) => number;
  getStressTrend: () => 'improving' | 'stable' | 'worsening';
  reset: () => void;
}

const DEFAULT_STATE = {
  config: DEFAULT_CONFIG,
  currentReading: null as CognitiveLoadReading | null,
  readingHistory: [] as CognitiveLoadReading[],
  lastHeartRate: null as HeartRateData | null,
  lastFocus: null as FocusData | null,
  breakSuggestionsCount: 0,
  totalMonitoringMinutes: 0,
};

export const useBiosyncStore = create<BiosyncState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      updateConfig: (partial) => {
        set((s) => ({
          config: { ...s.config, ...partial },
        }));
      },

      enableBiosync: (source) => {
        set((s) => ({
          config: { ...s.config, enabled: true, source },
        }));
      },

      disableBiosync: () => {
        set((s) => ({
          config: { ...s.config, enabled: false, source: 'none' },
          currentReading: null,
        }));
      },

      submitHeartRate: (data) => {
        set({ lastHeartRate: data });
        get().computeReading();
      },

      submitFocus: (data) => {
        set({ lastFocus: data });
        get().computeReading();
      },

      computeReading: () => {
        const { config, lastHeartRate, lastFocus } = get();
        const reading = calculateCognitiveLoad(lastHeartRate, lastFocus, config);

        set((s) => ({
          currentReading: reading,
          readingHistory: [...s.readingHistory, reading].slice(-100),
          totalMonitoringMinutes: s.totalMonitoringMinutes + (config.checkIntervalMs / 60000),
        }));

        return reading;
      },

      shouldBreak: () => {
        const { currentReading, config } = get();
        if (!currentReading) return false;
        return shouldSuggestNeuroBreak(currentReading, config);
      },

      getDifficultyAdjustment: () => {
        const { currentReading, config } = get();
        if (!currentReading) return 0;
        return getDifficultyAdjustment(currentReading, config);
      },

      acknowledgeBreak: () => {
        set((s) => ({ breakSuggestionsCount: s.breakSuggestionsCount + 1 }));
      },

      getAverageLoad: (minutes) => {
        const { readingHistory } = get();
        if (readingHistory.length === 0) return 0;
        const cutoff = minutes ? Date.now() - minutes * 60000 : 0;
        const relevant = minutes ? readingHistory.filter(r => r.timestamp >= cutoff) : readingHistory;
        if (relevant.length === 0) return 0;
        return Math.round(relevant.reduce((sum, r) => sum + r.score, 0) / relevant.length);
      },

      getStressTrend: () => {
        const { readingHistory } = get();
        if (readingHistory.length < 4) return 'stable';
        const recent = readingHistory.slice(-3);
        const older = readingHistory.slice(-6, -3);
        if (older.length === 0) return 'stable';
        const recentAvg = recent.reduce((sum, r) => sum + r.score, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.score, 0) / older.length;
        if (recentAvg < olderAvg - 5) return 'improving';
        if (recentAvg > olderAvg + 5) return 'worsening';
        return 'stable';
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-biosync',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          length: 0,
          clear: () => {},
          key: () => null,
        }
      ),
      partialize: (s) => ({
        config: s.config,
        breakSuggestionsCount: s.breakSuggestionsCount,
        totalMonitoringMinutes: s.totalMonitoringMinutes,
      }),
    }
  )
);
