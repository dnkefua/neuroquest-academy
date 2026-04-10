import { describe, it, expect } from 'vitest'
import { getCurriculumQuestsByGradeSubject, getCurriculumQuestById } from '@/lib/questData'
import type { CurriculumQuest, CurriculumQuestion } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** All known Grade 8 English quest IDs */
const GRADE8_ENGLISH_QUEST_IDS = [
  'g8-english',     // Poetry & Literary Devices
  'g8-english-2',   // Narrative Writing
  'g8-english-3',   // Shakespeare & Drama
  'g8-english-4',   // Non-Fiction & Media Analysis
  'g8-english-5',   // Comparative Text Analysis
  'g8-english-6',   // Argumentative Essay Writing
  'g8-english-7',   // Oral Communication & Debate
]

function validateQuestStructure(quest: CurriculumQuest) {
  expect(quest.id, `${quest.id} → id required`).toBeTruthy()
  expect(typeof quest.id).toBe('string')
  expect(quest.grade, `${quest.id} → grade must be 8`).toBe(8)
  expect(quest.programme, `${quest.id} → programme must be MYP`).toBe('MYP')
  expect(quest.subject, `${quest.id} → subject must be english`).toBe('english')
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

describe('Grade 8 – English Curriculum Quests', () => {
  const quests = getCurriculumQuestsByGradeSubject(8, 'english')

  // ── Collection-level ──────────────────────────────────────────────────────

  describe('collection', () => {
    it('returns a non-empty array for grade 8 english', () => {
      expect(Array.isArray(quests)).toBe(true)
      expect(quests.length).toBeGreaterThan(0)
    })

    it('contains at least 7 quests (3 original + 4 IB MYP expansions)', () => {
      expect(quests.length).toBeGreaterThanOrEqual(7)
    })

    it('every quest has grade = 8 and subject = english', () => {
      quests.forEach((q) => {
        expect(q.grade).toBe(8)
        expect(q.subject).toBe('english')
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

    it('contains all expected Grade 8 English quests', () => {
      const ids = quests.map((q) => q.id)
      GRADE8_ENGLISH_QUEST_IDS.forEach((expectedId) => {
        expect(ids, `Expected quest '${expectedId}' to exist`).toContain(expectedId)
      })
    })
  })

  // ── Per-quest structure ───────────────────────────────────────────────────

  describe('quest structure', () => {
    it('every quest has all required interface fields', () => {
      quests.forEach(validateQuestStructure)
    })

    it('every quest has exactly 5 questions', () => {
      quests.forEach((q) => {
        expect(q.questions.length, `${q.id} must have exactly 5 questions`).toBe(5)
      })
    })

    it('every question has required fields and a valid correctIndex', () => {
      quests.forEach((quest) => {
        quest.questions.forEach((question) => validateQuestion(question, quest.id))
      })
    })

    it('every quest has a bossChallenge', () => {
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

    it('question IDs are unique across the entire subject', () => {
      const allQuestionIds: string[] = []
      quests.forEach((quest) => {
        quest.questions.forEach((q) => allQuestionIds.push(q.id))
      })
      const uniqueIds = new Set(allQuestionIds)
      expect(uniqueIds.size).toBe(allQuestionIds.length)
    })
  })

  // ── Individual quest look-up ───────────────────────────────────────────────

  describe('getCurriculumQuestById', () => {
    it.each(GRADE8_ENGLISH_QUEST_IDS)('resolves quest "%s"', (id) => {
      const quest = getCurriculumQuestById(id)
      expect(quest, `Quest '${id}' should be found by ID`).toBeDefined()
      expect(quest?.id).toBe(id)
    })
  })

  // ── Original quests (pre-expansion) ───────────────────────────────────────

  describe('Poetry & Literary Devices (g8-english)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-english')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
    })

    it('has 5 questions about poetry', () => {
      const quest = getCurriculumQuestById('g8-english')
      expect(quest?.questions.length).toBe(5)
    })

    it('has a boss challenge', () => {
      const quest = getCurriculumQuestById('g8-english')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })
  })

  describe('Narrative Writing (g8-english-2)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-english-2')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
    })

    it('all questions have valid correctIndex', () => {
      const quest = getCurriculumQuestById('g8-english-2')
      quest?.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      })
    })
  })

  describe('Shakespeare & Drama (g8-english-3)', () => {
    it('exists and is tagged correctly', () => {
      const quest = getCurriculumQuestById('g8-english-3')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
    })

    it('has 5 questions', () => {
      const quest = getCurriculumQuestById('g8-english-3')
      expect(quest?.questions.length).toBe(5)
    })
  })

  // ── New IB MYP expansion quests ────────────────────────────────────────────

  describe('Non-Fiction & Media Analysis (g8-english-4)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-english-4')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
      expect(quest?.programme).toBe('MYP')
    })

    it('has exactly 5 questions', () => {
      const quest = getCurriculumQuestById('g8-english-4')
      expect(quest?.questions.length).toBe(5)
    })

    it('has a bossChallenge with a reward', () => {
      const quest = getCurriculumQuestById('g8-english-4')
      expect(quest?.bossChallenge).toBeDefined()
      expect(quest?.bossChallenge?.question).toBeTruthy()
      expect(quest?.bossChallenge?.answer).toBeTruthy()
      expect(quest?.bossChallenge?.reward).toBeTruthy()
    })

    it('all questions have clues with required fields', () => {
      const quest = getCurriculumQuestById('g8-english-4')
      quest?.questions.forEach((q) => {
        expect(q.clue, `${q.id} → clue required`).toBeDefined()
        expect(q.clue?.title).toBeTruthy()
        expect(q.clue?.explanation).toBeTruthy()
      })
    })

    it('characterTeacher and teacherEmoji are populated', () => {
      const quest = getCurriculumQuestById('g8-english-4')
      expect(quest?.characterTeacher.trim().length).toBeGreaterThan(0)
      expect(quest?.teacherEmoji.trim().length).toBeGreaterThan(0)
    })
  })

  describe('Comparative Text Analysis (g8-english-5)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-english-5')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
    })

    it('has exactly 5 questions', () => {
      const quest = getCurriculumQuestById('g8-english-5')
      expect(quest?.questions.length).toBe(5)
    })

    it('has a bossChallenge', () => {
      const quest = getCurriculumQuestById('g8-english-5')
      const hasBoss = quest?.boss !== undefined || quest?.bossChallenge !== undefined
      expect(hasBoss).toBe(true)
    })

    it('questions have multiple-choice options (≥ 3)', () => {
      const quest = getCurriculumQuestById('g8-english-5')
      quest?.questions.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(3)
      })
    })

    it('has a theme', () => {
      const quest = getCurriculumQuestById('g8-english-5')
      expect(quest?.theme.trim().length).toBeGreaterThan(0)
    })
  })

  describe('Argumentative Essay Writing (g8-english-6)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-english-6')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
      expect(quest?.programme).toBe('MYP')
    })

    it('has exactly 5 questions', () => {
      const quest = getCurriculumQuestById('g8-english-6')
      expect(quest?.questions.length).toBe(5)
    })

    it('has a bossChallenge with a reward badge', () => {
      const quest = getCurriculumQuestById('g8-english-6')
      expect(quest?.bossChallenge).toBeDefined()
      expect(quest?.bossChallenge?.reward).toBeTruthy()
    })

    it('all questions have valid correctIndex within options bounds', () => {
      const quest = getCurriculumQuestById('g8-english-6')
      quest?.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      })
    })

    it('all questions have clues', () => {
      const quest = getCurriculumQuestById('g8-english-6')
      quest?.questions.forEach((q) => {
        expect(q.clue, `${q.id} must have a clue`).toBeDefined()
      })
    })
  })

  describe('Oral Communication & Debate (g8-english-7)', () => {
    it('exists and has correct metadata', () => {
      const quest = getCurriculumQuestById('g8-english-7')
      expect(quest).toBeDefined()
      expect(quest?.grade).toBe(8)
      expect(quest?.subject).toBe('english')
      expect(quest?.programme).toBe('MYP')
    })

    it('has exactly 5 questions', () => {
      const quest = getCurriculumQuestById('g8-english-7')
      expect(quest?.questions.length).toBe(5)
    })

    it('has a bossChallenge with all required fields', () => {
      const quest = getCurriculumQuestById('g8-english-7')
      expect(quest?.bossChallenge).toBeDefined()
      expect(quest?.bossChallenge?.question).toBeTruthy()
      expect(quest?.bossChallenge?.answer).toBeTruthy()
      expect(quest?.bossChallenge?.reward).toBeTruthy()
    })

    it('all questions have valid correctIndex', () => {
      const quest = getCurriculumQuestById('g8-english-7')
      quest?.questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      })
    })

    it('characterTeacher, teacherEmoji, and theme are all set', () => {
      const quest = getCurriculumQuestById('g8-english-7')
      expect(quest?.characterTeacher.trim().length).toBeGreaterThan(0)
      expect(quest?.teacherEmoji.trim().length).toBeGreaterThan(0)
      expect(quest?.theme.trim().length).toBeGreaterThan(0)
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
