import { describe, it, expect } from 'vitest'
import {
  GenerateLessonSchema,
  TutorExplanationSchema,
  NPCReactionSchema,
} from '@/lib/schemas'

describe('GenerateLessonSchema', () => {
  it('accepts valid en input', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'math',
      grade: 6,
      language: 'en',
    })
    expect(result.success).toBe(true)
  })

  it('accepts grade as string', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'science',
      grade: '10',
      language: 'ar',
      emotion: 'happy',
      difficulty: 'hard',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.grade).toBe('10')
    }
  })

  it('rejects invalid subject', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'history',
      grade: 5,
      language: 'en',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const result = GenerateLessonSchema.safeParse({ subject: 'math' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid emotion', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'math',
      grade: 4,
      language: 'en',
      emotion: 'excited',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid language', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'science',
      grade: 7,
      language: 'fr',
    })
    expect(result.success).toBe(false)
  })

  it('accepts AR language uppercase', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'arabic',
      grade: 3,
      language: 'AR',
    })
    expect(result.success).toBe(true)
  })
})

describe('TutorExplanationSchema', () => {
  it('accepts valid input', () => {
    const result = TutorExplanationSchema.safeParse({
      question: 'What is 2+2?',
      studentAnswer: '5',
      correctAnswer: '4',
      grade: 5,
      language: 'en',
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional studentName', () => {
    const result = TutorExplanationSchema.safeParse({
      question: 'What is 3x3?',
      studentAnswer: '12',
      correctAnswer: '9',
      studentName: 'Aisha',
      grade: '6',
      language: 'ar',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty question', () => {
    const result = TutorExplanationSchema.safeParse({
      question: '',
      studentAnswer: '5',
      correctAnswer: '4',
      grade: 3,
      language: 'en',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = TutorExplanationSchema.safeParse({
      question: 'What is 1+1?',
    })
    expect(result.success).toBe(false)
  })
})

describe('NPCReactionSchema', () => {
  it('accepts valid input', () => {
    const result = NPCReactionSchema.safeParse({
      npcName: 'Omar',
      situation: 'A friend dropped their books',
      studentChoice: 'Help them pick up',
      wasCorrect: true,
      grade: 5,
      language: 'en',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty npcName', () => {
    const result = NPCReactionSchema.safeParse({
      npcName: '',
      situation: 'Test',
      studentChoice: 'Smile',
      wasCorrect: false,
      grade: 4,
      language: 'en',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional emotion field', () => {
    const result = NPCReactionSchema.safeParse({
      npcName: 'Fatima',
      situation: 'Someone is sad',
      studentChoice: 'Cheer them up',
      wasCorrect: true,
      emotion: 'happy',
      grade: 7,
      language: 'ar',
    })
    expect(result.success).toBe(true)
  })
})
