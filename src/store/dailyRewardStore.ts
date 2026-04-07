'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PowerUp, PowerUpType, DailyReward, ActivePowerUp } from '@/types';

export const POWER_UPS: Record<PowerUpType, PowerUp> = {
  'double-xp': {
    id: 'double-xp',
    name: 'Double XP Potion',
    emoji: '✨',
    description: 'Earn 2x XP on all quests today',
    color: '#8B5CF6',
    duration: '24h',
    rarity: 'rare',
  },
  'double-coins': {
    id: 'double-coins',
    name: 'Coin Multiplier',
    emoji: '💰',
    description: 'Earn 2x coins on all encounters today',
    color: '#F59E0B',
    duration: '24h',
    rarity: 'rare',
  },
  'free-clue': {
    id: 'free-clue',
    name: 'Mystic Lens',
    emoji: '🔮',
    description: 'Get 3 free clues without spending coins',
    color: '#06B6D4',
    duration: 'session',
    rarity: 'common',
  },
  'focus-boost': {
    id: 'focus-boost',
    name: 'Focus Elixir',
    emoji: '🧠',
    description: 'Reduced difficulty for 1 hour',
    color: '#10B981',
    duration: '1h',
    rarity: 'epic',
  },
  'streak-shield': {
    id: 'streak-shield',
    name: 'Streak Shield',
    emoji: '🛡️',
    description: 'Protect your streak if you miss a day',
    color: '#3B82F6',
    duration: '24h',
    rarity: 'epic',
  },
  'brain-break-pass': {
    id: 'brain-break-pass',
    name: 'Brain Break Pass',
    emoji: '🌈',
    description: 'Skip the next brain break prompt',
    color: '#EC4899',
    duration: 'session',
    rarity: 'common',
  },
};

export const DAILY_REWARD_SCHEDULE: Omit<DailyReward, 'claimed' | 'claimDate'>[] = [
  { day: 1, powerUp: 'free-clue', coins: 20, xp: 50 },
  { day: 2, powerUp: 'double-coins', coins: 30, xp: 75 },
  { day: 3, powerUp: 'free-clue', coins: 40, xp: 100 },
  { day: 4, powerUp: 'focus-boost', coins: 50, xp: 125 },
  { day: 5, powerUp: 'double-xp', coins: 60, xp: 150 },
  { day: 6, powerUp: 'streak-shield', coins: 75, xp: 200 },
  { day: 7, powerUp: 'double-xp', coins: 100, xp: 300 },
];

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function isConsecutiveDay(lastDate: string, today: string): boolean {
  const last = new Date(lastDate);
  const tod = new Date(today);
  const diff = tod.getTime() - last.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24)) === 1;
}

interface DailyRewardState {
  currentDay: number;
  lastClaimDate: string | null;
  totalClaims: number;
  consecutiveDays: number;
  longestStreak: number;
  activePowerUps: ActivePowerUp[];
  freeCluesRemaining: number;
  brainBreakPassesRemaining: number;
  hasStreakShield: boolean;

  claimDailyReward: () => {
    reward: DailyReward;
    isNewDay: boolean;
    streakReset: boolean;
  };
  canClaimToday: () => boolean;
  getTodayReward: () => DailyReward | null;
  activatePowerUp: (type: PowerUpType) => void;
  getActivePowerUp: (type: PowerUpType) => ActivePowerUp | undefined;
  hasActivePowerUp: (type: PowerUpType) => boolean;
  useFreeClue: () => boolean;
  useBrainBreakPass: () => boolean;
  hasStreakShieldActive: () => boolean;
  getMultiplier: (type: 'xp' | 'coins') => number;
  cleanupExpiredPowerUps: () => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  currentDay: 1,
  lastClaimDate: null as string | null,
  totalClaims: 0,
  consecutiveDays: 0,
  longestStreak: 0,
  activePowerUps: [] as ActivePowerUp[],
  freeCluesRemaining: 0,
  brainBreakPassesRemaining: 0,
  hasStreakShield: false,
};

