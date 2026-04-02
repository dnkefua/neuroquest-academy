import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import type { Programme } from '@/types'

interface ProgressState {
  currentGrade: number
  currentProgramme: Programme
  userName: string
  completedQuests: string[]
  approvedQuestIds: string[]
  bossesDefeated: string[]
  gradesCompleted: number[]
  badges: Record<string, boolean>
  subjectMastery: Record<string, number>
  graduationDate: number | null
  setCurrentGrade: (grade: number) => void
  setUserName: (name: string) => void
  completeQuest: (questId: string) => void
  defeatBoss: (bossId: string) => void
  completeGrade: (grade: number) => void
  graduate: () => void
  addBadge: (badge: string) => void
  updateMastery: (subject: string, pct: number) => void
  getQuestComplete: (questId: string) => boolean
  getGradeProgress: (grade: number, totalQuests: number) => number
  setApprovedQuestIds: (ids: string[]) => void
  reset: () => void
}

function getProgramme(grade: number): Programme {
  if (grade <= 5) return 'PYP'
  if (grade <= 10) return 'MYP'
  return 'DP'
}

function createTestProgressStore() {
  return create<ProgressState>((set, get) => ({
    currentGrade: 1,
    currentProgramme: 'PYP',
    userName: '',
    completedQuests: [],
    approvedQuestIds: [],
    bossesDefeated: [],
    gradesCompleted: [],
    badges: {},
    subjectMastery: {},
    graduationDate: null,

    setCurrentGrade: (grade) => {
      set({
        currentGrade: grade,
        currentProgramme: getProgramme(grade),
      })
    },

    setUserName: (name) => set({ userName: name }),

    completeQuest: (questId) => {
      const { completedQuests } = get()
      if (!completedQuests.includes(questId)) {
        set((s) => ({ completedQuests: [...s.completedQuests, questId] }))
      }
    },

    defeatBoss: (bossId) => {
      const { bossesDefeated } = get()
      if (!bossesDefeated.includes(bossId)) {
        set((s) => ({ bossesDefeated: [...s.bossesDefeated, bossId] }))
      }
    },

    completeGrade: (grade) => {
      const { gradesCompleted } = get()
      if (!gradesCompleted.includes(grade)) {
        const newGradesCompleted = [...gradesCompleted, grade]
        const nextGrade = Math.min(grade + 1, 12)
        set({
          gradesCompleted: newGradesCompleted,
          currentGrade: nextGrade,
          currentProgramme: getProgramme(nextGrade),
        })
      }
    },

    graduate: () => {
      set({
        badges: { ...get().badges, grandGraduate: true },
        graduationDate: Date.now(),
      })
    },

    addBadge: (badge) => set((s) => ({ badges: { ...s.badges, [badge]: true } })),

    updateMastery: (subject, pct) => set((s) => ({
      subjectMastery: { ...s.subjectMastery, [subject]: pct },
    })),

    getQuestComplete: (questId) => get().completedQuests.includes(questId),

    getGradeProgress: (grade, totalQuests) => {
      if (totalQuests === 0) return 0
      const completed = get().completedQuests.filter(id => id.startsWith(`g${grade}-`)).length
      return Math.round((completed / totalQuests) * 100)
    },

    setApprovedQuestIds: (ids) => set({ approvedQuestIds: ids }),

    reset: () => set({
      currentGrade: 1,
      currentProgramme: 'PYP',
      userName: '',
      completedQuests: [],
      approvedQuestIds: [],
      bossesDefeated: [],
      gradesCompleted: [],
      badges: {},
      subjectMastery: {},
      graduationDate: null,
    }),
  }))
}

