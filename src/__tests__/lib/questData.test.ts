import { describe, it, expect } from 'vitest'
import {
  getCurriculumQuestsByGradeSubject,
  getCurriculumQuestById,
  getGradesForSubject,
  getSubjectsForGrade,
  getProgrammeForGrade,
  getGameQuests,
  getGameQuestById,
  getNextGameQuest,
  getQuestCountForGrade,
  getTotalQuestsForGrade,
  hasQuestsForGradeSubject,
  getAvailableSubjectsForGrade,
  getRouteForSubject,
} from '@/lib/questData'

describe('questData', () => {
  describe('getProgrammeForGrade', () => {
    it('returns PYP for grades 1-5', () => {
      for (const grade of [1, 2, 3, 4, 5]) {
        expect(getProgrammeForGrade(grade)).toBe('PYP')
      }
    })

    it('returns MYP for grades 6-10', () => {
      for (const grade of [6, 7, 8, 9, 10]) {
        expect(getProgrammeForGrade(grade)).toBe('MYP')
      }
    })

    it('returns DP for grades 11-12', () => {
      for (const grade of [11, 12]) {
        expect(getProgrammeForGrade(grade)).toBe('DP')
      }
    })

    it('returns DP for grades above 12', () => {
      expect(getProgrammeForGrade(13)).toBe('DP')
    })

    it('returns DP for grade 0 (falls through default)', () => {
      expect(getProgrammeForGrade(0)).toBe('DP')
    })
  })

  describe('getCurriculumQuestsByGradeSubject', () => {
    it('returns array of quests for valid grade and subject', () => {
      const quests = getCurriculumQuestsByGradeSubject(1, 'math')
      expect(Array.isArray(quests)).toBe(true)
    })

    it('returns empty array for non-existent grade', () => {
      const quests = getCurriculumQuestsByGradeSubject(99, 'math')
      expect(quests).toHaveLength(0)
    })

    it('returns quests matching the specified grade', () => {
      const quests = getCurriculumQuestsByGradeSubject(6, 'math')
      quests.forEach((q) => {
        expect(q.grade).toBe(6)
        expect(q.subject).toBe('math')
      })
    })

    it('returns quests matching the specified subject', () => {
      const quests = getCurriculumQuestsByGradeSubject(1, 'science')
      quests.forEach((q) => {
        expect(q.subject).toBe('science')
      })
    })
  })

  describe('getCurriculumQuestById', () => {
    it('returns undefined for non-existent quest ID', () => {
      expect(getCurriculumQuestById('non-existent')).toBeUndefined()
    })

    it('returns undefined for empty ID', () => {
      expect(getCurriculumQuestById('')).toBeUndefined()
    })
  })

  describe('getGradesForSubject', () => {
    it('returns sorted array of grades for math', () => {
      const grades = getGradesForSubject('math')
      expect(grades.length).toBeGreaterThan(0)
      for (let i = 1; i < grades.length; i++) {
        expect(grades[i]).toBeGreaterThan(grades[i - 1])
      }
    })

    it('returns grades for science', () => {
      const grades = getGradesForSubject('science')
      expect(grades.length).toBeGreaterThan(0)
    })

    it('returns grades for english', () => {
      const grades = getGradesForSubject('english')
      expect(grades.length).toBeGreaterThan(0)
    })

    it('returns grades for social', () => {
      const grades = getGradesForSubject('social')
      expect(grades.length).toBeGreaterThan(0)
    })

    it('returns grades for socialSkills', () => {
      const grades = getGradesForSubject('socialSkills')
      expect(grades.length).toBeGreaterThan(0)
    })
  })

  describe('getSubjectsForGrade', () => {
    it('returns subjects for grade 1', () => {
      const subjects = getSubjectsForGrade(1)
      expect(Array.isArray(subjects)).toBe(true)
    })

    it('returns subjects for grade 6', () => {
      const subjects = getSubjectsForGrade(6)
      expect(subjects.length).toBeGreaterThan(0)
    })

    it('returns subjects for grade 11', () => {
      const subjects = getSubjectsForGrade(11)
      expect(subjects.length).toBeGreaterThan(0)
    })

    it('returns empty array for non-existent grade', () => {
      const subjects = getSubjectsForGrade(99)
      expect(subjects).toHaveLength(0)
    })
  })

  describe('getGameQuests', () => {
    it('returns game quests for valid grade and subject', () => {
      const quests = getGameQuests(1, 'math')
      expect(Array.isArray(quests)).toBe(true)
    })

    it('each game quest has required fields', () => {
      const quests = getGameQuests(1, 'math')
      if (quests.length > 0) {
        const quest = quests[0]
        expect(quest.id).toBeDefined()
        expect(quest.grade).toBe(1)
        expect(quest.subject).toBe('math')
        expect(quest.title).toBeDefined()
        expect(quest.emoji).toBeDefined()
        expect(quest.questions).toBeDefined()
        expect(Array.isArray(quest.questions)).toBe(true)
      }
    })

    it('game quest questions have required fields', () => {
      const quests = getGameQuests(1, 'math')
      if (quests.length > 0 && quests[0].questions.length > 0) {
        const question = quests[0].questions[0]
        expect(question.id).toBeDefined()
        expect(question.question).toBeDefined()
        expect(question.options).toBeDefined()
        expect(Array.isArray(question.options)).toBe(true)
        expect(question.correct).toBeDefined()
        expect(question.clue).toBeDefined()
      }
    })

    it('returns empty array for non-existent grade', () => {
      const quests = getGameQuests(99, 'math')
      expect(quests).toHaveLength(0)
    })
  })

  describe('getGameQuestById', () => {
    it('returns undefined for invalid ID format', () => {
      expect(getGameQuestById('invalid')).toBeUndefined()
    })

    it('returns undefined for empty ID', () => {
      expect(getGameQuestById('')).toBeUndefined()
    })
  })

  describe('getNextGameQuest', () => {
    it('returns null for invalid ID format', () => {
      expect(getNextGameQuest('invalid')).toBeNull()
    })

    it('returns null for empty ID', () => {
      expect(getNextGameQuest('')).toBeNull()
    })
  })

  describe('getQuestCountForGrade', () => {
    it('returns non-negative count for valid grade and subject', () => {
      const count = getQuestCountForGrade(1, 'math')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('returns 0 for non-existent grade', () => {
      const count = getQuestCountForGrade(99, 'math')
      expect(count).toBe(0)
    })
  })

  describe('getTotalQuestsForGrade', () => {
    it('returns non-negative total for valid grade', () => {
      const total = getTotalQuestsForGrade(1)
      expect(total).toBeGreaterThanOrEqual(0)
    })

    it('returns 0 for non-existent grade', () => {
      const total = getTotalQuestsForGrade(99)
      expect(total).toBe(0)
    })
  })

  describe('hasQuestsForGradeSubject', () => {
    it('returns boolean for valid grade and subject', () => {
      const result = hasQuestsForGradeSubject(1, 'math')
      expect(typeof result).toBe('boolean')
    })

    it('returns false for non-existent grade', () => {
      expect(hasQuestsForGradeSubject(99, 'math')).toBe(false)
    })
  })

  describe('getAvailableSubjectsForGrade', () => {
    it('returns array of subject info for grade 1', () => {
      const subjects = getAvailableSubjectsForGrade(1)
      expect(Array.isArray(subjects)).toBe(true)
      expect(subjects.length).toBe(5)
    })

    it('each subject has required fields', () => {
      const subjects = getAvailableSubjectsForGrade(1)
      subjects.forEach((subject) => {
        expect(subject.id).toBeDefined()
        expect(subject.label).toBeDefined()
        expect(subject.emoji).toBeDefined()
        expect(typeof subject.hasQuests).toBe('boolean')
      })
    })

    it('returns 5 subjects for any grade', () => {
      for (const grade of [1, 5, 10, 12]) {
        const subjects = getAvailableSubjectsForGrade(grade)
        expect(subjects.length).toBe(5)
      }
    })
  })

  describe('getRouteForSubject', () => {
    it('returns correct route for math', () => {
      const route = getRouteForSubject('math', 6)
      expect(route).toBe('/game/math?grade=6')
    })

    it('returns correct route for science', () => {
      const route = getRouteForSubject('science', 8)
      expect(route).toBe('/game/science?grade=8')
    })

    it('returns correct route for english', () => {
      const route = getRouteForSubject('english', 3)
      expect(route).toBe('/game/english?grade=3')
    })

    it('returns correct route for social', () => {
      const route = getRouteForSubject('social', 7)
      expect(route).toBe('/game/social?grade=7')
    })

    it('returns correct route for socialSkills', () => {
      const route = getRouteForSubject('socialSkills', 4)
      expect(route).toBe('/game/socialSkills?grade=4')
    })
  })
})
