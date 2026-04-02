/**
 * Multi-Agent Orchestration Types for NeuroQuest
 * Inspired by OpenMAIC architecture patterns
 */

import type { LessonContent, LessonSection } from '@/types';

// Agent identifiers
export type AgentId = 'director' | 'teacher' | 'explainer' | 'quiz';

// Student emotional state
export type EmotionState = 'happy' | 'neutral' | 'anxious' | 'frustrated';

// Student profile for personalization
export interface StudentProfile {
  name: string;
  grade: number;
  emotion: EmotionState;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic';
  strugglingTopics?: string[];
}

// Lesson phase for state machine
export type LessonPhase =
  | 'intro'           // Welcome and hook
  | 'warmup'          // Prior knowledge activation
  | 'concept'         // Main concept introduction
  | 'demonstration'   // Visual/example demonstration
  | 'practice'        // Guided practice
  | 'deepen'         // Extension/real-world connection
  | 'quiz'           // Assessment
  | 'complete';      // Lesson finished

// Visual action types for animations/diagrams
export type VisualActionType =
  | 'draw_diagram'
  | 'show_animation'
  | 'highlight'
  | 'zoom'
  | 'present_slide'
  | 'present_simulation'
  | 'interactive_simulation';

// Narration queue item
export interface NarrationItem {
  agentId: AgentId;
  text: string;
  emotion?: 'excited' | 'calm' | 'encouraging' | 'thoughtful';
  delay?: number; // ms before speaking
}

// Visual action for explainer agent
export interface VisualAction {
  type: VisualActionType;
  content: string;
  duration?: number; // ms
  data?: Record<string, unknown>;
}

// Quiz question from quiz agent
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Agent state (shared across all agents)
export interface AgentState {
  // Lesson context
  lesson: LessonContent | null;
  currentSection: number;
  phase: LessonPhase;

  // Student context
  student: StudentProfile;
  language: 'en' | 'ar';

  // Agent queues
  narrationQueue: NarrationItem[];
  visualQueue: VisualAction[];

  // Quiz state
  quizQuestions: QuizQuestion[];
  currentQuestion: number;
  quizScore: number;

  // Progress tracking
  completedSections: number[];
  timestamps: {
    lessonStart: number;
    phaseStart: number;
    lastInteraction: number;
  };
}

// LangGraph-compatible lesson state (used by StateGraph)
export interface LessonGraphState {
  // Core lesson context
  lesson: LessonContent | null;
  phase: LessonPhase;
  currentSection: number;

  // Student context
  studentName: string;
  studentGrade: number;
  emotion: EmotionState;

  // Output accumulators
  narration: NarrationItem | null;
  visual: VisualAction | null;
  narrationHistory: NarrationItem[];
  visualHistory: VisualAction[];

  // Quiz state
  quizQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  quizScore: number;
  wrongAnswerIndices: number[];

  // Progress tracking
  completedSections: number[];
  timestamps: {
    lessonStart: number;
    phaseStart: number;
    lastInteraction: number;
  };

  // Control flags
  shouldBrainBreak: boolean;
  error: string | null;
}

// Agent action types
export type DirectorAction =
  | { type: 'START_LESSON'; lesson: LessonContent }
  | { type: 'ADVANCE_PHASE'; nextPhase: LessonPhase }
  | { type: 'HANDLE_EMOTION'; emotion: EmotionState }
  | { type: 'COMPLETE_LESSON' };

export type TeacherAction =
  | { type: 'NARRATE'; text: string; emotion?: 'excited' | 'calm' | 'encouraging' }
  | { type: 'INTRODUCE_SECTION'; section: LessonSection }
  | { type: 'ENCOURAGE'; reason: string };

export type ExplainerAction =
  | { type: 'SHOW_DIAGRAM'; content: string; data?: Record<string, unknown> }
  | { type: 'ANIMATE'; content: string; duration?: number }
  | { type: 'PRESENT_SIMULATION'; simulationType: string; params: Record<string, unknown> };

export type QuizAction =
  | { type: 'GENERATE_QUESTIONS'; count: number; difficulty: 'easy' | 'medium' | 'hard' }
  | { type: 'EVALUATE_ANSWER'; questionIndex: number; answer: number }
  | { type: 'EXPLAIN_WRONG'; questionIndex: number };

// Agent response types
export interface AgentResponse {
  agentId: AgentId;
  action: DirectorAction | TeacherAction | ExplainerAction | QuizAction;
  narration?: NarrationItem;
  visual?: VisualAction;
  nextState?: Partial<AgentState>;
}

// LangGraph node result type
export interface LangGraphNodeResult {
  narration?: NarrationItem | null;
  visual?: VisualAction | null;
  phase?: LessonPhase;
  currentSection?: number;
  emotion?: EmotionState;
  shouldBrainBreak?: boolean;
  error?: string | null;
  quizQuestions?: QuizQuestion[];
  currentQuestionIndex?: number;
  quizScore?: number;
  wrongAnswerIndices?: number[];
  completedSections?: number[];
  timestamps?: {
    lessonStart: number;
    phaseStart: number;
    lastInteraction: number;
  };
}

// Agent configuration
export interface AgentConfig {
  id: AgentId;
  name: string;
  personality: string;
  voiceSettings: {
    rate: number;
    pitch: number;
    emotion: 'neutral' | 'enthusiastic' | 'calm';
  };
}

// Default agent configurations
export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  director: {
    id: 'director',
    name: 'Director',
    personality: 'Orchestrates the lesson flow, coordinates between agents, handles transitions',
    voiceSettings: { rate: 0.95, pitch: 1.0, emotion: 'neutral' },
  },
  teacher: {
    id: 'teacher',
    name: 'Professor Nova',
    personality: 'Warm, engaging, uses storytelling and examples. Encourages curiosity.',
    voiceSettings: { rate: 0.9, pitch: 1.05, emotion: 'enthusiastic' },
  },
  explainer: {
    id: 'explainer',
    name: 'Explainer',
    personality: 'Visual-focused, shows diagrams and animations to clarify concepts.',
    voiceSettings: { rate: 0.85, pitch: 1.0, emotion: 'calm' },
  },
  quiz: {
    id: 'quiz',
    name: 'Quiz Master',
    personality: 'Fair, encouraging, provides clear feedback and explanations.',
    voiceSettings: { rate: 0.95, pitch: 1.0, emotion: 'neutral' },
  },
};

// Phase transition order
export const PHASE_ORDER: LessonPhase[] = [
  'intro',
  'warmup',
  'concept',
  'demonstration',
  'practice',
  'deepen',
  'quiz',
  'complete',
];

// Emotion-based tone adjustments
export const EMOTION_TONES: Record<EmotionState, { pace: 'slower' | 'normal' | 'faster'; encouragement: 'high' | 'medium' | 'low' }> = {
  happy: { pace: 'normal', encouragement: 'medium' },
  neutral: { pace: 'normal', encouragement: 'medium' },
  anxious: { pace: 'slower', encouragement: 'high' },
  frustrated: { pace: 'slower', encouragement: 'high' },
};