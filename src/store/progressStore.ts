'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Programme, GradeRank } from '@/types';

// ── Rank table ────────────────────────────────────────────────────────────────
export const RANK_PROGRESSION: GradeRank[] = [
  { grade: 1,  rank: 'Explorer Apprentice',    emoji: '🌱', world: 'meadow',    programme: 'PYP', color: '#22C55E', bgGradient: 'linear-gradient(135deg, #14532D, #166534)' },
  { grade: 2,  rank: 'Village Scout',           emoji: '🏘️', world: 'village',   programme: 'PYP', color: '#84CC16', bgGradient: 'linear-gradient(135deg, #3F6212, #4D7C0F)' },
  { grade: 3,  rank: 'Forest Ranger',           emoji: '🌲', world: 'forest',    programme: 'PYP', color: '#16A34A', bgGradient: 'linear-gradient(135deg, #14532D, #15803D)' },
  { grade: 4,  rank: 'Ocean Guardian',          emoji: '🌊', world: 'ocean',     programme: 'PYP', color: '#0EA5E9', bgGradient: 'linear-gradient(135deg, #0C4A6E, #075985)' },
  { grade: 5,  rank: 'City Builder',            emoji: '🏙️', world: 'city',      programme: 'PYP', color: '#F59E0B', bgGradient: 'linear-gradient(135deg, #78350F, #92400E)' },
  { grade: 6,  rank: 'Dungeon Seeker',          emoji: '⚔️', world: 'dungeon',   programme: 'MYP', color: '#8B5CF6', bgGradient: 'linear-gradient(135deg, #2E1065, #3B0764)' },
  { grade: 7,  rank: 'Time Traveller',          emoji: '⏳', world: 'timerift',  programme: 'MYP', color: '#06B6D4', bgGradient: 'linear-gradient(135deg, #164E63, #155E75)' },
  { grade: 8,  rank: 'Master Artisan',          emoji: '🎨', world: 'workshop',  programme: 'MYP', color: '#F97316', bgGradient: 'linear-gradient(135deg, #7C2D12, #9A3412)' },
  { grade: 9,  rank: 'Tech Wizard',             emoji: '🔬', world: 'labcity',   programme: 'MYP', color: '#10B981', bgGradient: 'linear-gradient(135deg, #064E3B, #065F46)' },
  { grade: 10, rank: 'World Diplomat',          emoji: '🌍', world: 'embassy',   programme: 'MYP', color: '#3B82F6', bgGradient: 'linear-gradient(135deg, #1E3A8A, #1E40AF)' },
  { grade: 11, rank: 'Grand Sage',              emoji: '📜', world: 'library',   programme: 'DP',  color: '#EC4899', bgGradient: 'linear-gradient(135deg, #831843, #9D174D)' },
  { grade: 12, rank: 'Champion Wizard Warrior', emoji: '🏆', world: 'university',programme: 'DP',  color: '#FFD700', bgGradient: 'linear-gradient(135deg, #78350F, #92400E)' },
];

export function getRankForGrade(grade: number): GradeRank {
  return RANK_PROGRESSION.find(r => r.grade === grade) ?? RANK_PROGRESSION[0];
}

export function getProgramme(grade: number): Programme {
  if (grade <= 5) return 'PYP';
  if (grade <= 10) return 'MYP';
  return 'DP';
}

// ── Store ─────────────────────────────────────────────────────────────────────

interface ProgressState {
  currentGrade: number;
  currentProgramme: Programme;
  userName: string; // For TTS voice gender detection
  completedQuests: string[];
  approvedQuestIds: string[]; // Parent-unlocked quests
  bossesDefeated: string[];
  gradesCompleted: number[];
  badges: Record<string, boolean>;
  subjectMastery: Record<string, number>;
  graduationDate: number | null;

  // Actions
  setCurrentGrade: (grade: number) => void;
  setUserName: (name: string) => void;
  completeQuest: (questId: string) => void;
  defeatBoss: (bossId: string) => void;
  completeGrade: (grade: number) => void;
  graduate: () => void;
  addBadge: (badge: string) => void;
  updateMastery: (subject: string, pct: number) => void;
  getQuestComplete: (questId: string) => boolean;
  getGradeProgress: (grade: number, totalQuests: number) => number;
  setApprovedQuestIds: (ids: string[]) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  currentGrade: 1,
  currentProgramme: 'PYP' as Programme,
  userName: '' as string,
  completedQuests: [] as string[],
  approvedQuestIds: [] as string[],
  bossesDefeated: [] as string[],
  gradesCompleted: [] as number[],
  badges: {} as Record<string, boolean>,
  subjectMastery: {} as Record<string, number>,
  graduationDate: null as number | null,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setCurrentGrade: (grade) => {
        set({
          currentGrade: grade,
          currentProgramme: getProgramme(grade),
        });
      },

      setUserName: (name) => set({ userName: name }),

      completeQuest: (questId) => {
        const { completedQuests } = get();
        if (!completedQuests.includes(questId)) {
          set((s) => ({ completedQuests: [...s.completedQuests, questId] }));
        }
      },

      defeatBoss: (bossId) => {
        const { bossesDefeated } = get();
        if (!bossesDefeated.includes(bossId)) {
          set((s) => ({ bossesDefeated: [...s.bossesDefeated, bossId] }));
        }
      },

      completeGrade: (grade) => {
        const { gradesCompleted } = get();
        if (!gradesCompleted.includes(grade)) {
          const newGradesCompleted = [...gradesCompleted, grade];
          const nextGrade = Math.min(grade + 1, 12);
          set({
            gradesCompleted: newGradesCompleted,
            currentGrade: nextGrade,
            currentProgramme: getProgramme(nextGrade),
          });
        }
      },

      graduate: () => {
        set({
          badges: { ...get().badges, grandGraduate: true },
          graduationDate: Date.now(),
        });
      },

      addBadge: (badge) => set((s) => ({ badges: { ...s.badges, [badge]: true } })),

      updateMastery: (subject, pct) => set((s) => ({
        subjectMastery: { ...s.subjectMastery, [subject]: pct },
      })),

      getQuestComplete: (questId) => get().completedQuests.includes(questId),

      getGradeProgress: (grade, totalQuests) => {
        if (totalQuests === 0) return 0;
        const completed = get().completedQuests.filter(id => id.startsWith(`g${grade}-`)).length;
        return Math.round((completed / totalQuests) * 100);
      },

      setApprovedQuestIds: (ids) => set({ approvedQuestIds: ids }),

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-progress',
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
    }
  )
);
