/**
 * LangGraph State Machine for Multi-Agent Lesson Orchestration
 *
 * This module defines a LangGraph StateGraph that manages the lesson flow
 * through phases: intro -> warmup -> concept -> demonstration -> practice -> deepen -> quiz -> complete
 *
 * Conditional edges handle emotion-based routing (brain breaks for frustrated/anxious students)
 */

import { StateGraph, Annotation, END, START } from '@langchain/langgraph';
import type { LessonContent, LessonSection } from '@/types';
import {
  type LessonPhase,
  type EmotionState,
  type NarrationItem,
  type VisualAction,
  type QuizQuestion,
} from './types';
import { getTeacher } from './teacher';
import { getExplainer } from './explainer';
import { getQuiz } from './quiz';

// Phase transition order
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

// LangGraph State Definition using Annotation.Root
export const LessonGraphState = Annotation.Root({
  // Lesson context
  lesson: Annotation<LessonContent | null>,
  currentSection: Annotation<number>,
  phase: Annotation<LessonPhase>,

  // Student context
  studentName: Annotation<string>,
  studentGrade: Annotation<number>,
  studentEmotion: Annotation<EmotionState>,
  language: Annotation<'en' | 'ar'>,

  // Agent outputs
  narration: Annotation<NarrationItem | null>,
  visual: Annotation<VisualAction | null>,
  lastAction: Annotation<string>,

  // Quiz state
  quizQuestions: Annotation<QuizQuestion[]>,
  currentQuestion: Annotation<number>,
  quizScore: Annotation<number>,

  // Progress tracking
  completedSections: Annotation<number[]>,
  phaseStart: Annotation<number>,
  lastInteraction: Annotation<number>,

  // Control flow
  shouldAdvance: Annotation<boolean>,
  error: Annotation<string | null>,
});

export type LessonGraphStateType = typeof LessonGraphState.State;

// Helper to create initial state
export function createInitialGraphState(
  lesson: LessonContent | null = null,
  student: { name?: string; grade?: number; emotion?: EmotionState } = {}
): Partial<LessonGraphStateType> {
  return {
    lesson,
    currentSection: 0,
    phase: 'intro',
    studentName: student.name || 'Explorer',
    studentGrade: student.grade || 6,
    studentEmotion: student.emotion || 'neutral',
    language: 'en',
    narration: null,
    visual: null,
    lastAction: 'INIT',
    quizQuestions: [],
    currentQuestion: 0,
    quizScore: 0,
    completedSections: [],
    phaseStart: Date.now(),
    lastInteraction: Date.now(),
    shouldAdvance: false,
    error: null,
  };
}

// Helper to get next phase
function getNextPhase(currentPhase: LessonPhase): LessonPhase | null {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) {
    return null;
  }
  return PHASE_ORDER[currentIndex + 1];
}

// Helper to get current section
function getCurrentSection(state: LessonGraphStateType): LessonSection | null {
  if (!state.lesson?.sections || state.currentSection >= state.lesson.sections.length) {
    return null;
  }
  return state.lesson.sections[state.currentSection];
}

