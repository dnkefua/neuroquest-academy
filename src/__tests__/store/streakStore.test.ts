import { describe, it, expect, beforeEach, vi } from 'vitest'
import { create } from 'zustand'

interface StreakState {
  currentStreak: number
  longestStreak: number
  lastLoginDate: string | null
  lastClaimDate: string | null
  totalDaysPlayed: number
  weeklyStreaksCompleted: number
  checkIn: () => { streakDays: number; reward: number; isNewDay: boolean; isWeeklyBonus: boolean }
  claimToday: () => { reward: number; streakDays: number }
  canClaimToday: () => boolean
  getTodayReward: () => number
  reset: () => void
}

const STREAK_REWARDS = {
  dailyBonus: [10, 15, 20, 30, 50, 75, 100],
  weeklyBonus: 200,
  maxStreakDisplay: 365,
} as const

function getStreakReward(day: number): number {
  const rewards = STREAK_REWARDS.dailyBonus
  if (day <= 0) return 0
  if (day <= rewards.length) return rewards[day - 1]
  return rewards[rewards.length - 1]
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function areConsecutiveDays(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = d2.getTime() - d1.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

function createTestStreakStore() {
  return create<StreakState>((set, get) => ({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: null,
    lastClaimDate: null,
    totalDaysPlayed: 0,
    weeklyStreaksCompleted: 0,

    checkIn: () => {
      const today = getTodayISO()
      const state = get()

      if (state.lastLoginDate === today) {
        return {
          streakDays: state.currentStreak,
          reward: 0,
          isNewDay: false,
          isWeeklyBonus: false,
        }
      }

      let newStreak = 1
      let isWeeklyBonus = false

      if (state.lastLoginDate && areConsecutiveDays(state.lastLoginDate, today)) {
        newStreak = state.currentStreak + 1
        if (newStreak % 7 === 0) {
          isWeeklyBonus = true
        }
      }

      const newLongest = Math.max(state.longestStreak, newStreak)
      const dailyReward = getStreakReward(newStreak)
      const totalReward = isWeeklyBonus ? dailyReward + STREAK_REWARDS.weeklyBonus : dailyReward

      set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastLoginDate: today,
        totalDaysPlayed: state.totalDaysPlayed + 1,
        weeklyStreaksCompleted: isWeeklyBonus
          ? state.weeklyStreaksCompleted + 1
          : state.weeklyStreaksCompleted,
      })

      return {
        streakDays: newStreak,
        reward: totalReward,
        isNewDay: true,
        isWeeklyBonus,
      }
    },

    claimToday: () => {
      const state = get()
      const today = getTodayISO()

      if (state.lastClaimDate === today) {
        return { reward: 0, streakDays: state.currentStreak }
      }

      const checkInResult = get().checkIn()
      set({ lastClaimDate: today })

      return {
        reward: checkInResult.reward,
        streakDays: checkInResult.streakDays,
      }
    },

    canClaimToday: () => {
      const state = get()
      const today = getTodayISO()
      return state.lastClaimDate !== today
    },

    getTodayReward: () => {
      const state = get()
      const today = getTodayISO()

      let potentialStreak = 1
      if (state.lastLoginDate) {
        if (areConsecutiveDays(state.lastLoginDate, today)) {
          potentialStreak = state.currentStreak + 1
        } else if (state.lastLoginDate === today) {
          potentialStreak = state.currentStreak
        }
      }

      return getStreakReward(potentialStreak)
    },

    reset: () => set({
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      lastClaimDate: null,
      totalDaysPlayed: 0,
      weeklyStreaksCompleted: 0,
    }),
  }))
}

