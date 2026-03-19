export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'parent';
  grade: number;
  language: 'EN' | 'AR';
  xp: number;
  streak: number;
  currentEmotion: EmotionKey;
  createdAt: string;
  lastActiveDate?: string;
  childUid?: string;
}

export type EmotionKey = 'happy' | 'neutral' | 'frustrated' | 'anxious';

export interface Emotion {
  key: EmotionKey;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export interface Subject {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  description: string;
}

export interface LessonContent {
  title: string;
  intro: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
  encouragement: string;
  brainBreakTip: string;
}

export interface LessonSection {
  heading: string;
  content: string;
  activity?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ── Curriculum Engine ─────────────────────────────────────────────────────────

export type Programme = 'PYP' | 'MYP' | 'DP';

export type CurriculumSubject = 'math' | 'science' | 'english' | 'social' | 'socialSkills';

export interface CurriculumQuestion {
  id: string;
  narrative: string;
  question: string;
  equation?: string;
  options: string[];
  correctIndex: number;
  clue: {
    title: string;
    explanation: string;
    visual: 'numberLine' | 'text' | 'diagram';
    cost: number;
  };
  coinsOnCorrect: number;
}

export interface BossChallenge {
  id: string;
  title: string;
  villain: string;
  villainEmoji: string;
  narrative: string;
  question: string;
  answer: string;
  hints: string[];
  coinReward: number;
}

export interface CurriculumQuest {
  id: string;
  grade: number;
  programme: Programme;
  subject: CurriculumSubject;
  title: string;
  realmName: string;
  narrativeWorld: string;
  characterTeacher: string;
  teacherEmoji: string;
  theme: string;
  coinReward: number;
  boss: BossChallenge;
  questions: CurriculumQuestion[];
}

// ── Rank / Progression ────────────────────────────────────────────────────────

export interface GradeRank {
  grade: number;
  rank: string;
  emoji: string;
  world: string;
  programme: Programme;
  color: string;
  bgGradient: string;
}

// ── Economy ───────────────────────────────────────────────────────────────────

export interface CoinTransaction {
  amount: number;
  type: 'earn' | 'spend';
  source: string;
  timestamp: number;
}
