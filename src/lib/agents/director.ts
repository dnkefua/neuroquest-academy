/**
 * Director Agent - Coordinates the multi-agent lesson flow
 * Uses LangGraph StateGraph for orchestration with backward-compatible API
 */

import { AgentState, LessonPhase, DirectorAction, AgentResponse, StudentProfile, EmotionState } from './types';
import type { LessonContent, LessonSection } from '@/types';
import {
  getLessonGraph,
  resetLessonGraph,
  createInitialGraphState,
  advanceLessonGraph,
  type LessonGraphStateType,
} from './graph';

// Phase transition rules (kept for backward compatibility)
const PHASE_ORDER: LessonPhase[] = [
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
const EMOTION_TONES: Record<EmotionState, { pace: 'slower' | 'normal' | 'faster'; encouragement: 'high' | 'medium' | 'low' }> = {
  happy: { pace: 'normal', encouragement: 'medium' },
  neutral: { pace: 'normal', encouragement: 'medium' },
  anxious: { pace: 'slower', encouragement: 'high' },
  frustrated: { pace: 'slower', encouragement: 'high' },
};

/**
 * Convert LangGraph state to legacy AgentState for backward compatibility
 */
function graphStateToAgentState(graphState: Partial<LessonGraphStateType>): AgentState {
  return {
    lesson: graphState.lesson ?? null,
    currentSection: graphState.currentSection ?? 0,
    phase: graphState.phase ?? 'intro',
    student: {
      name: graphState.studentName ?? 'Explorer',
      grade: graphState.studentGrade ?? 6,
      emotion: graphState.studentEmotion ?? 'neutral',
    },
    language: graphState.language ?? 'en',
    narrationQueue: graphState.narration ? [graphState.narration] : [],
    visualQueue: graphState.visual ? [graphState.visual] : [],
    quizQuestions: graphState.quizQuestions ?? [],
    currentQuestion: graphState.currentQuestion ?? 0,
    quizScore: graphState.quizScore ?? 0,
    completedSections: graphState.completedSections ?? [],
    timestamps: {
      lessonStart: graphState.phaseStart ?? Date.now(),
      phaseStart: graphState.phaseStart ?? Date.now(),
      lastInteraction: graphState.lastInteraction ?? Date.now(),
    },
  };
}

/**
 * Director Agent - Manages lesson flow and coordinates other agents
 * Now backed by LangGraph StateGraph for proper state machine orchestration
 */
export class DirectorAgent {
  private state: AgentState;
  private graphState: Partial<LessonGraphStateType>;
  private useLangGraph: boolean;

  constructor(initialState?: Partial<AgentState>) {
    this.useLangGraph = true;
    this.graphState = createInitialGraphState();
    this.state = this.createInitialState(initialState);
  }

  private createInitialState(partial?: Partial<AgentState>): AgentState {
    return {
      lesson: null,
      currentSection: 0,
      phase: 'intro',
      student: {
        name: 'Explorer',
        grade: 6,
        emotion: 'neutral',
      },
      language: 'en',
      narrationQueue: [],
      visualQueue: [],
      quizQuestions: [],
      currentQuestion: 0,
      quizScore: 0,
      completedSections: [],
      timestamps: {
        lessonStart: Date.now(),
        phaseStart: Date.now(),
        lastInteraction: Date.now(),
      },
      ...partial,
    };
  }

  /**
   * Get current state (immutable)
   */
  getState(): Readonly<AgentState> {
    if (this.useLangGraph) {
      return graphStateToAgentState(this.graphState) as Readonly<AgentState>;
    }
    return { ...this.state };
  }

  /**
   * Start a new lesson
   */
  startLesson(lesson: LessonContent, student: Partial<StudentProfile>): AgentResponse {
    this.graphState = createInitialGraphState(lesson, student);
    this.state.lesson = lesson;
    this.state.student = { ...this.state.student, ...student };
    this.state.phase = 'intro';
    this.state.currentSection = 0;
    this.state.timestamps = {
      lessonStart: Date.now(),
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
    };

    const introNarration = this.generateIntroNarration(lesson);

    return {
      agentId: 'director',
      action: { type: 'START_LESSON', lesson },
      narration: {
        agentId: 'teacher',
        text: introNarration,
        emotion: 'excited',
      },
      nextState: this.state,
    };
  }

  /**
   * Advance to next phase in lesson using LangGraph
   */
  advancePhase(): AgentResponse | null {
    const currentIndex = PHASE_ORDER.indexOf(this.state.phase);
    if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) {
      return null;
    }

    const nextPhase = PHASE_ORDER[currentIndex + 1];
    this.state.phase = nextPhase;
    this.state.timestamps.phaseStart = Date.now();
    this.state.timestamps.lastInteraction = Date.now();

    const response = this.generatePhaseResponse(nextPhase);

    return {
      agentId: 'director',
      action: { type: 'ADVANCE_PHASE', nextPhase },
      ...response,
      nextState: this.state,
    };
  }

  /**
   * Advance using LangGraph state machine (async)
   */
  async advanceWithLangGraph(): Promise<AgentResponse | null> {
    try {
      const updatedGraphState = await advanceLessonGraph(this.graphState);
      this.graphState = updatedGraphState;
      this.state = graphStateToAgentState(updatedGraphState);

      return {
        agentId: 'director',
        action: { type: 'ADVANCE_PHASE', nextPhase: this.state.phase },
        narration: updatedGraphState.narration ?? undefined,
        visual: updatedGraphState.visual ?? undefined,
        nextState: this.state,
      };
    } catch (err) {
      return {
        agentId: 'director',
        action: { type: 'HANDLE_EMOTION', emotion: 'frustrated' },
        narration: {
          agentId: 'teacher',
          text: err instanceof Error ? err.message : 'An error occurred during lesson progression.',
          emotion: 'calm',
        },
        nextState: this.state,
      };
    }
  }

  /**
   * Handle student emotion change
   */
  handleEmotion(emotion: EmotionState): AgentResponse {
    this.state.student.emotion = emotion;
    this.graphState.studentEmotion = emotion;
    this.state.timestamps.lastInteraction = Date.now();

    const tone = EMOTION_TONES[emotion];
    const encouragement = tone.encouragement === 'high'
      ? "I'm here to help you succeed! Let's take this one step at a time."
      : tone.encouragement === 'medium'
        ? "You're doing great! Keep going!"
        : undefined;

    return {
      agentId: 'director',
      action: { type: 'HANDLE_EMOTION', emotion },
      narration: encouragement ? {
        agentId: 'teacher',
        text: encouragement,
        emotion: emotion === 'anxious' || emotion === 'frustrated' ? 'calm' : 'excited',
      } : undefined,
      nextState: this.state,
    };
  }

  /**
   * Get current section content
   */
  getCurrentSection(): LessonSection | null {
    if (!this.state.lesson?.sections || this.state.currentSection >= this.state.lesson.sections.length) {
      return null;
    }
    return this.state.lesson.sections[this.state.currentSection];
  }

  /**
   * Advance to next section within current phase
   */
  nextSection(): AgentResponse | null {
    if (!this.state.lesson?.sections) return null;

    if (this.state.currentSection < this.state.lesson.sections.length - 1) {
      this.state.currentSection++;
      this.graphState.currentSection = this.state.currentSection;
      this.state.completedSections.push(this.state.currentSection - 1);
      this.state.timestamps.lastInteraction = Date.now();

      const section = this.getCurrentSection();
      if (!section) return null;

      return {
        agentId: 'director',
        action: { type: 'ADVANCE_PHASE', nextPhase: this.state.phase },
        narration: {
          agentId: 'teacher',
          text: section.narrationScript || section.content,
          emotion: 'calm',
        },
        nextState: this.state,
      };
    }

    return this.advancePhase();
  }

  /**
   * Complete the lesson
   */
  completeLesson(): AgentResponse {
    this.state.phase = 'complete';
    this.graphState.phase = 'complete';
    this.state.timestamps.lastInteraction = Date.now();

    const lesson = this.state.lesson;
    const studentName = this.state.student.name;

    const completionNarration = lesson?.encouragement
      ? lesson.encouragement.replace('{name}', studentName)
      : `Congratulations, ${studentName}! You've completed this lesson!`;

    return {
      agentId: 'director',
      action: { type: 'COMPLETE_LESSON' },
      narration: {
        agentId: 'teacher',
        text: completionNarration,
        emotion: 'excited',
      },
      nextState: this.state,
    };
  }

  /**
   * Check if should show visual (based on section type)
   */
  shouldShowVisual(): boolean {
    const section = this.getCurrentSection();
    if (!section) return false;

    return ['demonstration', 'interactive', 'narrated'].includes(section.type || '');
  }

  /**
   * Get visual action for current section
   */
  getVisualAction(): { type: string; content: string; data?: Record<string, unknown> } | null {
    const section = this.getCurrentSection();
    if (!section || !this.shouldShowVisual()) return null;

    return {
      type: section.visualType || 'diagram',
      content: section.heading,
      data: {
        keyPoints: section.keyPoints,
        realWorldExample: section.realWorldExample,
      },
    };
  }

  // --- Private helpers ---

  private generateIntroNarration(lesson: LessonContent): string {
    const studentName = this.state.student.name;
    const lessonTitle = lesson.title || 'this lesson';
    const intro = lesson.intro || "Let's begin our learning adventure!";

    return `Hello, ${studentName}! Welcome to ${lessonTitle}. ${intro}`;
  }

  private generatePhaseResponse(phase: LessonPhase): Partial<AgentResponse> {
    const lesson = this.state.lesson;
    const section = this.getCurrentSection();

    switch (phase) {
      case 'warmup':
      case 'concept':
      case 'demonstration':
      case 'practice':
      case 'deepen':
        return {
          narration: section ? {
            agentId: 'teacher',
            text: section.narrationScript || section.content,
            emotion: 'calm',
          } : undefined,
          visual: this.shouldShowVisual() ? {
            type: 'present_slide',
            content: section?.heading || '',
            duration: 5000,
          } : undefined,
        };

      case 'quiz':
        return {
          narration: {
            agentId: 'quiz',
            text: "Let's test what you've learned! I'll ask you a few questions.",
            emotion: 'calm',
          },
        };

      case 'complete':
        return {
          narration: {
            agentId: 'teacher',
            text: lesson?.encouragement || 'Great job completing this lesson!',
            emotion: 'excited',
          },
        };

      default:
        return {};
    }
  }
}

// Singleton instance for app-wide use
let directorInstance: DirectorAgent | null = null;

export function getDirector(initialState?: Partial<AgentState>): DirectorAgent {
  if (!directorInstance) {
    directorInstance = new DirectorAgent(initialState);
  } else if (initialState) {
    directorInstance = new DirectorAgent(initialState);
  }
  return directorInstance;
}

export function resetDirector(): void {
  directorInstance = null;
  resetLessonGraph();
}
