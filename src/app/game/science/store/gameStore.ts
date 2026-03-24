'use client';
import { create } from 'zustand';
import { SCIENCE_QUESTS } from '../data/questData';
import { getGameQuests, type GameQuest } from '@/lib/questData';
import type { CurriculumSubject } from '@/types';

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

export interface ScienceQuestLocal {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  locationName: string;
  locationType: 'hut' | 'village' | 'city' | 'castle' | 'boss';
  color: string;
  glowColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Boss';
  briefingTitle: string;
  briefingDescription: string;
  teacherName: string;
  teacherEmoji: string;
  questions: ScienceQuestion[];
}

interface ScienceState {
  scene: ScienceScene;
  currentGrade: number;
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
  setGrade: (grade: number) => void;
  loadQuest: (questId: string) => void;
  collectVial: () => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

// Hardcoded quests for Grade 6 (original data with water cycle features)
// These have special water cycle stage features
const GRADE_QUESTS_HARDCODED: Record<number, ScienceQuestLocal[]> = {
  6: SCIENCE_QUESTS,
};

// Convert curriculum GameQuestion to local ScienceQuestion format
function toScienceQuestion(q: GameQuest['questions'][0], index: number): ScienceQuestion {
  return {
    id: index + 1,
    spirit: 'Science Guide',
    spiritEmoji: '🔬',
    spiritColor: '#0EA5E9',
    narrative: q.narrative,
    question: q.question,
    options: q.options,
    correct: q.correct,
    activeStage: 'all' as WaterStage,
    reward: `Vial ${index + 1} 💧`,
    clue: {
      title: q.clue.title,
      example: q.clue.example,
      highlightStage: 'all' as WaterStage,
    },
  };
}

// Convert curriculum GameQuest to local ScienceQuest format
function toScienceQuestLocal(gq: GameQuest): ScienceQuestLocal {
  return {
    id: gq.id,
    title: gq.title,
    subtitle: gq.subtitle,
    emoji: gq.emoji,
    locationName: gq.locationName,
    locationType: gq.locationType,
    color: gq.color,
    glowColor: gq.glowColor,
    difficulty: gq.difficulty,
    briefingTitle: gq.briefingTitle,
    briefingDescription: gq.briefingDescription,
    teacherName: gq.teacherName,
    teacherEmoji: gq.teacherEmoji,
    questions: gq.questions.map((q, i) => toScienceQuestion(q, i)),
  };
}

// Check if science quests are available for a grade
function hasScienceQuestsForGrade(grade: number): boolean {
  // First check hardcoded data (has water cycle features)
  if (GRADE_QUESTS_HARDCODED[grade] && GRADE_QUESTS_HARDCODED[grade].length > 0) {
    return true;
  }
  // Then check curriculum data
  const curriculumQuests = getGameQuests(grade, 'science' as CurriculumSubject);
  return curriculumQuests.length > 0;
}

// Get quests for a grade - prefer hardcoded (has water cycle features), then curriculum
function getQuestsForGrade(grade: number): ScienceQuestLocal[] {
  // First check if we have hardcoded quests with special features
  if (GRADE_QUESTS_HARDCODED[grade] && GRADE_QUESTS_HARDCODED[grade].length > 0) {
    return GRADE_QUESTS_HARDCODED[grade];
  }
  // Convert curriculum quests to local format
  const curriculumQuests = getGameQuests(grade, 'science' as CurriculumSubject);
  return curriculumQuests.map(toScienceQuestLocal);
}

const DEFAULT_GRADE = 6;
const FIRST_QUEST = getQuestsForGrade(DEFAULT_GRADE)[0];

export const useScienceStore = create<ScienceState>((set, get) => ({
  scene: 'QUEST_MAP',
  currentGrade: DEFAULT_GRADE,
  currentQuestId: FIRST_QUEST?.id || 'g6-science-q1',
  studentName: 'Explorer',
  vialsCollected: 0,
  totalVials: 5,
  currentQuestion: 0,
  questions: FIRST_QUEST?.questions || [],
  score: 0,
  clueUsed: FIRST_QUEST ? new Array(FIRST_QUEST.questions.length).fill(false) : [],
  xpEarned: 0,

  setScene: (scene) => set({ scene }),

  setGrade: (grade) => {
    const quests = getQuestsForGrade(grade);
    if (!quests || quests.length === 0) {
      // Grade not available yet
      return;
    }
    const firstQuest = quests[0];
    set({
      currentGrade: grade,
      currentQuestId: firstQuest.id,
      questions: firstQuest.questions,
      currentQuestion: 0,
      score: 0,
      vialsCollected: 0,
      clueUsed: new Array(firstQuest.questions.length).fill(false),
      xpEarned: 0,
      scene: 'QUEST_MAP',
    });
  },

  loadQuest: (questId) => {
    const { currentGrade } = get();
    const quests = getQuestsForGrade(currentGrade);
    const quest = quests.find(q => q.id === questId);
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
    currentGrade: DEFAULT_GRADE,
    currentQuestId: FIRST_QUEST?.id || 'g6-science-q1',
    vialsCollected: 0,
    currentQuestion: 0,
    score: 0,
    clueUsed: FIRST_QUEST ? new Array(FIRST_QUEST.questions.length).fill(false) : [],
    xpEarned: 0,
  }),
}));

// Export for QuestMapScene
export { SCIENCE_QUESTS, GRADE_QUESTS_HARDCODED, getQuestsForGrade };
export const getQuestById = (id: string, grade: number) => {
  const quests = getQuestsForGrade(grade);
  return quests.find(q => q.id === id);
};
export const getNextQuest = (currentId: string, grade: number) => {
  const quests = getQuestsForGrade(grade);
  const idx = quests.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < quests.length - 1 ? quests[idx + 1] : null;
};

// Check if a grade has quests available
export function hasQuestsForGrade(grade: number): boolean {
  return hasScienceQuestsForGrade(grade);
}