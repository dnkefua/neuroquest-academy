'use client';
import { create } from 'zustand';
import { getGameQuests, type GameQuest } from '@/lib/questData';
import type { CurriculumSubject } from '@/types';

export type EnglishScene = 'CLASSROOM' | 'QUEST_MAP' | 'MISSION_BRIEFING' | 'QUIZ' | 'VICTORY';

export interface EnglishQuestion {
  id: number;
  narrative: string;
  question: string;
  options: string[];
  correct: number;
  clue: {
    title: string;
    example: string;
    cost: number;
  };
}

interface EnglishState {
  scene: EnglishScene;
  currentGrade: number;
  currentQuestId: string;
  studentName: string;
  goldCoins: number;
  goldTarget: number;
  currentQuestion: number;
  questions: EnglishQuestion[];
  score: number;
  clueUsed: boolean[];
  lessonComplete: boolean;
  xpEarned: number;
  setScene: (scene: EnglishScene) => void;
  setGrade: (grade: number) => void;
  loadQuest: (questId: string, grade: number) => void;
  addGold: (amount: number) => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  setStudentName: (name: string) => void;
  nextQuestion: () => void;
  reset: () => void;
}

// Get quests from curriculum data
function getQuestsForGrade(grade: number): GameQuest[] {
  return getGameQuests(grade, 'english' as CurriculumSubject);
}

// Convert GameQuestion to EnglishQuestion format
function toEnglishQuestion(q: GameQuest['questions'][0], index: number): EnglishQuestion {
  return {
    id: index + 1,
    narrative: q.narrative,
    question: q.question,
    options: q.options,
    correct: q.correct,
    clue: {
      title: q.clue.title,
      example: q.clue.example,
      cost: q.clue.cost,
    },
  };
}

const DEFAULT_GRADE = 6;

export const useEnglishStore = create<EnglishState>((set, get) => ({
  scene: 'CLASSROOM',
  currentGrade: DEFAULT_GRADE,
  currentQuestId: '',
  studentName: 'Reader',
  goldCoins: 0,
  goldTarget: 100,
  currentQuestion: 0,
  questions: [],
  score: 0,
  clueUsed: [],
  lessonComplete: false,
  xpEarned: 0,

  setScene: (scene) => set({ scene }),

  setGrade: (grade) => {
    const quests = getQuestsForGrade(grade);
    if (quests.length === 0) {
      return;
    }
    const firstQuest = quests[0];
    set({
      currentGrade: grade,
      currentQuestId: firstQuest.id,
      questions: firstQuest.questions.map((q, i) => toEnglishQuestion(q, i)),
      currentQuestion: 0,
      score: 0,
      goldCoins: 0,
      clueUsed: new Array(firstQuest.questions.length).fill(false),
      lessonComplete: false,
      xpEarned: 0,
      scene: 'CLASSROOM',
    });
  },

  loadQuest: (questId, grade) => {
    const quests = getQuestsForGrade(grade);
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    set({
      currentGrade: grade,
      currentQuestId: questId,
      questions: quest.questions.map((q, i) => toEnglishQuestion(q, i)),
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
    if (next >= s.questions.length) return { lessonComplete: true, scene: 'VICTORY' as EnglishScene };
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

// Export helper functions
export function hasQuestsForGrade(grade: number): boolean {
  return getQuestsForGrade(grade).length > 0;
}

export function getQuests(grade: number): GameQuest[] {
  return getQuestsForGrade(grade);
}

export function getQuestById(questId: string, grade: number): GameQuest | undefined {
  const quests = getQuestsForGrade(grade);
  return quests.find(q => q.id === questId);
}

export function getNextQuest(currentId: string, grade: number): GameQuest | null {
  const quests = getQuestsForGrade(grade);
  const idx = quests.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < quests.length - 1 ? quests[idx + 1] : null;
}