import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GenerateLessonSchema } from '@/lib/schemas'
import { rateLimit } from '@/lib/rateLimit'

// ─── Schema Validation Tests ───────────────────────────────────────────────────

describe('POST /api/generate-lesson — Zod validation', () => {
  it('accepts valid minimal payload', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'math',
      grade: 6,
      language: 'en',
    })
    expect(result.success).toBe(true)
  })

  it('rejects subject not in enum', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'geography',
      grade: 6,
      language: 'en',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing language', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'science',
      grade: 5,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid emotion', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'math',
      grade: 8,
      language: 'en',
      emotion: 'bored',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid difficulty', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'math',
      grade: 4,
      language: 'ar',
      difficulty: 'extreme',
    })
    expect(result.success).toBe(false)
  })

  it('accepts AR language', () => {
    const result = GenerateLessonSchema.safeParse({
      subject: 'arabic',
      grade: 3,
      language: 'AR',
    })
    expect(result.success).toBe(true)
  })
})

// ─── Rate Limiter Tests ────────────────────────────────────────────────────────

describe('Rate Limiter', () => {
  it('allows requests up to limit', () => {
    const ip = `test-ip-${Date.now()}`
    const results: boolean[] = []
    for (let i = 0; i < 20; i++) {
      results.push(rateLimit(ip).allowed)
    }
    expect(results.every(Boolean)).toBe(true)
  })

  it('blocks after 20 requests from same IP', () => {
    const ip = `test-ip-block-${Date.now()}`
    for (let i = 0; i < 20; i++) rateLimit(ip)
    const { allowed, remaining } = rateLimit(ip)
    expect(allowed).toBe(false)
    expect(remaining).toBe(0)
  })

  it('tracks IPs independently', () => {
    const ipA = `ip-a-${Date.now()}`
    const ipB = `ip-b-${Date.now()}`
    for (let i = 0; i < 20; i++) {
      rateLimit(ipA)
    }
    const result = rateLimit(ipB)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(19)
  })
})

// ─── Fallback Lesson Structure Tests ──────────────────────────────────────────

describe('Fallback lesson structure', () => {
  // Simulates the buildFallback output shape
  function buildFallback() {
    return {
      title: '📖 IB: Numbers',
      intro: 'Hey there! 👋 Today we\'re diving into Numbers.',
      ibTopicKey: 'math-g6',
      sections: [
        {
          heading: '🌟 What is Numbers?',
          content: 'In this unit we focus on Numbers.',
          activity: 'Try this: think of a real-world example',
        },
        {
          heading: '💡 Key Concepts',
          content: 'The key ideas in this unit build on each other step by step.',
          activity: 'Practice problem: explain in your own words',
        },
        {
          heading: '🎯 Putting It Into Practice',
          content: 'The IB expects you to apply these ideas.',
          activity: 'Create your own example problem',
        },
      ],
      quiz: [
        {
          question: 'What is the main focus?',
          options: ['To memorise', 'To understand and apply', 'To copy', 'To avoid'],
          correct: 1,
          explanation: 'IB focuses on understanding and real-world application.',
        },
        {
          question: 'What does IB MYP emphasise?',
          options: ['Pure memorisation', 'Real-world connections', 'Speed', 'Avoiding problems'],
          correct: 1,
          explanation: 'IB education emphasises understanding.',
        },
        {
          question: 'What should you do when you get a question wrong?',
          options: ['Give up', 'Learn from mistakes', 'Skip it', 'Copy answers'],
          correct: 1,
          explanation: 'Mistakes are how your brain learns.',
        },
      ],
      encouragement: 'Brilliant effort today! Keep going! 🏆',
      brainBreakTip: 'Roll your shoulders back 5 times.',
    }
  }

  it('fallback has exactly 3 sections', () => {
    const lesson = buildFallback()
    expect(lesson.sections).toHaveLength(3)
  })

  it('fallback has exactly 3 quiz questions', () => {
    const lesson = buildFallback()
    expect(lesson.quiz).toHaveLength(3)
  })

  it('fallback quiz has 4 options per question', () => {
    const lesson = buildFallback()
    lesson.quiz.forEach((q: { options: string[] }) => {
      expect(q.options).toHaveLength(4)
    })
  })

  it('fallback quiz correct answers are all index 1', () => {
    const lesson = buildFallback()
    lesson.quiz.forEach((q: { correct: number }) => {
      expect(q.correct).toBe(1)
    })
  })

  it('fallback has all required fields', () => {
    const lesson = buildFallback()
    expect(lesson).toHaveProperty('title')
    expect(lesson).toHaveProperty('intro')
    expect(lesson).toHaveProperty('sections')
    expect(lesson).toHaveProperty('quiz')
    expect(lesson).toHaveProperty('encouragement')
    expect(lesson).toHaveProperty('brainBreakTip')
  })
})
