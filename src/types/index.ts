export type StudentClass = 'math' | 'science' | 'english' | 'arabic';

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
  // Class system
  studentClass?: StudentClass;
  approvedQuestIds: string[];
  pendingApprovals: string[];
  // Completed quests tracking
  completedQuests?: string[];
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

export interface NarratorProfile {
  name: string;
  class: StudentClass;
  gender: 'male' | 'female';
  tagline: string; // e.g. "Equation Wizard Extraordinaire"
}

export interface LessonContent {
  title: string;
  intro: string;
  ibTopicKey: string;
  narrator: NarratorProfile;
  sections: LessonSection[];
  quiz: QuizQuestion[];
  encouragement: string;
  brainBreakTip: string;
}

export interface LessonSection {
  type: 'slide' | 'demonstration' | 'interactive' | 'narrated';
  heading: string;
  content: string;             // Concise slide content (OpenMAIC: "slides are visual aids not scripts")
  visualType?: 'number-line' | 'diagram' | 'chart' | 'animation' | 'interactive-html' | 'real-world';
  keyPoints?: string[];        // 3-4 bullet takeaways per section
  workedExample?: string;       // Math: step-by-step worked problem
  realWorldExample?: string;    // UAE/Dubai context (souq prices, Burj Khalifa, desert temps)
  activity?: string;            // Hands-on student activity
  narrationScript?: string;    // OpenMAIC: exact words narrator should say aloud
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  workedExample?: string;      // Shown after wrong answer
  difficulty: 'easy' | 'medium' | 'hard';
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
  clue?: {
    title: string;
    explanation: string;
    visual: 'numberLine' | 'text' | 'diagram' | '3d-simulation';
    cost: number;
    // Optional number line values (for integer operations, etc.)
    startValue?: number;
    moveValue?: number;
    moveValue2?: number;
    // Optional simulation parameters
    simulationType?: 'water-cycle' | 'circuit' | 'fraction' | 'force' | 'gravity' | 'number-line';
    simulationParams?: Record<string, unknown>;
  };
  coinsOnCorrect?: number; // Optional - defaults handled by game engine
  reward?: string; // Optional badge/achievement name
  // Optional spirit theme (for social/emotional subjects)
  spirit?: string;
  spiritEmoji?: string;
  spiritColor?: string;
}

export interface BossChallenge {
  id: string;
  title: string;
  villain: string;
  villainEmoji: string;
  narrative: string;
  question: string;
  answer: string | string[];
  hints: string[];
  coinReward: number;
}

export interface SimpleBossChallenge {
  question: string;
  answer: string | string[];
  reward: string;
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
  coinReward?: number; // Optional - defaults handled by game engine
  boss?: BossChallenge;
  bossChallenge?: SimpleBossChallenge; // Simpler format for non-math subjects
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
