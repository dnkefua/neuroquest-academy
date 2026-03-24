'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Streak rewards by consecutive days ─────────────────────────────────────────
export const STREAK_REWARDS = {
  dailyBonus: [10, 15, 20, 30, 50, 75, 100], // Days 1-7
  weeklyBonus: 200, // Bonus for completing a 7-day streak
  maxStreakDisplay: 365, // Cap for display purposes
} as const;

// Get reward for a specific streak day
export function getStreakReward(day: number): number {
  const rewards = STREAK_REWARDS.dailyBonus;
  if (day <= 0) return 0;
  if (day <= rewards.length) return rewards[day - 1];
  // After day 7, repeat the max daily reward
  return rewards[rewards.length - 1];
}

// ── Store ─────────────────────────────────────────────────────────────────────

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null; // ISO date string YYYY-MM-DD
  lastClaimDate: string | null; // ISO date string YYYY-MM-DD
  totalDaysPlayed: number;
  weeklyStreaksCompleted: number; // Number of 7-day streaks completed

  // Actions
  checkIn: () => { streakDays: number; reward: number; isNewDay: boolean; isWeeklyBonus: boolean };
  claimToday: () => { reward: number; streakDays: number };
  canClaimToday: () => boolean;
  getTodayReward: () => number;
  reset: () => void;
}

// Helper to get today's date as ISO string
function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to check if two dates are consecutive days
function areConsecutiveDays(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// Helper to check if date is yesterday
function isYesterday(date: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === yesterday.toISOString().split('T')[0];
}

const DEFAULT_STATE = {
  currentStreak: 0,
  longestStreak: 0,
  lastLoginDate: null as string | null,
  lastClaimDate: null as string | null,
  totalDaysPlayed: 0,
  weeklyStreaksCompleted: 0,
};

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      checkIn: () => {
        const today = getTodayISO();
        const state = get();

        // Already checked in today
        if (state.lastLoginDate === today) {
          return {
            streakDays: state.currentStreak,
            reward: 0,
            isNewDay: false,
            isWeeklyBonus: false,
          };
        }

        let newStreak = 1;
        let isWeeklyBonus = false;

        // Check if continuing streak from yesterday
        if (state.lastLoginDate && areConsecutiveDays(state.lastLoginDate, today)) {
          newStreak = state.currentStreak + 1;

          // Check if completed a 7-day streak
          if (newStreak % 7 === 0) {
            isWeeklyBonus = true;
          }
        }

        // Update longest streak
        const newLongest = Math.max(state.longestStreak, newStreak);

        // Calculate reward
        const dailyReward = getStreakReward(newStreak);
        const totalReward = isWeeklyBonus ? dailyReward + STREAK_REWARDS.weeklyBonus : dailyReward;

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastLoginDate: today,
          totalDaysPlayed: state.totalDaysPlayed + 1,
          weeklyStreaksCompleted: isWeeklyBonus
            ? state.weeklyStreaksCompleted + 1
            : state.weeklyStreaksCompleted,
        });

        return {
          streakDays: newStreak,
          reward: totalReward,
          isNewDay: true,
          isWeeklyBonus,
        };
      },

      claimToday: () => {
        const state = get();
        const today = getTodayISO();

        // If already claimed today, return 0
        if (state.lastClaimDate === today) {
          return { reward: 0, streakDays: state.currentStreak };
        }

        // Must check in first
        const checkInResult = get().checkIn();

        // Mark as claimed
        set({ lastClaimDate: today });

        return {
          reward: checkInResult.reward,
          streakDays: checkInResult.streakDays,
        };
      },

      canClaimToday: () => {
        const state = get();
        const today = getTodayISO();
        return state.lastClaimDate !== today;
      },

      getTodayReward: () => {
        const state = get();
        const today = getTodayISO();

        // Calculate what the streak would be today
        let potentialStreak = 1;
        if (state.lastLoginDate) {
          if (areConsecutiveDays(state.lastLoginDate, today)) {
            potentialStreak = state.currentStreak + 1;
          } else if (state.lastLoginDate === today) {
            potentialStreak = state.currentStreak;
          }
        }

        return getStreakReward(potentialStreak);
      },

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'nq-streak',
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
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        lastLoginDate: s.lastLoginDate,
        lastClaimDate: s.lastClaimDate,
        totalDaysPlayed: s.totalDaysPlayed,
        weeklyStreaksCompleted: s.weeklyStreaksCompleted,
      }),
    }
  )
);