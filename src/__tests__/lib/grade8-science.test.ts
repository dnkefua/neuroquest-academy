import { describe, it, expect } from 'vitest'
import { getCurriculumQuestsByGradeSubject, getCurriculumQuestById } from '@/lib/questData'
import type { CurriculumQuest, CurriculumQuestion } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** All known Grade 8 Science quest IDs */
const GRADE8_SCIENCE_QUEST_IDS = [
  'g8-science',
  'g8-science-2',
  'g8-science-3',
  'g8-science-chem',
  'g8-science-physics',
  'g8-science-biology',
  'g8-science-earth',
  'g8-science-chemistry',
  'g8-science-ecology',
  'g8-science-biology-2',   // Expanded IB MYP Bio-Dome quest
  'g8-science-physics-2',   // Expanded IB MYP Kinetic Core quest
]

function validateQuestStructure(quest: CurriculumQuest) {
  expect(quest.id, `${quest.id} → id required`).toBeTruthy()
  expect(typeof quest.id).toBe('string')
  expect(quest.grade, `${quest.id} → grade must be 8`).toBe(8)
  expect(quest.programme, `${quest.id} → programme must be MYP`).toBe('MYP')
  expect(quest.subject, `${quest.id} → subject must be science`).toBe('science')
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
  expect(Array.isArray(q.options), `${questId}/${q.id} → options must be array`).toBe(true)
  expect(q.options.length, `${questId}/${q.id} → must have ≥ 2 options`).toBeGreaterThanOrEqual(2)
  expect(q.correctIndex).toBeDefined()
  expect(q.correctIndex).toBeGreaterThanOrEqual(0)
  expect(q.correctIndex).toBeLessThan(q.options.length)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Grade 8 – Science Curriculum Quests', () => {
  const quests = getCurriculumQuestsByGradeSubject(8, 'science')

  // ── Collection-level ──────────────────────────────────────────────────────

  describe('collection', () => {
    it('returns a non-empty array for grade 8 science', () => {
      expect(Array.isArray(quests)).toBe(true)
      expect(quests.length).toBeGreaterThan(0)
    })

    it('every quest has grade = 8 and subject = science', () => {
      quests.forEach((q) => {
        expect(q.grade).toBe(8)
        expect(q.subject).toBe('science')
      })
    })

    it('every quest has programme = MYP', () => {
      quests.forEach((q) => expect(q.programme).toBe('MYP'))
    })

    it('quest IDs are unique within grade 8 science', () => {
      const ids = quests.map((q) => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('contains all expected Grade 8 Science quests', () => {
      const ids = quests.map((q) => q.id)
      GRADE8_SCIENCE_QUEST_IDS.forEach((expectedId) => {
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

    it('question options are all non-empty strings', () => {
      quests.forEach((quest) => {
        quest.questions.forEach((q) => {
          q.options.forEach((opt) => {
            expect(typeof opt).toBe('string')
            expect(opt.trim().length).toBeGreaterThan(0)
          })
        })
      })
    })
  })

  // ── Individual quest look-up ───────────────────────────────────────────────

  describe('getCurriculumQuestById', () => {
    it.each(GRADE8_SCIENCE_QUEST_IDS)('resolves quest "%s"', (id) => {
      const quest = getCurriculumQuestById(id)
      expect(quest, `Quest '${id}' should be found by ID`).toBeDefined()
      expect(quest?.id).toBe(id)
    })
  })

  // ── Topic-specific quests ─────────────────────────────────────────────────

  describe('Matter & Periodic Table (g8-science)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-science')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('has 5 questions', () => {
      const quest = getCurriculumQuestById('g8-science')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
    })

    it('has a boss challenge', () => {
      const quest = getCurriculumQuestById('g8-science')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })
  })

  describe('Forces & Motion (g8-science-2)', () => {
    it('exists and is correctly tagged', () => {
      const quest = getCurriculumQuestById('g8-science-2')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('all questions have valid correctIndex', () => {
      const quest = getCurriculumQuestById('g8-science-2')
      quest?.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      })
    })
  })

  describe('Cells & Genetics (g8-science-3)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-science-3')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
    })

    it('has at least 5 questions', () => {
      const quest = getCurriculumQuestById('g8-science-3')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Chemistry quest (g8-science-chemistry)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-science-chemistry')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('questions have multiple-choice options', () => {
      const quest = getCurriculumQuestById('g8-science-chemistry')
      quest?.questions.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(3)
      })
    })
  })

  describe('Physics quest (g8-science-physics)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-science-physics')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('has a boss challenge', () => {
      const quest = getCurriculumQuestById('g8-science-physics')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })
  })

  describe('Biology quest (g8-science-biology)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-science-biology')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('has at least 5 questions', () => {
      const quest = getCurriculumQuestById('g8-science-biology')
      expect(quest?.questions.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Earth Science quest (g8-science-earth)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-science-earth')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
    })

    it('all questions have a narrative', () => {
      const quest = getCurriculumQuestById('g8-science-earth')
      quest?.questions.forEach((q) => {
        expect(q.narrative.trim().length).toBeGreaterThan(0)
      })
    })
  })

  describe('Ecology quest (g8-science-ecology)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-science-ecology')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('science')
    })

    it('has a boss challenge', () => {
      const quest = getCurriculumQuestById('g8-science-ecology')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })
  })

  // ── Clue validation ───────────────────────────────────────────────────────

  describe('clue fields', () => {
    it('questions with clues have all required clue fields', () => {
      quests.forEach((quest) => {
        quest.questions.forEach((q) => {
          if (q.clue) {
            expect(q.clue.title, `${quest.id}/${q.id} → clue.title required`).toBeTruthy()
            expect(q.clue.explanation, `${quest.id}/${q.id} → clue.explanation required`).toBeTruthy()
            expect(q.clue.visual, `${quest.id}/${q.id} → clue.visual required`).toBeTruthy()
            expect(typeof q.clue.cost).toBe('number')
            expect(q.clue.cost).toBeGreaterThanOrEqual(0)
          }
        })
      })
    })
  })
})
