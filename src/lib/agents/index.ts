/**
 * Multi-Agent Orchestration for NeuroQuest
 *
 * This module provides a unified API for the multi-agent system inspired by OpenMAIC.
 * Agents work together to deliver interactive, personalized learning experiences.
 *
 * Architecture (LangGraph-backed):
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    Director Agent                           │
 * │  - Manages lesson flow via LangGraph StateGraph             │
 * │  - Coordinates agent turns                                  │
 * │  - Handles state transitions with conditional edges         │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *        ┌─────────────────────┼─────────────────────┐
 *        ▼                     ▼                     ▼
 * ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
 * │ Teacher Agent │    │Explainer Agent│    │  Quiz Agent   │
 * │ - Narrates    │    │ - Shows visuals│   │ - Generates   │
 * │ - Introduces  │    │ - Animates      │    │ - Evaluates  │
 * │ - Encourages  │    │ - Simulations   │    │ - Explains   │
 * └───────────────┘    └───────────────┘    └───────────────┘
 *
 * LangGraph Structure:
 *   START -> introNode -> warmupNode -> conceptNode -> demonstrationNode
 *         -> practiceNode -> deepenNode -> quizNode -> completeNode -> END
 *
 *   Conditional edges at each phase node:
 *     - frustrated/anxious -> brainBreakNode -> back to phase progression
 *     - normal -> routeToNextPhase -> next phase node
 *     - complete -> completeNode -> END
 *
 * Usage:
 * ```typescript
 * import { AgentOrchestrator, getDirector, getTeacher, getExplainer, getQuiz } from '@/lib/agents';
 *
 * // Start a lesson
 * const director = getDirector();
 * const response = director.startLesson(lesson, studentProfile);
 *
 * // Process narration with TTS
 * if (response.narration) {
 *   gameTTS.speak(response.narration.text);
 * }
 *
 * // Show visual if available
 * if (response.visual) {
 *   showVisualAnimation(response.visual);
 * }
 * ```
 */

// Export types
export type {
  AgentId,
  AgentState,
  AgentResponse,
  StudentProfile,
  EmotionState,
  LessonPhase,
  NarrationItem,
  VisualAction,
  VisualActionType,
  QuizQuestion,
  DirectorAction,
  TeacherAction,
  ExplainerAction,
  QuizAction,
  AgentConfig,
} from './types';

export { AGENT_CONFIGS } from './types';

// Export agent classes and singletons
export { DirectorAgent, getDirector, resetDirector } from './director';
export { TeacherAgent, getTeacher } from './teacher';
export { ExplainerAgent, getExplainer, resetExplainer } from './explainer';
export { QuizAgent, getQuiz, resetQuiz } from './quiz';

// Export LangGraph integration
export {
  getLessonGraph,
  resetLessonGraph,
  createInitialGraphState,
  advanceLessonGraph,
  runLessonToPhase,
  LessonGraphState,
  type LessonGraphStateType,
} from './graph';

// Import agent singletons for orchestrator
import { DirectorAgent, getDirector, resetDirector } from './director';
import { TeacherAgent, getTeacher } from './teacher';
import { ExplainerAgent, getExplainer, resetExplainer } from './explainer';
import { QuizAgent, getQuiz, resetQuiz } from './quiz';
import { advanceLessonGraph, createInitialGraphState, type LessonGraphStateType } from './graph';
import type { AgentState, AgentResponse, LessonPhase, StudentProfile } from './types';
import type { LessonContent } from '@/types';

/**
 * AgentOrchestrator - High-level API for coordinating agents
 *
 * This class provides a simplified interface for common agent operations
 * using the LangGraph-backed DirectorAgent.
 */
export class AgentOrchestrator {
  private director: DirectorAgent;
  private teacher: TeacherAgent;
  private explainer: ExplainerAgent;
  private quiz: QuizAgent;
  private state: AgentState | null = null;
  private graphState: Partial<LessonGraphStateType> | null = null;

  constructor() {
    this.director = getDirector();
    this.teacher = getTeacher();
    this.explainer = getExplainer();
    this.quiz = getQuiz();
  }

