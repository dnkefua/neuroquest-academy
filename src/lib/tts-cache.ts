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

// Voice configuration for TTS — Google Cloud Studio voices (highest quality tier)
// Studio voices have human-like warmth and natural prosody; pitch not supported
export const VOICE_CONFIG: Record<string, { male: string; female: string; rate: number; pitch: number }> = {
  '1-4': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 0.87,
    pitch: 1.0,
  },
  '5-9': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 0.95,
    pitch: 1.0,
  },
  '10-12': {
    male: 'en-US-Studio-Q',
    female: 'en-US-Studio-O',
    rate: 1.0,
    pitch: 1.0,
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

/**
 * Detect gender from a given name using common naming patterns.
 * Returns 'female', 'male', or null if unknown.
 * Used for TTS voice selection - female names get female voice, male names get male voice.
 */
export function detectGenderFromName(name: string | null | undefined): 'male' | 'female' | null {
  if (!name) return null;

  const firstName = name.trim().split(' ')[0].toLowerCase();
  if (!firstName) return null;

  // Common female names list (partial - most common)
  const femaleNames = new Set([
    'emma', 'olivia', 'ava', 'sophia', 'isabella', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn',
    'abigail', 'emily', 'elizabeth', 'sofia', 'madison', 'ella', 'victoria', 'chloe', 'grace', 'lily',
    'scarlett', 'aria', 'aurora', 'penelope', 'zoe', 'stella', 'luna', 'hannah', 'layla', 'nora',
    'addison', 'bella', 'claire', 'skylar', 'lucy', 'paisley', 'everly', 'anna', 'caroline', 'jessica',
    'jennifer', 'sarah', 'katherine', 'laura', 'rachel', 'rebecca', 'samantha', 'ashley', 'megan', 'nicole',
    'stephanie', 'amanda', 'melissa', 'heather', 'kimberly', 'michelle', 'amber', 'danielle', 'tiffany', 'kristen',
    'fatima', 'maryam', 'noor', 'layla', 'amira', 'yasmin', 'hana', 'zara', 'leila', 'nadia',
    'aisha', 'khadija', 'aaliyah', 'salma', 'mariam', 'dina', 'rasha', 'lama', 'nouf', 'shaikha',
    'hessa', 'mariam', 'noura', 'shaikha', 'fatima', 'mouza', 'aisha', 'hind', 'shamma', 'latifa',
    'sara', 'lama', 'dana', 'tala', 'maha', 'rana', 'jana', 'lara', 'maya', 'yara',
  ]);

  // Common male names list (partial - most common)
  const maleNames = new Set([
    'liam', 'noah', 'oliver', 'elijah', 'william', 'james', 'benjamin', 'lucas', 'henry', 'alexander',
    'mason', 'michael', 'ethan', 'daniel', 'jacob', 'logan', 'jackson', 'levi', 'sebastian', 'mateo',
    'jack', 'owen', 'theodore', 'aiden', 'john', 'david', 'leo', 'luke', 'jayden', 'dylan',
    'mohammed', 'ahmed', 'omar', 'khalid', 'yousef', 'ali', 'hassan', 'hamza', 'kareem', 'rami',
    'rashid', 'saeed', 'tariq', 'faris', 'amir', 'zayed', 'abdullah', 'sultan', 'saif', 'majed',
    'marcus', 'titus', 'felix', 'silas', 'arthur', 'ryan', 'nathan', 'andrew', 'tyler', 'brandon',
    'jason', 'joshua', 'matthew', 'caleb', 'isaac', 'nolan', 'cameron', 'christian', 'hunter', 'khaled',
    'khalifa', 'mohamed', 'mahmoud', 'omar', 'kareem', 'tamer', 'mostafa', 'ahmad', 'rashid', 'fahad',
    'mohammad', 'yusuf', 'ibraheem', 'yasin', 'hamdan', 'rashad', 'sultan', 'zaeed', 'abdulrahman', 'abdulaziz',
  ]);

  const lowerName = firstName.toLowerCase();

  // Check explicit name lists first
  if (femaleNames.has(lowerName)) return 'female';
  if (maleNames.has(lowerName)) return 'male';

  // Pattern-based detection for names not in the list

  // Strong female indicators (names ending in 'a' are overwhelmingly female)
  if (/^.+a$/i.test(firstName) && firstName.length > 2) {
    // Common exceptions that end in 'a' but are male
    const maleExceptions = ['joshua', 'noah', 'isaiah', 'ezra', 'luca', 'kota', 'akira', 'omara'];
    if (!maleExceptions.includes(lowerName)) return 'female';
  }

  // Check explicit female name endings
  if (/(elle|ette|ine|ia|ee|ie|yna|ina)$/i.test(firstName)) return 'female';

  // Check explicit male name endings
  if (/(us|as|en|on|ard|old|ric|win)$/i.test(firstName)) return 'male';

  // Default: return null (caller will use fallback)
  return null;
}