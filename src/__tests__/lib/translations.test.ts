import { describe, it, expect } from 'vitest'
import { useTranslations } from '@/lib/translations'

describe('useTranslations', () => {
  describe('English translations', () => {
    it('returns correct welcome message', () => {
      const t = useTranslations('EN')
      expect(t('welcome_back')).toBe('Welcome back')
    })

    it('returns correct loading text', () => {
      const t = useTranslations('EN')
      expect(t('loading')).toBe('Loading...')
    })

    it('returns correct sign in text', () => {
      const t = useTranslations('EN')
      expect(t('sign_in')).toBe('Sign In')
    })

    it('returns correct sign up text', () => {
      const t = useTranslations('EN')
      expect(t('sign_up')).toBe('Sign Up')
    })

    it('returns correct next button text', () => {
      const t = useTranslations('EN')
      expect(t('next')).toBe('Next →')
    })

    it('returns correct submit text', () => {
      const t = useTranslations('EN')
      expect(t('submit')).toBe('Submit Answers ✅')
    })

    it('returns correct dashboard text', () => {
      const t = useTranslations('EN')
      expect(t('dashboard')).toBe('Dashboard')
    })

    it('returns correct brain break text', () => {
      const t = useTranslations('EN')
      expect(t('brain_break')).toBe('Take a Brain Break!')
    })
  })

  describe('Arabic translations', () => {
    it('returns correct welcome message in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('welcome_back')).toBe('مرحباً بعودتك')
    })

    it('returns correct loading text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('loading')).toBe('جاري التحميل...')
    })

    it('returns correct sign in text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('sign_in')).toBe('تسجيل الدخول')
    })

    it('returns correct sign up text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('sign_up')).toBe('إنشاء حساب')
    })

    it('returns correct next button text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('next')).toBe('← التالي')
    })

    it('returns correct dashboard text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('dashboard')).toBe('لوحة التحكم')
    })

    it('returns correct brain break text in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('brain_break')).toBe('خذ استراحة ذهنية!')
    })
  })

  describe('default language', () => {
    it('defaults to English when no language specified', () => {
      const t = useTranslations()
      expect(t('welcome_back')).toBe('Welcome back')
    })
  })

  describe('translation completeness', () => {
    it('has Arabic translation for every English key', () => {
      const ar = useTranslations('AR')
      const allKeys: string[] = [
        'welcome_back', 'how_feeling', 'choose_subject', 'brain_break',
        'brain_break_desc', 'loading', 'sign_in', 'sign_up', 'next',
        'submit', 'see_results', 'start_quiz', 'dashboard', 'back',
        'day_streak', 'level', 'xp_earned', 'quiz_score', 'amazing_work',
        'generating', 'generating_desc',
      ]
      for (const key of allKeys) {
        const arValue = ar(key as Parameters<typeof ar>[0])
        expect(arValue).not.toBe(key)
        expect(arValue.length).toBeGreaterThan(0)
      }
    })

    it('all Arabic translations are non-empty strings', () => {
      const ar = useTranslations('AR')
      const allKeys: string[] = [
        'welcome_back', 'how_feeling', 'choose_subject', 'brain_break',
        'brain_break_desc', 'loading', 'sign_in', 'sign_up', 'next',
        'submit', 'see_results', 'start_quiz', 'dashboard', 'back',
        'day_streak', 'level', 'xp_earned', 'quiz_score', 'amazing_work',
        'generating', 'generating_desc',
      ]
      for (const key of allKeys) {
        const value = ar(key as Parameters<typeof ar>[0])
        expect(typeof value).toBe('string')
        expect(value.trim().length).toBeGreaterThan(0)
      }
    })
  })

  describe('edge cases', () => {
    it('returns key as fallback for unknown key in English', () => {
      const t = useTranslations('EN')
      expect(t('nonexistent_key' as any)).toBe('nonexistent_key')
    })

    it('returns key as fallback for unknown key in Arabic', () => {
      const t = useTranslations('AR')
      expect(t('nonexistent_key' as any)).toBe('nonexistent_key')
    })
  })
})