describe('progressStore', () => {
  let store: ReturnType<typeof createTestProgressStore>

  beforeEach(() => {
    store = createTestProgressStore()
  })

  describe('initial state', () => {
    it('starts at grade 1', () => {
      expect(store.getState().currentGrade).toBe(1)
    })

    it('starts with PYP programme', () => {
      expect(store.getState().currentProgramme).toBe('PYP')
    })

    it('starts with empty userName', () => {
      expect(store.getState().userName).toBe('')
    })

    it('starts with no completed quests', () => {
      expect(store.getState().completedQuests).toEqual([])
    })

    it('starts with no bosses defeated', () => {
      expect(store.getState().bossesDefeated).toEqual([])
    })

    it('starts with no grades completed', () => {
      expect(store.getState().gradesCompleted).toEqual([])
    })

    it('starts with no badges', () => {
      expect(store.getState().badges).toEqual({})
    })

    it('starts with empty subject mastery', () => {
      expect(store.getState().subjectMastery).toEqual({})
    })

    it('starts with no graduation date', () => {
      expect(store.getState().graduationDate).toBeNull()
    })
  })

  describe('setCurrentGrade', () => {
    it('updates current grade', () => {
      store.getState().setCurrentGrade(5)
      expect(store.getState().currentGrade).toBe(5)
    })

    it('updates programme to MYP for grade 6', () => {
      store.getState().setCurrentGrade(6)
      expect(store.getState().currentProgramme).toBe('MYP')
    })

    it('updates programme to DP for grade 11', () => {
      store.getState().setCurrentGrade(11)
      expect(store.getState().currentProgramme).toBe('DP')
    })

    it('keeps PYP for grade 5', () => {
      store.getState().setCurrentGrade(5)
      expect(store.getState().currentProgramme).toBe('PYP')
    })
  })

  describe('setUserName', () => {
    it('sets the user name', () => {
      store.getState().setUserName('Aisha')
      expect(store.getState().userName).toBe('Aisha')
    })

    it('can update user name', () => {
      store.getState().setUserName('First')
      store.getState().setUserName('Second')
      expect(store.getState().userName).toBe('Second')
    })
  })

  describe('completeQuest', () => {
    it('adds quest to completed quests', () => {
      store.getState().completeQuest('g1-math-1')
      expect(store.getState().completedQuests).toContain('g1-math-1')
    })

    it('does not duplicate completed quests', () => {
      store.getState().completeQuest('g1-math-1')
      store.getState().completeQuest('g1-math-1')
      expect(store.getState().completedQuests.filter(id => id === 'g1-math-1')).toHaveLength(1)
    })

    it('tracks multiple quests', () => {
      store.getState().completeQuest('g1-math-1')
      store.getState().completeQuest('g1-math-2')
      store.getState().completeQuest('g1-science-1')
      expect(store.getState().completedQuests).toHaveLength(3)
    })
  })

  describe('defeatBoss', () => {
    it('adds boss to defeated list', () => {
      store.getState().defeatBoss('g1-math-boss')
      expect(store.getState().bossesDefeated).toContain('g1-math-boss')
    })

    it('does not duplicate defeated bosses', () => {
      store.getState().defeatBoss('g1-math-boss')
      store.getState().defeatBoss('g1-math-boss')
      expect(store.getState().bossesDefeated.filter(id => id === 'g1-math-boss')).toHaveLength(1)
    })

    it('tracks multiple defeated bosses', () => {
      store.getState().defeatBoss('g1-math-boss')
      store.getState().defeatBoss('g1-science-boss')
      expect(store.getState().bossesDefeated).toHaveLength(2)
    })
  })

  describe('completeGrade', () => {
    it('adds grade to completed grades', () => {
      store.getState().completeGrade(1)
      expect(store.getState().gradesCompleted).toContain(1)
    })

    it('advances to next grade', () => {
      store.getState().completeGrade(1)
      expect(store.getState().currentGrade).toBe(2)
    })

    it('updates programme when crossing programme boundary', () => {
      store.getState().setCurrentGrade(5)
      store.getState().completeGrade(5)
      expect(store.getState().currentGrade).toBe(6)
      expect(store.getState().currentProgramme).toBe('MYP')
    })

    it('does not duplicate completed grades', () => {
      store.getState().completeGrade(1)
      store.getState().completeGrade(1)
      expect(store.getState().gradesCompleted.filter(g => g === 1)).toHaveLength(1)
    })

    it('caps at grade 12', () => {
      store.getState().setCurrentGrade(12)
      store.getState().completeGrade(12)
      expect(store.getState().currentGrade).toBe(12)
    })
  })

  describe('graduate', () => {
    it('sets grandGraduate badge', () => {
      store.getState().graduate()
      expect(store.getState().badges.grandGraduate).toBe(true)
    })

    it('sets graduation date', () => {
      store.getState().graduate()
      expect(store.getState().graduationDate).not.toBeNull()
      expect(typeof store.getState().graduationDate).toBe('number')
    })
  })

  describe('addBadge', () => {
    it('adds a badge', () => {
      store.getState().addBadge('math_master')
      expect(store.getState().badges.math_master).toBe(true)
    })

    it('can add multiple badges', () => {
      store.getState().addBadge('math_master')
      store.getState().addBadge('science_star')
      expect(store.getState().badges.math_master).toBe(true)
      expect(store.getState().badges.science_star).toBe(true)
    })
  })

  describe('updateMastery', () => {
    it('updates mastery for a subject', () => {
      store.getState().updateMastery('math', 85)
      expect(store.getState().subjectMastery.math).toBe(85)
    })

    it('can update multiple subjects', () => {
      store.getState().updateMastery('math', 85)
      store.getState().updateMastery('science', 90)
      expect(store.getState().subjectMastery.math).toBe(85)
      expect(store.getState().subjectMastery.science).toBe(90)
    })

    it('overwrites previous mastery value', () => {
      store.getState().updateMastery('math', 50)
      store.getState().updateMastery('math', 75)
      expect(store.getState().subjectMastery.math).toBe(75)
    })
  })

  describe('getQuestComplete', () => {
    it('returns false for uncompleted quest', () => {
      expect(store.getState().getQuestComplete('g1-math-1')).toBe(false)
    })

    it('returns true for completed quest', () => {
      store.getState().completeQuest('g1-math-1')
      expect(store.getState().getQuestComplete('g1-math-1')).toBe(true)
    })
  })

  describe('getGradeProgress', () => {
    it('returns 0 when no quests completed', () => {
      expect(store.getState().getGradeProgress(1, 10)).toBe(0)
    })

    it('returns 0 when totalQuests is 0', () => {
      expect(store.getState().getGradeProgress(1, 0)).toBe(0)
    })

    it('calculates progress correctly', () => {
      store.getState().completeQuest('g1-math-1')
      store.getState().completeQuest('g1-math-2')
      expect(store.getState().getGradeProgress(1, 4)).toBe(50)
    })

    it('only counts quests for the specified grade', () => {
      store.getState().completeQuest('g1-math-1')
      store.getState().completeQuest('g2-math-1')
      expect(store.getState().getGradeProgress(1, 4)).toBe(25)
    })

    it('returns 100 when all quests completed', () => {
      store.getState().completeQuest('g1-math-1')
      store.getState().completeQuest('g1-math-2')
      store.getState().completeQuest('g1-math-3')
      store.getState().completeQuest('g1-math-4')
      expect(store.getState().getGradeProgress(1, 4)).toBe(100)
    })
  })

  describe('setApprovedQuestIds', () => {
    it('sets approved quest IDs', () => {
      store.getState().setApprovedQuestIds(['g1-math-1', 'g1-math-2'])
      expect(store.getState().approvedQuestIds).toEqual(['g1-math-1', 'g1-math-2'])
    })

    it('replaces previous approved quest IDs', () => {
      store.getState().setApprovedQuestIds(['g1-math-1'])
      store.getState().setApprovedQuestIds(['g1-math-2'])
      expect(store.getState().approvedQuestIds).toEqual(['g1-math-2'])
    })
  })

  describe('reset', () => {
    it('resets all state to defaults', () => {
      store.getState().setCurrentGrade(5)
      store.getState().setUserName('Test')
      store.getState().completeQuest('g1-math-1')
      store.getState().defeatBoss('g1-math-boss')
      store.getState().addBadge('test')
      store.getState().reset()

      expect(store.getState().currentGrade).toBe(1)
      expect(store.getState().currentProgramme).toBe('PYP')
      expect(store.getState().userName).toBe('')
      expect(store.getState().completedQuests).toEqual([])
      expect(store.getState().bossesDefeated).toEqual([])
      expect(store.getState().badges).toEqual({})
    })
  })
})