export const useDailyRewardStore = create<DailyRewardState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      claimDailyReward: () => {
        const today = getTodayISO();
        const state = get();
        const dayIndex = (state.currentDay - 1) % 7;
        const schedule = DAILY_REWARD_SCHEDULE[dayIndex];
        const baseReward: Omit<DailyReward, 'claimed' | 'claimDate'> = schedule;

        if (state.lastClaimDate === today) {
          return {
            reward: { ...baseReward, claimed: false },
            isNewDay: false,
            streakReset: false,
          };
        }

        let newConsecutive = 1;
        let streakReset = false;

        if (state.lastClaimDate) {
          if (isConsecutiveDay(state.lastClaimDate, today)) {
            newConsecutive = state.consecutiveDays + 1;
          } else if (state.hasStreakShield) {
            newConsecutive = state.consecutiveDays + 1;
            set({ hasStreakShield: false });
          } else {
            streakReset = true;
            newConsecutive = 1;
          }
        }

        const newDay = ((state.currentDay - 1) % 7) + 1;
        const rewardSchedule = DAILY_REWARD_SCHEDULE[newDay - 1];
        const reward: DailyReward = {
          ...rewardSchedule,
          claimed: true,
          claimDate: today,
        };

        const newLongest = Math.max(state.longestStreak, newConsecutive);

        const newPowerUps = [...state.activePowerUps];
        let newFreeClues = state.freeCluesRemaining;
        let newBrainBreakPasses = state.brainBreakPassesRemaining;
        let newHasStreakShield = state.hasStreakShield;

        const now = new Date();
        const powerUp = POWER_UPS[reward.powerUp];

        if (powerUp) {
          let expiresAt = new Date(now);
          switch (powerUp.duration) {
            case '1h':
              expiresAt.setHours(expiresAt.getHours() + 1);
              break;
            case '24h':
              expiresAt.setDate(expiresAt.getDate() + 1);
              break;
            case 'session':
              expiresAt.setDate(expiresAt.getDate() + 1);
              break;
          }

          if (reward.powerUp === 'free-clue') {
            newFreeClues += 3;
          } else if (reward.powerUp === 'brain-break-pass') {
            newBrainBreakPasses += 1;
          } else if (reward.powerUp === 'streak-shield') {
            newHasStreakShield = true;
          } else {
            newPowerUps.push({
              type: reward.powerUp,
              activatedAt: now.toISOString(),
              expiresAt: expiresAt.toISOString(),
              remaining: true,
            });
          }
        }

        set({
          currentDay: newDay === 7 ? 1 : newDay + 1,
          lastClaimDate: today,
          totalClaims: state.totalClaims + 1,
          consecutiveDays: newConsecutive,
          longestStreak: newLongest,
          activePowerUps: newPowerUps,
          freeCluesRemaining: newFreeClues,
          brainBreakPassesRemaining: newBrainBreakPasses,
          hasStreakShield: newHasStreakShield,
        });

        return { reward, isNewDay: true, streakReset };
      },

      canClaimToday: () => {
        const today = getTodayISO();
        return get().lastClaimDate !== today;
      },

      getTodayReward: () => {
        const state = get();
        const dayIndex = (state.currentDay - 1) % 7;
        const schedule = DAILY_REWARD_SCHEDULE[dayIndex];
        return {
          ...schedule,
          claimed: false,
        };
      },

      activatePowerUp: (type) => {
        const state = get();
        const powerUp = POWER_UPS[type];
        if (!powerUp) return;

        const now = new Date();
        let expiresAt = new Date(now);
        switch (powerUp.duration) {
          case '1h':
            expiresAt.setHours(expiresAt.getHours() + 1);
            break;
          case '24h':
            expiresAt.setDate(expiresAt.getDate() + 1);
            break;
          case 'session':
            expiresAt.setDate(expiresAt.getDate() + 1);
            break;
        }

        set({
          activePowerUps: [
            ...state.activePowerUps,
            {
              type,
              activatedAt: now.toISOString(),
              expiresAt: expiresAt.toISOString(),
              remaining: true,
            },
          ],
        });
      },

      getActivePowerUp: (type) => {
        const now = new Date();
        return get().activePowerUps.find(
          (p) => p.type === type && new Date(p.expiresAt) > now && p.remaining
        );
      },

      hasActivePowerUp: (type) => {
        return !!get().getActivePowerUp(type);
      },

      useFreeClue: () => {
        const state = get();
        if (state.freeCluesRemaining <= 0) return false;
        set({ freeCluesRemaining: state.freeCluesRemaining - 1 });
        return true;
      },

      useBrainBreakPass: () => {
        const state = get();
        if (state.brainBreakPassesRemaining <= 0) return false;
        set({ brainBreakPassesRemaining: state.brainBreakPassesRemaining - 1 });
        return true;
      },

      hasStreakShieldActive: () => get().hasStreakShield,

      getMultiplier: (type) => {
        const now = new Date();
        const active = get().activePowerUps.filter(
          (p) => new Date(p.expiresAt) > now && p.remaining
        );

        if (type === 'xp' && active.some(p => p.type === 'double-xp')) return 2;
        if (type === 'coins' && active.some(p => p.type === 'double-coins')) return 2;
        return 1;
      },

      cleanupExpiredPowerUps: () => {
        const now = new Date();
        set((s) => ({
          activePowerUps: s.activePowerUps.filter(
            (p) => new Date(p.expiresAt) > now
          ),
        }));
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-daily-rewards',
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
        currentDay: s.currentDay,
        lastClaimDate: s.lastClaimDate,
        totalClaims: s.totalClaims,
        consecutiveDays: s.consecutiveDays,
        longestStreak: s.longestStreak,
        activePowerUps: s.activePowerUps,
        freeCluesRemaining: s.freeCluesRemaining,
        brainBreakPassesRemaining: s.brainBreakPassesRemaining,
        hasStreakShield: s.hasStreakShield,
      }),
    }
  )
);
