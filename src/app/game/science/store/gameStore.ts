'use client';
import { create } from 'zustand';
import { SCIENCE_QUESTS } from '../data/questData';

export type ScienceScene = 'QUEST_MAP' | 'MISSION_BRIEFING' | 'CLOUD_TEACHING' | 'QUIZ' | 'VICTORY';
export type WaterStage = 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'all';

export interface ScienceQuestion {
  id: number;
  spirit: string;
  spiritEmoji: string;
  spiritColor: string;
  narrative: string;
  question: string;
  options: string[];
  correct: number;
  activeStage: WaterStage;
  reward: string;
  clue: {
    title: string;
    example: string;
    highlightStage: WaterStage;
  };
}

interface ScienceState {
  scene: ScienceScene;
  currentQuestId: string;
  studentName: string;
  vialsCollected: number;
  totalVials: number;
  currentQuestion: number;
  questions: ScienceQuestion[];
  score: number;
  clueUsed: boolean[];
  xpEarned: number;
  setScene: (scene: ScienceScene) => void;
  loadQuest: (questId: string) => void;
  collectVial: () => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

// First quest's questions for initial state
const FIRST_QUEST = SCIENCE_QUESTS[0];

export const useScienceStore = create<ScienceState>((set) => ({
  scene: 'QUEST_MAP',
  currentQuestId: FIRST_QUEST.id,
  studentName: 'Omar',
  vialsCollected: 0,
  totalVials: 4,
  currentQuestion: 0,
  questions: FIRST_QUEST.questions,
  score: 0,
  clueUsed: [false, false, false, false, false],
  xpEarned: 0,
  setScene: (scene) => set({ scene }),
  loadQuest: (questId) => {
    const quest = SCIENCE_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    set({
      currentQuestId: questId,
      questions: quest.questions,
      currentQuestion: 0,
      score: 0,
      vialsCollected: 0,
      clueUsed: new Array(quest.questions.length).fill(false),
      xpEarned: 0,
      scene: 'MISSION_BRIEFING',
    });
  },
  collectVial: () => set((s) => ({ vialsCollected: Math.min(s.vialsCollected + 1, s.totalVials) })),
  answerQuestion: (correct) => set((s) => ({
    score: correct ? s.score + 1 : s.score,
    xpEarned: correct ? s.xpEarned + 80 : s.xpEarned,
  })),
  openClue: (index) => set((s) => {
    const c = [...s.clueUsed]; c[index] = true; return { clueUsed: c };
  }),
  nextQuestion: () => set((s) => {
    const next = s.currentQuestion + 1;
    if (next >= s.questions.length) return { scene: 'VICTORY' as ScienceScene };
    return { currentQuestion: next };
  }),
  reset: () => set({
    scene: 'QUEST_MAP',
    currentQuestId: FIRST_QUEST.id,
    vialsCollected: 0,
    currentQuestion: 0,
    score: 0,
    clueUsed: [false, false, false, false, false],
    xpEarned: 0,
  }),
}));