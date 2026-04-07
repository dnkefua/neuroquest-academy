'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CognitiveProfile, CognitiveDomain, CognitiveAssessment } from '@/types';

const DOMAIN_LABELS: Record<CognitiveDomain, string> = {
  memory: 'Memory',
  logic: 'Logic',
  linguistics: 'Linguistics',
  spatial: 'Spatial',
  attention: 'Attention',
  'processing-speed': 'Processing Speed',
};

const DOMAIN_EMOJIS: Record<CognitiveDomain, string> = {
  memory: '🧠',
  logic: '🔮',
  linguistics: '📖',
  spatial: '🗺️',
  attention: '🎯',
  'processing-speed': '⚡',
};

function determineLearningStyle(profile: Record<CognitiveDomain, number>): 'visual' | 'auditory' | 'kinesthetic' | 'mixed' {
  const spatial = profile.spatial || 0;
  const linguistics = profile.linguistics || 0;
  const memory = profile.memory || 0;

  if (spatial > linguistics && spatial > memory) return 'visual';
  if (linguistics > spatial && linguistics > memory) return 'auditory';
  if (memory > spatial && memory > linguistics) return 'kinesthetic';
  return 'mixed';
}

function determinePace(profile: Record<CognitiveDomain, number>): 'slow' | 'moderate' | 'fast' {
  const avg = Object.values(profile).reduce((a, b) => a + b, 0) / Object.keys(profile).length;
  if (avg < 40) return 'slow';
  if (avg < 70) return 'moderate';
  return 'fast';
}

function determineAttentionSpan(profile: Record<CognitiveDomain, number>): number {
  const attention = profile.attention || 50;
  return Math.max(5, Math.min(45, Math.round((attention / 100) * 45)));
}

function determineFrustrationThreshold(profile: Record<CognitiveDomain, number>): number {
  const attention = profile.attention || 50;
  const processingSpeed = profile['processing-speed'] || 50;
  return Math.max(2, Math.min(10, Math.round(((attention + processingSpeed) / 200) * 10)));
}