  /**
   * Initialize a new lesson session
   */
  startLesson(lesson: LessonContent, student: Partial<StudentProfile>): AgentResponse {
    // Reset all agents for fresh start
    resetDirector();
    this.director = getDirector();

    // Initialize graph state
    this.graphState = createInitialGraphState(lesson, student);

    // Initialize director with lesson
    const response = this.director.startLesson(lesson, student);
    this.state = this.director.getState();

    return response;
  }

  /**
   * Get current lesson state
   */
  getState(): AgentState | null {
    this.state = this.director.getState();
    return this.state;
  }

  /**
   * Get current LangGraph state
   */
  getGraphState(): Partial<LessonGraphStateType> | null {
    return this.graphState;
  }

  /**
   * Advance to next phase/section (synchronous, backward-compatible)
   */
  advance(): AgentResponse | null {
    const response = this.director.advancePhase();
    this.state = this.director.getState();
    return response;
  }

  /**
   * Advance to next phase using LangGraph state machine (async)
   */
  async advanceWithLangGraph(): Promise<AgentResponse | null> {
    if (!this.graphState) {
      return this.advance();
    }

    const response = await this.director.advanceWithLangGraph();
    this.state = this.director.getState();
    this.graphState = this.director.getState() as unknown as Partial<LessonGraphStateType>;
    return response;
  }

  /**
   * Move to next section within current phase
   */
  nextSection(): AgentResponse | null {
    const response = this.director.nextSection();
    this.state = this.director.getState();
    return response;
  }

  /**
   * Get visual for current section
   */
  getVisual(): AgentResponse | null {
    const section = this.director.getCurrentSection();
    if (!section) return null;

    const response = this.explainer.generateVisualForSection(section);
    return response;
  }

  /**
   * Present a quiz question
   */
  presentQuestion(): AgentResponse {
    const state = this.director.getState();
    return this.quiz.presentQuestion(state.student);
  }

  /**
   * Evaluate quiz answer
   */
  evaluateAnswer(answerIndex: number): AgentResponse {
    const state = this.director.getState();
    return this.quiz.evaluateAnswer(answerIndex, state.student);
  }

  /**
   * Handle student emotion change
   */
  handleEmotion(emotion: AgentState['student']['emotion']): AgentResponse {
    return this.director.handleEmotion(emotion);
  }

  /**
   * Complete the lesson
   */
  completeLesson(): AgentResponse {
    const response = this.director.completeLesson();
    this.state = this.director.getState();
    return response;
  }

  /**
   * Check if lesson is complete
   */
  isComplete(): boolean {
    const state = this.director.getState();
    return state.phase === 'complete';
  }

  /**
   * Get current phase
   */
  getPhase(): LessonPhase {
    return this.director.getState().phase;
  }

  /**
   * Get quiz progress
   */
  getQuizProgress(): { current: number; total: number; score: number } {
    return this.quiz.getProgress();
  }
}

// Singleton orchestrator
let orchestratorInstance: AgentOrchestrator | null = null;

/**
 * Get the orchestrator instance
 */
export function getOrchestrator(): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator();
  }
  return orchestratorInstance;
}

/**
 * Reset the orchestrator for a new lesson
 */
export function resetOrchestrator(): void {
  orchestratorInstance = null;
  resetDirector();
  resetQuiz();
  resetExplainer();
}

/**
 * Sync agent narration with TTS engine
 * Returns the text to speak and handles timing
 */
export function syncNarrationWithTTS(
  response: AgentResponse,
  onVisualReady?: () => void
): { text: string; delay: number } | null {
  if (!response.narration) return null;

  const { text, delay = 0 } = response.narration;

  // If there's a visual, show it before or during narration
  if (response.visual && onVisualReady) {
    // Visual should appear slightly before narration starts
    setTimeout(onVisualReady, Math.max(0, delay - 200));
  }

  return { text, delay };
}

/**
 * Create an agent response for error scenarios
 */
export function createErrorResponse(error: string): AgentResponse {
  return {
    agentId: 'director',
    action: { type: 'HANDLE_EMOTION', emotion: 'frustrated' },
    narration: {
      agentId: 'teacher',
      text: `I encountered an issue: ${error}. Let's try again.`,
      emotion: 'calm',
    },
  };
}