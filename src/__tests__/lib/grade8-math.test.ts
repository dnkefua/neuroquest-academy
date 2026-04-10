import { describe, it, expect } from 'vitest'
import { getCurriculumQuestsByGradeSubject, getCurriculumQuestById } from '@/lib/questData'
import type { CurriculumQuest, CurriculumQuestion } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** All known Grade 8 Math quest IDs */
const GRADE8_MATH_QUEST_IDS = [
  'g8-math',
  'g8-math-2',
  'g8-math-3',
  'g8-math-equations',
  'g8-math-pythagoras',
  'g8-math-coords',
  'g8-math-stats',
  'g8-math-numbers',
  'g8-math-algebra',
  'g8-math-adv-geometry',
  'g8-math-statistics',
]

function validateQuestStructure(quest: CurriculumQuest) {
  // Mandatory identity fields
  expect(quest.id, `${quest.id} → id must be a non-empty string`).toBeTruthy()
  expect(typeof quest.id).toBe('string')
  expect(quest.grade, `${quest.id} → grade must be 8`).toBe(8)
  expect(quest.programme, `${quest.id} → programme must be MYP`).toBe('MYP')
  expect(quest.subject, `${quest.id} → subject must be math`).toBe('math')

  // Narrative / UI fields
  expect(quest.title, `${quest.id} → title required`).toBeTruthy()
  expect(quest.realmName, `${quest.id} → realmName required`).toBeTruthy()
  expect(quest.narrativeWorld, `${quest.id} → narrativeWorld required`).toBeTruthy()
  expect(quest.characterTeacher, `${quest.id} → characterTeacher required`).toBeTruthy()
  expect(quest.teacherEmoji, `${quest.id} → teacherEmoji required`).toBeTruthy()
  expect(quest.theme, `${quest.id} → theme required`).toBeTruthy()
}

function validateQuestion(q: CurriculumQuestion, questId: string) {
  expect(q.id, `${questId} → question id required`).toBeTruthy()
  expect(q.narrative, `${questId}/${q.id} → narrative required`).toBeTruthy()
  expect(q.question, `${questId}/${q.id} → question text required`).toBeTruthy()
  expect(Array.isArray(q.options), `${questId}/${q.id} → options must be an array`).toBe(true)
  expect(q.options.length, `${questId}/${q.id} → must have at least 2 options`).toBeGreaterThanOrEqual(2)
  expect(q.correctIndex, `${questId}/${q.id} → correctIndex required`).toBeDefined()
  expect(q.correctIndex).toBeGreaterThanOrEqual(0)
  expect(q.correctIndex).toBeLessThan(q.options.length)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Grade 8 – Math Curriculum Quests', () => {
  const quests = getCurriculumQuestsByGradeSubject(8, 'math')

  // ── Collection-level ──────────────────────────────────────────────────────

  describe('collection', () => {
    it('returns a non-empty array for grade 8 math', () => {
      expect(Array.isArray(quests)).toBe(true)
      expect(quests.length).toBeGreaterThan(0)
    })

    it('every quest has grade = 8 and subject = math', () => {
      quests.forEach((q) => {
        expect(q.grade).toBe(8)
        expect(q.subject).toBe('math')
      })
    })

    it('every quest has programme = MYP', () => {
      quests.forEach((q) => expect(q.programme).toBe('MYP'))
    })

    it('quest IDs are unique', () => {
      const ids = quests.map((q) => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('contains all expected Grade 8 Math quests', () => {
      const ids = quests.map((q) => q.id)
      GRADE8_MATH_QUEST_IDS.forEach((expectedId) => {
        expect(ids, `Expected quest '${expectedId}' to exist`).toContain(expectedId)
      })
    })
  })

  // ── Per-quest structure ───────────────────────────────────────────────────

  describe('quest structure', () => {
    it('every quest has all required interface fields', () => {
      quests.forEach(validateQuestStructure)
    })

    it('every quest has at least 5 questions', () => {
      quests.forEach((q) => {
        expect(q.questions.length, `${q.id} must have ≥ 5 questions`).toBeGreaterThanOrEqual(5)
      })
    })

    it('every question has required fields and a valid correctIndex', () => {
      quests.forEach((quest) => {
        quest.questions.forEach((question) => validateQuestion(question, quest.id))
      })
    })

    it('every quest has a bossChallenge or boss', () => {
      quests.forEach((quest) => {
        const hasBoss = quest.boss !== undefined || quest.bossChallenge !== undefined
        expect(hasBoss, `${quest.id} must have a boss or bossChallenge`).toBe(true)
      })
    })
  })

  // ── Individual quest look-up ───────────────────────────────────────────────

  describe('getCurriculumQuestById', () => {
    it.each(GRADE8_MATH_QUEST_IDS)('resolves quest "%s"', (id) => {
      const quest = getCurriculumQuestById(id)
      expect(quest, `Quest '${id}' should be found by ID`).toBeDefined()
      expect(quest?.id).toBe(id)
    })
  })

  // ── Topic-specific quests ─────────────────────────────────────────────────

  describe('Equations quest (g8-math-equations)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-math-equations')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('math')
    })

    it('questions are about solving equations', () => {
      const quest = getCurriculumQuestById('g8-math-equations')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
      // All question narratives contain numeric expressions
      quest?.questions.forEach((q) => {
        expect(q.narrative).toBeTruthy()
        expect(q.options.length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  describe('Pythagoras quest (g8-math-pythagoras)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-math-pythagoras')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
    })

    it('has 5 questions covering Pythagorean theorem', () => {
      const quest = getCurriculumQuestById('g8-math-pythagoras')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Algebra quest (g8-math-algebra)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-math-algebra')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('math')
    })

    it('all questions have valid correctIndex within options bounds', () => {
      const quest = getCurriculumQuestById('g8-math-algebra')
      quest?.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      })
    })
  })

  describe('Statistics quest (g8-math-statistics)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-math-statistics')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
    })

    it('has at least 5 statistical questions', () => {
      const quest = getCurriculumQuestById('g8-math-statistics')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Advanced Geometry quest (g8-math-adv-geometry)', () => {
    it('exists and is correctly tagged', () => {
      const quest = getCurriculumQuestById('g8-math-adv-geometry')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('math')
    })

    it('questions have multi-option answers', () => {
      const quest = getCurriculumQuestById('g8-math-adv-geometry')
      quest?.questions.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(3)
      })
    })
  })

  describe('Number Systems quest (g8-math-numbers)', () => {
    it('exists and is correctly tagged', () => {
      const quest = getCurriculumQuestById('g8-math-numbers')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('math')
    })

    it('has a bossChallenge', () => {
      const quest = getCurriculumQuestById('g8-math-numbers')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })
  })

  // ── Clue validation ───────────────────────────────────────────────────────

  describe('clue fields', () => {
    it('questions with clues have required clue fields', () => {
      quests.forEach((quest) => {
        quest.questions.forEach((q) => {
          if (q.clue) {
            expect(q.clue.title, `${quest.id}/${q.id} → clue.title required`).toBeTruthy()
            expect(q.clue.explanation, `${quest.id}/${q.id} → clue.explanation required`).toBeTruthy()
            expect(q.clue.visual, `${quest.id}/${q.id} → clue.visual required`).toBeTruthy()
            expect(q.clue.cost, `${quest.id}/${q.id} → clue.cost must be a number`).toBeGreaterThanOrEqual(0)
          }
        })
      })
    })
  })
})