// Node: INTRO phase
function introNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const teacher = getTeacher();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    const lessonTitle = state.lesson?.title || 'this lesson';
    const response = teacher.welcome(student, lessonTitle);

    return {
      phase: 'intro',
      narration: response.narration || null,
      lastAction: 'INTRO',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Intro phase failed',
      narration: {
        agentId: 'teacher',
        text: `Hello, ${state.studentName}! Let's begin our learning adventure!`,
        emotion: 'calm',
      },
      lastAction: 'INTRO_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: WARMUP phase
function warmupNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const section = getCurrentSection(state);
    const teacher = getTeacher();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    let narration: NarrationItem | null = null;
    if (section) {
      const response = teacher.narrateSection(section, student);
      narration = response.narration || null;
    } else {
      narration = {
        agentId: 'teacher',
        text: "Let's warm up with some quick thinking! Ready?",
        emotion: 'excited',
      };
    }

    return {
      phase: 'warmup',
      narration,
      lastAction: 'WARMUP',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Warmup phase failed',
      narration: {
        agentId: 'teacher',
        text: "Let's get ready to learn!",
        emotion: 'calm',
      },
      lastAction: 'WARMUP_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: CONCEPT phase
function conceptNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const section = getCurrentSection(state);
    const teacher = getTeacher();
    const explainer = getExplainer();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    let narration: NarrationItem | null = null;
    let visual: VisualAction | null = null;

    if (section) {
      const narrResponse = teacher.narrateSection(section, student);
      narration = narrResponse.narration || null;

      const visualResponse = explainer.generateVisualForSection(section);
      visual = visualResponse.visual || null;
    }

    return {
      phase: 'concept',
      narration,
      visual,
      lastAction: 'CONCEPT',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Concept phase failed',
      narration: {
        agentId: 'teacher',
        text: "Let's learn about this new concept together.",
        emotion: 'calm',
      },
      lastAction: 'CONCEPT_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: DEMONSTRATION phase
function demonstrationNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const section = getCurrentSection(state);
    const explainer = getExplainer();
    const teacher = getTeacher();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    let narration: NarrationItem | null = null;
    let visual: VisualAction | null = null;

    if (section) {
      const visualResponse = explainer.generateVisualForSection(section);
      visual = visualResponse.visual || null;

      narration = {
        agentId: 'explainer',
        text: `Watch this demonstration of ${section.heading}.`,
        emotion: 'calm',
      };
    }

    return {
      phase: 'demonstration',
      narration,
      visual,
      lastAction: 'DEMONSTRATION',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Demonstration phase failed',
      narration: {
        agentId: 'teacher',
        text: "Let me show you how this works.",
        emotion: 'calm',
      },
      lastAction: 'DEMONSTRATION_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: PRACTICE phase
function practiceNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const section = getCurrentSection(state);
    const teacher = getTeacher();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    let narration: NarrationItem | null = null;
    if (section?.activity) {
      narration = {
        agentId: 'teacher',
        text: `Now let's practice! ${section.activity}`,
        emotion: 'excited',
      };
    } else {
      const response = teacher.narrateSection(
        section || { heading: 'Practice', content: '' } as LessonSection,
        student
      );
      narration = response.narration || null;
    }

    return {
      phase: 'practice',
      narration,
      lastAction: 'PRACTICE',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Practice phase failed',
      narration: {
        agentId: 'teacher',
        text: "Let's practice what we've learned!",
        emotion: 'calm',
      },
      lastAction: 'PRACTICE_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: DEEPEN phase
function deepenNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const section = getCurrentSection(state);
    const teacher = getTeacher();
    const explainer = getExplainer();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    let narration: NarrationItem | null = null;
    let visual: VisualAction | null = null;

    if (section) {
      const narrResponse = teacher.narrateSection(section, student);
      narration = narrResponse.narration || null;

      if (section.realWorldExample) {
        const visualResponse = explainer.generateVisualForSection(section);
        visual = visualResponse.visual || null;
      }
    }

    return {
      phase: 'deepen',
      narration,
      visual,
      lastAction: 'DEEPEN',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Deepen phase failed',
      narration: {
        agentId: 'teacher',
        text: "Let's explore this topic even further!",
        emotion: 'calm',
      },
      lastAction: 'DEEPEN_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: QUIZ phase
function quizNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const quiz = getQuiz();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    // Initialize quiz if questions are available
    if (state.quizQuestions.length > 0 && state.currentQuestion === 0) {
      quiz.initQuestions(state.quizQuestions);
    }

    const response = quiz.presentQuestion(student);

    return {
      phase: 'quiz',
      narration: response.narration || null,
      lastAction: 'QUIZ',
      phaseStart: Date.now(),
      lastInteraction: Date.now(),
      shouldAdvance: true,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Quiz phase failed',
      narration: {
        agentId: 'quiz',
        text: "Let's test what you've learned! I'll ask you a few questions.",
        emotion: 'calm',
      },
      lastAction: 'QUIZ_FALLBACK',
      shouldAdvance: true,
    };
  }
}

// Node: COMPLETE phase
function completeNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  try {
    const teacher = getTeacher();
    const student = {
      name: state.studentName,
      grade: state.studentGrade,
      emotion: state.studentEmotion,
    };

    const lesson = state.lesson;
    const completionText = lesson?.encouragement
      ? lesson.encouragement.replace('{name}', state.studentName)
      : `Congratulations, ${state.studentName}! You've completed this lesson!`;

    const response = {
      agentId: 'teacher' as const,
      action: { type: 'NARRATE' as const, text: completionText, emotion: 'excited' as const },
      narration: {
        agentId: 'teacher' as const,
        text: completionText,
        emotion: 'excited' as const,
      },
    };

    return {
      phase: 'complete',
      narration: response.narration,
      lastAction: 'COMPLETE',
      lastInteraction: Date.now(),
      shouldAdvance: false,
      error: null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Complete phase failed',
      narration: {
        agentId: 'teacher',
        text: `Great job, ${state.studentName}! You completed the lesson!`,
        emotion: 'excited',
      },
      lastAction: 'COMPLETE_FALLBACK',
      shouldAdvance: false,
    };
  }
}

// Node: BRAIN_BREAK phase (triggered when student is frustrated/anxious)
function brainBreakNode(state: LessonGraphStateType): Partial<LessonGraphStateType> {
  const tone = EMOTION_TONES[state.studentEmotion];
  const encouragement = tone.encouragement === 'high'
    ? `Take a deep breath, ${state.studentName}. I'm here to help you succeed! Let's take this one step at a time.`
    : `You're doing great, ${state.studentName}! Let's keep going at your own pace.`;

  return {
    narration: {
      agentId: 'teacher',
      text: encouragement,
      emotion: 'calm',
    },
    lastAction: 'BRAIN_BREAK',
    lastInteraction: Date.now(),
    shouldAdvance: true,
    error: null,
  };
}

// Conditional edge router: determines next phase based on current state
function routePhase(
  state: LessonGraphStateType
): 'brainBreak' | 'advance' | 'complete' {
  // Check if student needs emotional support
  if (state.studentEmotion === 'frustrated' || state.studentEmotion === 'anxious') {
    return 'brainBreak';
  }

  // Check if lesson is complete
  if (state.phase === 'complete') {
    return 'complete';
  }

  return 'advance';
}

// Phase advancement router: determines which phase node to go to next
function routeToNextPhase(state: LessonGraphStateType): string {
  const nextPhase = getNextPhase(state.phase);
  if (!nextPhase) {
    return 'completeNode';
  }

  switch (nextPhase) {
    case 'intro':
      return 'introNode';
    case 'warmup':
      return 'warmupNode';
    case 'concept':
      return 'conceptNode';
    case 'demonstration':
      return 'demonstrationNode';
    case 'practice':
      return 'practiceNode';
    case 'deepen':
      return 'deepenNode';
    case 'quiz':
      return 'quizNode';
    case 'complete':
      return 'completeNode';
    default:
      return 'completeNode';
  }
}

// Brain break return router: goes back to the phase we were in
function routeFromBrainBreak(state: LessonGraphStateType): string {
  return routeToNextPhase(state);
}

// Build and compile the LangGraph
function buildLessonGraph() {
  const graphBuilder = new StateGraph(LessonGraphState);

  // Add all nodes first
  graphBuilder
    .addNode('introNode', introNode as any)
    .addNode('warmupNode', warmupNode as any)
    .addNode('conceptNode', conceptNode as any)
    .addNode('demonstrationNode', demonstrationNode as any)
    .addNode('practiceNode', practiceNode as any)
    .addNode('deepenNode', deepenNode as any)
    .addNode('quizNode', quizNode as any)
    .addNode('completeNode', completeNode as any)
    .addNode('brainBreakNode', brainBreakNode as any)
    .addNode('routeToNextPhase', ((state: LessonGraphStateType) => {
      const nextPhase = getNextPhase(state.phase);
      if (!nextPhase) {
        return { phase: 'complete' as LessonPhase, shouldAdvance: false };
      }
      return { phase: nextPhase, shouldAdvance: true };
    }) as any);

  // Entry point goes to intro
  graphBuilder.addEdge(START as any, 'introNode' as any);

  // Conditional edges from each phase node for emotion handling and phase advancement
  const phaseNodes = [
    'introNode',
    'warmupNode',
    'conceptNode',
    'demonstrationNode',
    'practiceNode',
    'deepenNode',
    'quizNode',
  ] as const;

  phaseNodes.forEach((nodeName) => {
    graphBuilder.addConditionalEdges(nodeName as any, routePhase as any, {
      brainBreak: 'brainBreakNode',
      advance: 'routeToNextPhase',
      complete: 'completeNode',
    } as any);
  });

  // Brain break returns to phase progression
  graphBuilder.addConditionalEdges('brainBreakNode' as any, routeFromBrainBreak as any, {
    introNode: 'introNode',
    warmupNode: 'warmupNode',
    conceptNode: 'conceptNode',
    demonstrationNode: 'demonstrationNode',
    practiceNode: 'practiceNode',
    deepenNode: 'deepenNode',
    quizNode: 'quizNode',
    completeNode: 'completeNode',
  } as any);

  // From routeToNextPhase, go to the appropriate phase node
  graphBuilder.addConditionalEdges('routeToNextPhase' as any, routeToNextPhase as any, {
    introNode: 'introNode',
    warmupNode: 'warmupNode',
    conceptNode: 'conceptNode',
    demonstrationNode: 'demonstrationNode',
    practiceNode: 'practiceNode',
    deepenNode: 'deepenNode',
    quizNode: 'quizNode',
    completeNode: 'completeNode',
  } as any);

  // Complete node ends the graph
  graphBuilder.addEdge('completeNode' as any, END as any);

  return graphBuilder.compile();
}

// Compiled graph singleton
let compiledGraph: ReturnType<typeof buildLessonGraph> | null = null;

export function getLessonGraph() {
  if (!compiledGraph) {
    compiledGraph = buildLessonGraph();
  }
  return compiledGraph;
}

export function resetLessonGraph() {
  compiledGraph = null;
}

// Helper to advance graph by one step (for manual control)
export async function advanceLessonGraph(
  currentState: Partial<LessonGraphStateType>
): Promise<Partial<LessonGraphStateType>> {
  try {
    const graph = getLessonGraph();
    const result = await graph.invoke(currentState);
    return result;
  } catch (err) {
    return {
      ...currentState,
      error: err instanceof Error ? err.message : 'Graph execution failed',
      narration: {
        agentId: 'teacher',
        text: "Let's continue with the lesson.",
        emotion: 'calm',
      },
      lastAction: 'ERROR_FALLBACK',
    };
  }
}

// Helper to run graph from start to a specific phase
export async function runLessonToPhase(
  lesson: LessonContent,
  targetPhase: LessonPhase,
  student: { name?: string; grade?: number; emotion?: EmotionState } = {}
): Promise<Partial<LessonGraphStateType>> {
  const initialState = createInitialGraphState(lesson, student);
  const graph = getLessonGraph();

  let state = initialState;
  const maxIterations = 20;
  let iterations = 0;

  while (iterations < maxIterations) {
    try {
      state = await graph.invoke(state);
      iterations++;

      if (state.phase === targetPhase || state.phase === 'complete') {
        break;
      }
    } catch (err) {
      return {
        ...state,
        error: err instanceof Error ? err.message : 'Graph execution failed',
      };
    }
  }

  return state;
}
