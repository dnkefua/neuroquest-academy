import { describe, it, expect, beforeEach } from 'vitest'
import {
  getGradeGroup,
  getRandomPhrase,
  getVoiceForGrade,
  generateCacheKey,
  detectGenderFromName,
  STATIC_PHRASES,
  VOICE_CONFIG,
} from '@/lib/tts-cache'

describe('tts-cache', () => {
  describe('getGradeGroup', () => {
    it('returns 1-4 for grade 1', () => {
      expect(getGradeGroup(1)).toBe('1-4')
    })

    it('returns 1-4 for grade 4', () => {
      expect(getGradeGroup(4)).toBe('1-4')
    })

    it('returns 5-9 for grade 5', () => {
      expect(getGradeGroup(5)).toBe('5-9')
    })

    it('returns 5-9 for grade 9', () => {
      expect(getGradeGroup(9)).toBe('5-9')
    })

    it('returns 10-12 for grade 10', () => {
      expect(getGradeGroup(10)).toBe('10-12')
    })

    it('returns 10-12 for grade 12', () => {
      expect(getGradeGroup(12)).toBe('10-12')
    })

    it('returns 10-12 for grade above 12', () => {
      expect(getGradeGroup(15)).toBe('10-12')
    })

    it('returns 1-4 for grade 0', () => {
      expect(getGradeGroup(0)).toBe('1-4')
    })
  })

  describe('getRandomPhrase', () => {
    it('returns a phrase from grade-specific category', () => {
      const phrase = getRandomPhrase('greetings', 2)
      expect(phrase).not.toBeNull()
      expect(typeof phrase).toBe('string')
      expect(phrase!.length).toBeGreaterThan(0)
    })

    it('returns a phrase from common category when grade-specific not found', () => {
      const phrase = getRandomPhrase('welcome', 5)
      expect(phrase).not.toBeNull()
      expect(typeof phrase).toBe('string')
    })

    it('returns null for non-existent category', () => {
      const phrase = getRandomPhrase('nonexistent_category', 5)
      expect(phrase).toBeNull()
    })

    it('returns phrase for grade 10', () => {
      const phrase = getRandomPhrase('greetings', 10)
      expect(phrase).not.toBeNull()
    })

    it('returns phrase for grade 1', () => {
      const phrase = getRandomPhrase('greetings', 1)
      expect(phrase).not.toBeNull()
    })

    it('returns phrase from common feedback category', () => {
      const phrase = getRandomPhrase('feedback', 7)
      expect(phrase).not.toBeNull()
    })
  })

  describe('getVoiceForGrade', () => {
    it('returns voice config for grade 1', () => {
      const voice = getVoiceForGrade(1)
      expect(voice.voice).toBeDefined()
      expect(voice.rate).toBe(0.87)
      expect(voice.pitch).toBe(1.0)
      expect(['male', 'female']).toContain(voice.gender)
    })

    it('returns voice config for grade 5', () => {
      const voice = getVoiceForGrade(5)
      expect(voice.rate).toBe(0.95)
    })

    it('returns voice config for grade 10', () => {
      const voice = getVoiceForGrade(10)
      expect(voice.rate).toBe(1.0)
    })

    it('uses specified male gender', () => {
      const voice = getVoiceForGrade(5, 'male')
      expect(voice.gender).toBe('male')
      expect(voice.voice).toBe('en-US-Studio-Q')
    })

    it('uses specified female gender', () => {
      const voice = getVoiceForGrade(5, 'female')
      expect(voice.gender).toBe('female')
      expect(voice.voice).toBe('en-US-Studio-O')
    })

    it('returns valid voice names', () => {
      for (const grade of [1, 5, 10]) {
        const voice = getVoiceForGrade(grade)
        expect(voice.voice).toMatch(/^en-US-Studio-[OQ]$/)
      }
    })
  })

  describe('generateCacheKey', () => {
    it('generates consistent cache key for same input', () => {
      const key1 = generateCacheKey('Hello world', 5, 'male')
      const key2 = generateCacheKey('Hello world', 5, 'male')
      expect(key1).toBe(key2)
    })

    it('generates different cache key for different text', () => {
      const key1 = generateCacheKey('Hello', 5)
      const key2 = generateCacheKey('World', 5)
      expect(key1).not.toBe(key2)
    })

    it('generates different cache key for different grade', () => {
      const key1 = generateCacheKey('Hello', 1)
      const key2 = generateCacheKey('Hello', 10)
      expect(key1).not.toBe(key2)
    })

    it('generates different cache key for different gender', () => {
      const key1 = generateCacheKey('Hello', 5, 'male')
      const key2 = generateCacheKey('Hello', 5, 'female')
      expect(key1).not.toBe(key2)
    })

    it('includes grade group in key', () => {
      const key = generateCacheKey('Test', 5)
      expect(key).toContain('5-9')
    })

    it('includes voice name in key', () => {
      const key = generateCacheKey('Test', 5, 'male')
      expect(key).toContain('en-US-Studio-Q')
    })
  })

  describe('detectGenderFromName', () => {
    it('detects female name - Emma', () => {
      expect(detectGenderFromName('Emma')).toBe('female')
    })

    it('detects female name - Sophia', () => {
      expect(detectGenderFromName('Sophia')).toBe('female')
    })

    it('detects female name - Fatima', () => {
      expect(detectGenderFromName('Fatima')).toBe('female')
    })

    it('detects female name - Aisha', () => {
      expect(detectGenderFromName('Aisha')).toBe('female')
    })

    it('detects male name - Liam', () => {
      expect(detectGenderFromName('Liam')).toBe('male')
    })

    it('detects male name - Mohammed', () => {
      expect(detectGenderFromName('Mohammed')).toBe('male')
    })

    it('detects male name - Omar', () => {
      expect(detectGenderFromName('Omar')).toBe('male')
    })

    it('detects male name - Ahmed', () => {
      expect(detectGenderFromName('Ahmed')).toBe('male')
    })

    it('returns null for empty string', () => {
      expect(detectGenderFromName('')).toBeNull()
    })

    it('returns null for null input', () => {
      expect(detectGenderFromName(null)).toBeNull()
    })

    it('returns null for undefined input', () => {
      expect(detectGenderFromName(undefined)).toBeNull()
    })

    it('handles full names by using first name', () => {
      expect(detectGenderFromName('Emma Watson')).toBe('female')
      expect(detectGenderFromName('Liam Johnson')).toBe('male')
    })

    it('is case insensitive', () => {
      expect(detectGenderFromName('emma')).toBe('female')
      expect(detectGenderFromName('EMMA')).toBe('female')
      expect(detectGenderFromName('liam')).toBe('male')
      expect(detectGenderFromName('LIAM')).toBe('male')
    })

    it('handles names with extra whitespace', () => {
      expect(detectGenderFromName('  Emma  ')).toBe('female')
    })

    it('detects female name by pattern - names ending in a', () => {
      expect(detectGenderFromName('Isabella')).toBe('female')
      expect(detectGenderFromName('Victoria')).toBe('female')
    })

    it('detects male name by pattern - names ending in us', () => {
      expect(detectGenderFromName('Marcus')).toBe('male')
      expect(detectGenderFromName('Titus')).toBe('male')
    })

    it('handles male exception for names ending in a', () => {
      expect(detectGenderFromName('Joshua')).toBe('male')
      expect(detectGenderFromName('Noah')).toBe('male')
    })

    it('returns null for Luca (exception but no male pattern match)', () => {
      expect(detectGenderFromName('Luca')).toBeNull()
    })

    it('returns null for Luca (not in exception list, pattern does not match male endings)', () => {
      expect(detectGenderFromName('Luca')).toBeNull()
    })

    it('returns null for unknown name', () => {
      expect(detectGenderFromName('Xylophone')).toBeNull()
    })
  })

  describe('STATIC_PHRASES', () => {
    it('has common category', () => {
      expect(STATIC_PHRASES['common']).toBeDefined()
    })

    it('has grade groups 1-4, 5-9, 10-12', () => {
      expect(STATIC_PHRASES['1-4']).toBeDefined()
      expect(STATIC_PHRASES['5-9']).toBeDefined()
      expect(STATIC_PHRASES['10-12']).toBeDefined()
    })

    it('common category has welcome phrases', () => {
      expect(STATIC_PHRASES['common']['welcome'].length).toBeGreaterThan(0)
    })

    it('common category has feedback phrases', () => {
      expect(STATIC_PHRASES['common']['feedback'].length).toBeGreaterThan(0)
    })
  })

  describe('VOICE_CONFIG', () => {
    it('has config for all grade groups', () => {
      expect(VOICE_CONFIG['1-4']).toBeDefined()
      expect(VOICE_CONFIG['5-9']).toBeDefined()
      expect(VOICE_CONFIG['10-12']).toBeDefined()
    })

    it('each config has male and female voices', () => {
      for (const group of ['1-4', '5-9', '10-12']) {
        expect(VOICE_CONFIG[group].male).toBeDefined()
        expect(VOICE_CONFIG[group].female).toBeDefined()
      }
    })

    it('rates increase with grade level', () => {
      expect(VOICE_CONFIG['1-4'].rate).toBe(0.87)
      expect(VOICE_CONFIG['5-9'].rate).toBe(0.95)
      expect(VOICE_CONFIG['10-12'].rate).toBe(1.0)
    })
  })
})
