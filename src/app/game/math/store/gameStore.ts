'use client';
import { create } from 'zustand';
import { MATH_QUESTS } from '../data/questData';

export type Scene = 'QUEST_MAP' | 'CLASSROOM' | 'MISSION_BRIEFING' | 'PIRATE_ENCOUNTER' | 'QUIZ' | 'VICTORY';

export interface Question {
  id: number;
  narrative: string;
  question: string;
  equation: string;
  options: string[];
  correct: number;
  numberLineStart: number;
  numberLineMove: number;
  numberLineMove2?: number;
  clue: {
    title: string;
    example: string;
    startValue: number;
    moveValue: number;
    moveValue2?: number;
  };
}

interface GameState {
  scene: Scene;
  currentGrade: number;
  currentQuestId: string;
  studentName: string;
  goldCoins: number;
  goldTarget: number;
  currentQuestion: number;
  questions: Question[];
  score: number;
  clueUsed: boolean[];
  lessonComplete: boolean;
  xpEarned: number;

  setScene: (scene: Scene) => void;
  setGrade: (grade: number) => void;
  loadQuest: (questId: string) => void;
  addGold: (amount: number) => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  setStudentName: (name: string) => void;
  nextQuestion: () => void;
  reset: () => void;
}

// Currently only Grade 6 has quest data
// TODO: Add quest data for other grades
const GRADE_QUESTS: Record<number, typeof MATH_QUESTS> = {
  6: MATH_QUESTS,
  // Grades 1-5, 7-12 coming soon
};

const FIRST_QUEST = MATH_QUESTS[0];
const DEFAULT_GRADE = 6;

export const useGameStore = create<GameState>((set, get) => ({
  scene: 'QUEST_MAP',
  currentGrade: DEFAULT_GRADE,
  currentQuestId: FIRST_QUEST.id,
  studentName: 'Explorer',
  goldCoins: 0,
  goldTarget: 100,
  currentQuestion: 0,
  questions: FIRST_QUEST.questions,
  score: 0,
  clueUsed: new Array(FIRST_QUEST.questions.length).fill(false),
  lessonComplete: false,
  xpEarned: 0,

  setScene: (scene) => set({ scene }),

  setGrade: (grade) => {
    const quests = GRADE_QUESTS[grade];
    if (!quests || quests.length === 0) {
      // Grade not available yet, stay on current grade
      return;
    }
    const firstQuest = quests[0];
    set({
      currentGrade: grade,
      currentQuestId: firstQuest.id,
      questions: firstQuest.questions,
      currentQuestion: 0,
      score: 0,
      goldCoins: 0,
      clueUsed: new Array(firstQuest.questions.length).fill(false),
      lessonComplete: false,
      xpEarned: 0,
      scene: 'QUEST_MAP',
    });
  },

  loadQuest: (questId) => {
    const { currentGrade } = get();
    const quests = GRADE_QUESTS[currentGrade] || MATH_QUESTS;
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    set({
      currentQuestId: questId,
      questions: quest.questions,
      currentQuestion: 0,
      score: 0,
      goldCoins: 0,
      clueUsed: new Array(quest.questions.length).fill(false),
      lessonComplete: false,
      xpEarned: 0,
      scene: 'MISSION_BRIEFING',
    });
  },

  addGold: (amount) => set((s) => ({ goldCoins: Math.min(s.goldCoins + amount, s.goldTarget) })),

  answerQuestion: (correct) => set((s) => ({
    score: correct ? s.score + 1 : s.score,
    xpEarned: correct ? s.xpEarned + 64 : s.xpEarned,
  })),

  openClue: (index) => set((s) => {
    const c = [...s.clueUsed]; c[index] = true; return { clueUsed: c };
  }),

  setStudentName: (name) => set({ studentName: name }),

  nextQuestion: () => set((s) => {
    const next = s.currentQuestion + 1;
    if (next >= s.questions.length) return { lessonComplete: true, scene: 'VICTORY' };
    return { currentQuestion: next };
  }),

  reset: () => set((s) => ({
    scene: 'QUEST_MAP',
    goldCoins: 0,
    currentQuestion: 0,
    score: 0,
    clueUsed: new Array(s.questions.length).fill(false),
    lessonComplete: false,
    xpEarned: 0,
  })),
}));

// Export for QuestMapScene
export { MATH_QUESTS, GRADE_QUESTS };
export const getQuestById = (id: string) => MATH_QUESTS.find(q => q.id === id);
export const getNextQuest = (currentId: string) => {
  const idx = MATH_QUESTS.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < MATH_QUESTS.length - 1 ? MATH_QUESTS[idx + 1] : null;
};

// Check if a grade has quests available
export function hasQuestsForGrade(grade: number): boolean {
  return !!GRADE_QUESTS[grade] && GRADE_QUESTS[grade].length > 0;
}