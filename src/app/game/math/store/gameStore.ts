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
  loadQuest: (questId: string) => void;
  addGold: (amount: number) => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  setStudentName: (name: string) => void;
  nextQuestion: () => void;
  reset: () => void;
}

const FIRST_QUEST = MATH_QUESTS[0];

export const useGameStore = create<GameState>((set, get) => ({
  scene: 'QUEST_MAP',
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

  loadQuest: (questId) => {
    const quest = MATH_QUESTS.find(q => q.id === questId);
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