function getStrengthsWeaknesses(domains: Record<CognitiveDomain, number>): { strengths: CognitiveDomain[]; weaknesses: CognitiveDomain[] } {
  const entries = Object.entries(domains) as [CognitiveDomain, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return {
    strengths: sorted.slice(0, 2).map(e => e[0]),
    weaknesses: sorted.slice(-2).map(e => e[0]),
  };
}

const DEFAULT_STATE = {
  profile: {
    domains: {
      memory: 50,
      logic: 50,
      linguistics: 50,
      spatial: 50,
      attention: 50,
      'processing-speed': 50,
    },
    lastUpdated: '',
    assessmentCount: 0,
    strengths: [] as CognitiveDomain[],
    weaknesses: [] as CognitiveDomain[],
    learningStyle: 'mixed' as const,
    preferredPace: 'moderate' as const,
    attentionSpanMinutes: 20,
    frustrationThreshold: 5,
  } as CognitiveProfile,
  assessments: [] as CognitiveAssessment[],
  isBaselineComplete: false,
  baselineProgress: 0,
};

interface CognitiveState {
  profile: CognitiveProfile;
  assessments: CognitiveAssessment[];
  isBaselineComplete: boolean;
  baselineProgress: number;

  submitAssessment: (assessment: Omit<CognitiveAssessment, 'id' | 'date'>) => void;
  updateDomainScore: (domain: CognitiveDomain, score: number) => void;
  startBaseline: () => void;
  completeBaseline: () => void;
  getDomainLabel: (domain: CognitiveDomain) => string;
  getDomainEmoji: (domain: CognitiveDomain) => string;
  getAllDomainLabels: () => { domain: CognitiveDomain; label: string; emoji: string; score: number }[];
  getRecommendation: () => string;
  getAdaptiveDifficulty: (currentDifficulty: number) => number;
  shouldSuggestBreak: (sessionMinutes: number, errors: number) => boolean;
  reset: () => void;
}

export const useCognitiveStore = create<CognitiveState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      submitAssessment: (assessment) => {
        set((state) => {
          const newAssessment: CognitiveAssessment = {
            ...assessment,
            id: `assess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            date: new Date().toISOString(),
          };

          const newAssessments = [...state.assessments, newAssessment];
          const domainAssessments = newAssessments.filter(a => a.domain === assessment.domain);
          const avgScore = domainAssessments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / domainAssessments.length;

          const newDomains = {
            ...state.profile.domains,
            [assessment.domain]: Math.round(avgScore),
          };

          const { strengths, weaknesses } = getStrengthsWeaknesses(newDomains);

          const newProfile: CognitiveProfile = {
            domains: newDomains,
            lastUpdated: new Date().toISOString(),
            assessmentCount: state.profile.assessmentCount + 1,
            strengths,
            weaknesses,
            learningStyle: determineLearningStyle(newDomains),
            preferredPace: determinePace(newDomains),
            attentionSpanMinutes: determineAttentionSpan(newDomains),
            frustrationThreshold: determineFrustrationThreshold(newDomains),
          };

          return {
            profile: newProfile,
            assessments: newAssessments,
            baselineProgress: Math.min(100, Math.round((newAssessments.length / 12) * 100)),
            isBaselineComplete: newAssessments.length >= 12,
          };
        });
      },

      updateDomainScore: (domain, score) => {
        set((state) => {
          const newDomains = {
            ...state.profile.domains,
            [domain]: Math.max(0, Math.min(100, score)),
          };
          const { strengths, weaknesses } = getStrengthsWeaknesses(newDomains);

          return {
            profile: {
              ...state.profile,
              domains: newDomains,
              strengths,
              weaknesses,
              learningStyle: determineLearningStyle(newDomains),
              preferredPace: determinePace(newDomains),
              attentionSpanMinutes: determineAttentionSpan(newDomains),
              frustrationThreshold: determineFrustrationThreshold(newDomains),
              lastUpdated: new Date().toISOString(),
            },
          };
        });
      },

      startBaseline: () => {
        set({ baselineProgress: 0, isBaselineComplete: false });
      },

      completeBaseline: () => {
        set({ isBaselineComplete: true, baselineProgress: 100 });
      },

      getDomainLabel: (domain) => DOMAIN_LABELS[domain],

      getDomainEmoji: (domain) => DOMAIN_EMOJIS[domain],

      getAllDomainLabels: () => {
        const { profile } = get();
        return (Object.keys(profile.domains) as CognitiveDomain[]).map(domain => ({
          domain,
          label: DOMAIN_LABELS[domain],
          emoji: DOMAIN_EMOJIS[domain],
          score: profile.domains[domain],
        }));
      },

      getRecommendation: () => {
        const { profile } = get();
        if (profile.weaknesses.length === 0) return 'Keep up the great work!';

        const weakest = profile.weaknesses[0];
        const recommendations: Record<CognitiveDomain, string> = {
          memory: 'Try using visualization techniques and spaced repetition to boost memory retention.',
          logic: 'Practice breaking problems into smaller steps. Look for patterns in questions.',
          linguistics: 'Read more and practice explaining concepts out loud to strengthen language skills.',
          spatial: 'Use diagrams and visual aids. Try drawing problems to understand them better.',
          attention: 'Take regular breaks. Try the Pomodoro technique: 25 min focus, 5 min rest.',
          'processing-speed': 'Practice timed exercises. Start slow and gradually increase pace.',
        };
        return recommendations[weakest];
      },

      getAdaptiveDifficulty: (currentDifficulty) => {
        const { profile } = get();
        const avg = Object.values(profile.domains).reduce((a, b) => a + b, 0) / Object.keys(profile.domains).length;

        if (avg > 80) return Math.min(1, currentDifficulty + 0.1);
        if (avg < 40) return Math.max(0, currentDifficulty - 0.1);
        return currentDifficulty;
      },

      shouldSuggestBreak: (sessionMinutes, errors) => {
        const { profile } = get();
        const attentionSpan = profile.attentionSpanMinutes;
        const frustrationThreshold = profile.frustrationThreshold;

        return sessionMinutes >= attentionSpan || errors >= frustrationThreshold;
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-cognitive',
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
        profile: s.profile,
        assessments: s.assessments.slice(-50),
        isBaselineComplete: s.isBaselineComplete,
        baselineProgress: s.baselineProgress,
      }),
    }
  )
);
