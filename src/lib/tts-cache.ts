// Pre-cached static phrases for TTS
// These are common phrases that can be pre-generated to reduce API calls

export const STATIC_PHRASES: Record<string, Record<string, string[]>> = {
  // Common greetings and feedback
  'common': {
    'welcome': [
      'Welcome to your quest!',
      'Your adventure begins!',
      'Are you ready?',
      'Let\'s begin!',
      'Great job!',
      'Well done!',
      'Excellent!',
      'Correct!',
      'Try again!',
      'You can do it!',
    ],
    'feedback': [
      'That\'s right!',
      'Good thinking!',
      'Keep going!',
      'Almost there!',
      'Wonderful!',
      'Amazing work!',
      'You\'re learning so much!',
    ],
  },

  // Grade-specific greetings
  '1-4': {
    'greetings': [
      'Welcome, young explorer!',
      'Hello there, friend!',
      'Hi! Let\'s have fun learning!',
      'Wow, you\'re doing great!',
    ],
  },

  '5-9': {
    'greetings': [
      'Welcome, brave adventurer!',
      'Greetings, explorer!',
      'Ready for a challenge?',
      'Your quest awaits!',
    ],
  },

  '10-12': {
    'greetings': [
      'Welcome, scholar!',
      'Greetings, advanced learner!',
      'Your expertise is needed here!',
      'Prepare for an intellectual challenge!',
    ],
  },
};

// Grade group determination
export function getGradeGroup(grade: number): string {
  if (grade <= 4) return '1-4';
  if (grade <= 9) return '5-9';
  return '10-12';
}

// Get a random phrase from a category
export function getRandomPhrase(category: string, grade: number): string | null {
  const gradeGroup = getGradeGroup(grade);
  const gradePhrases = STATIC_PHRASES[gradeGroup]?.[category];
  if (gradePhrases && gradePhrases.length > 0) {
    return gradePhrases[Math.floor(Math.random() * gradePhrases.length)];
  }

  const commonPhrases = STATIC_PHRASES['common']?.[category];
  if (commonPhrases && commonPhrases.length > 0) {
    return commonPhrases[Math.floor(Math.random() * commonPhrases.length)];
  }

  return null;
}

// Voice configuration for TTS
export const VOICE_CONFIG: Record<string, { male: string; female: string; rate: number; pitch: number }> = {
  '1-4': {
    male: 'en-US-Neural2-D',
    female: 'en-US-Neural2-F',
    rate: 0.85,
    pitch: 1.1, // Slightly higher for kid-friendly tone
  },
  '5-9': {
    male: 'en-US-Neural2-J',
    female: 'en-US-Neural2-C',
    rate: 0.90,
    pitch: 1.05,
  },
  '10-12': {
    male: 'en-US-Neural2-A',
    female: 'en-US-Neural2-E',
    rate: 0.95,
    pitch: 1.0, // Normal pitch for mature voices
  },
};

// Get voice settings for a grade
export function getVoiceForGrade(grade: number, gender?: 'male' | 'female'): {
  voice: string;
  rate: number;
  pitch: number;
  gender: 'male' | 'female';
} {
  const gradeGroup = getGradeGroup(grade);
  const config = VOICE_CONFIG[gradeGroup];
  const selectedGender = gender || (Math.random() > 0.5 ? 'male' : 'female');

  return {
    voice: selectedGender === 'male' ? config.male : config.female,
    rate: config.rate,
    pitch: config.pitch,
    gender: selectedGender,
  };
}

// Cache key generator
export function generateCacheKey(text: string, grade: number, gender?: 'male' | 'female'): string {
  const gradeGroup = getGradeGroup(grade);
  const voiceConfig = getVoiceForGrade(grade, gender);
  const hash = text.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  return `${gradeGroup}_${voiceConfig.voice}_${Math.abs(hash)}_${text.length}`;
}