describe('streakStore', () => {
  let store: ReturnType<typeof createTestStreakStore>

  beforeEach(() => {
    store = createTestStreakStore()
  })

  describe('getStreakReward', () => {
    it('returns 0 for day 0', () => {
      expect(getStreakReward(0)).toBe(0)
    })

    it('returns 0 for negative day', () => {
      expect(getStreakReward(-1)).toBe(0)
    })

    it('returns 10 for day 1', () => {
      expect(getStreakReward(1)).toBe(10)
    })

    it('returns 15 for day 2', () => {
      expect(getStreakReward(2)).toBe(15)
    })

    it('returns 20 for day 3', () => {
      expect(getStreakReward(3)).toBe(20)
    })

    it('returns 30 for day 4', () => {
      expect(getStreakReward(4)).toBe(30)
    })

    it('returns 50 for day 5', () => {
      expect(getStreakReward(5)).toBe(50)
    })

    it('returns 75 for day 6', () => {
      expect(getStreakReward(6)).toBe(75)
    })

    it('returns 100 for day 7', () => {
      expect(getStreakReward(7)).toBe(100)
    })

    it('returns 100 for day 8', () => {
      expect(getStreakReward(8)).toBe(100)
    })

    it('returns max reward for day 30', () => {
      expect(getStreakReward(30)).toBe(100)
    })
  })

  describe('initial state', () => {
    it('starts with 0 streak', () => {
      expect(store.getState().currentStreak).toBe(0)
    })

    it('starts with 0 longest streak', () => {
      expect(store.getState().longestStreak).toBe(0)
    })

    it('starts with null last login date', () => {
      expect(store.getState().lastLoginDate).toBeNull()
    })

    it('starts with null last claim date', () => {
      expect(store.getState().lastClaimDate).toBeNull()
    })

    it('starts with 0 total days played', () => {
      expect(store.getState().totalDaysPlayed).toBe(0)
    })

    it('starts with 0 weekly streaks completed', () => {
      expect(store.getState().weeklyStreaksCompleted).toBe(0)
    })
  })

  describe('checkIn', () => {
    it('starts a new streak on first check-in', () => {
      const result = store.getState().checkIn()
      expect(result.streakDays).toBe(1)
      expect(result.isNewDay).toBe(true)
    })

    it('gives day 1 reward on first check-in', () => {
      const result = store.getState().checkIn()
      expect(result.reward).toBe(10)
    })

    it('returns 0 reward when checking in twice same day', () => {
      store.getState().checkIn()
      const result = store.getState().checkIn()
      expect(result.reward).toBe(0)
      expect(result.isNewDay).toBe(false)
    })

    it('updates lastLoginDate', () => {
      store.getState().checkIn()
      expect(store.getState().lastLoginDate).toBe(getTodayISO())
    })

    it('increments totalDaysPlayed', () => {
      store.getState().checkIn()
      expect(store.getState().totalDaysPlayed).toBe(1)
    })

    it('updates longestStreak', () => {
      store.getState().checkIn()
      expect(store.getState().longestStreak).toBe(1)
    })
  })

  describe('claimToday', () => {
    it('claims reward on first claim', () => {
      const result = store.getState().claimToday()
      expect(result.reward).toBe(10)
      expect(result.streakDays).toBe(1)
    })

    it('returns 0 reward when already claimed today', () => {
      store.getState().claimToday()
      const result = store.getState().claimToday()
      expect(result.reward).toBe(0)
    })

    it('marks today as claimed', () => {
      store.getState().claimToday()
      expect(store.getState().lastClaimDate).toBe(getTodayISO())
    })
  })

  describe('canClaimToday', () => {
    it('returns true when nothing claimed yet', () => {
      expect(store.getState().canClaimToday()).toBe(true)
    })

    it('returns false after claiming', () => {
      store.getState().claimToday()
      expect(store.getState().canClaimToday()).toBe(false)
    })
  })

  describe('getTodayReward', () => {
    it('returns day 1 reward for new user', () => {
      expect(store.getState().getTodayReward()).toBe(10)
    })

    it('returns current streak reward if already logged in today', () => {
      store.getState().checkIn()
      expect(store.getState().getTodayReward()).toBe(10)
    })
  })

  describe('reset', () => {
    it('resets all state to defaults', () => {
      store.getState().checkIn()
      store.getState().claimToday()
      store.getState().reset()

      expect(store.getState().currentStreak).toBe(0)
      expect(store.getState().longestStreak).toBe(0)
      expect(store.getState().lastLoginDate).toBeNull()
      expect(store.getState().lastClaimDate).toBeNull()
      expect(store.getState().totalDaysPlayed).toBe(0)
      expect(store.getState().weeklyStreaksCompleted).toBe(0)
    })
  })

  describe('STREAK_REWARDS constants', () => {
    it('has 7 daily bonus values', () => {
      expect(STREAK_REWARDS.dailyBonus).toHaveLength(7)
    })

    it('has weekly bonus of 200', () => {
      expect(STREAK_REWARDS.weeklyBonus).toBe(200)
    })

    it('has max streak display of 365', () => {
      expect(STREAK_REWARDS.maxStreakDisplay).toBe(365)
    })

    it('daily bonuses are increasing', () => {
      const bonuses = STREAK_REWARDS.dailyBonus
      for (let i = 1; i < bonuses.length; i++) {
        expect(bonuses[i]).toBeGreaterThan(bonuses[i - 1])
      }
    })
  })
})
