const en = {
  welcome_back: 'Welcome back',
  how_feeling: 'How are you feeling right now?',
  choose_subject: 'Choose a Subject',
  brain_break: 'Take a Brain Break!',
  brain_break_desc: 'A quick calming activity to reset your mind ✨',
  loading: 'Loading...',
  sign_in: 'Sign In',
  sign_up: 'Sign Up',
  next: 'Next →',
  submit: 'Submit Answers ✅',
  see_results: 'See My Results 🎉',
  start_quiz: 'Start Quiz 🧩',
  dashboard: 'Dashboard',
  back: '← Back',
  day_streak: 'day streak',
  level: 'Level',
  xp_earned: 'XP Earned',
  quiz_score: 'Quiz Score',
  amazing_work: 'Amazing work',
  generating: 'Creating your personalized lesson...',
  generating_desc: 'Gemini AI is crafting something special for you ✨',
};

const ar: typeof en = {
  welcome_back: 'مرحباً بعودتك',
  how_feeling: 'كيف تشعر الآن؟',
  choose_subject: 'اختر مادة',
  brain_break: 'خذ استراحة ذهنية!',
  brain_break_desc: 'نشاط مهدئ سريع لإعادة ضبط عقلك ✨',
  loading: 'جاري التحميل...',
  sign_in: 'تسجيل الدخول',
  sign_up: 'إنشاء حساب',
  next: 'التالي →',
  submit: 'أرسل الإجابات ✅',
  see_results: 'اعرض نتائجي 🎉',
  start_quiz: 'ابدأ الاختبار 🧩',
  dashboard: 'لوحة التحكم',
  back: '← رجوع',
  day_streak: 'يوم متتالي',
  level: 'المستوى',
  xp_earned: 'نقاط XP المكتسبة',
  quiz_score: 'نتيجة الاختبار',
  amazing_work: 'عمل رائع',
  generating: 'جاري إنشاء درسك الشخصي...',
  generating_desc: 'يقوم Gemini AI بإنشاء شيء مميز لك ✨',
};

export type TranslationKey = keyof typeof en;

export function useTranslations(language: 'EN' | 'AR' = 'EN') {
  const dict = language === 'AR' ? ar : en;
  return (key: TranslationKey) => dict[key] ?? key;
}
