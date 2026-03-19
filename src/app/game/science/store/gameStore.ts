'use client';
import { create } from 'zustand';

export type ScienceScene = 'MISSION_BRIEFING' | 'CLOUD_TEACHING' | 'QUIZ' | 'VICTORY';
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
  studentName: string;
  vialsCollected: number;
  totalVials: number;
  currentQuestion: number;
  questions: ScienceQuestion[];
  score: number;
  clueUsed: boolean[];
  xpEarned: number;
  setScene: (scene: ScienceScene) => void;
  collectVial: () => void;
  answerQuestion: (correct: boolean) => void;
  openClue: (index: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

const QUESTIONS: ScienceQuestion[] = [
  {
    id: 1,
    spirit: 'Evie Evaporation', spiritEmoji: '☀️', spiritColor: '#F59E0B',
    narrative: "Evie points to the oasis pool shimmering in the hot UAE sun. 'Omar, watch! The sun is heating the water in this pool. Look what happens next!'",
    question: "What happens to water when the sun heats it?",
    options: [
      "It turns into water vapor and rises into the sky",
      "It turns into ice and sinks to the bottom",
      "It turns into sand and disappears",
      "It stays exactly the same",
    ],
    correct: 0,
    activeStage: 'evaporation',
    reward: 'Crystal Vial 1 💧',
    clue: {
      title: "What is Evaporation?",
      example: "EVAPORATION = liquid water → water vapor (invisible gas)\n\nThe SUN provides heat energy.\nHeat makes water molecules move FASTER.\nThey move so fast they escape into the AIR!\nThis is why puddles disappear after rain! ☀️",
      highlightStage: 'evaporation',
    },
  },
  {
    id: 2,
    spirit: 'Coco Condensation', spiritEmoji: '☁️', spiritColor: '#93C5FD',
    narrative: "Coco swirls around a cold glass of water. Tiny droplets are forming on the OUTSIDE of the glass. 'See, Omar? This is my power!'",
    question: "Why do water droplets form on the outside of a cold glass?",
    options: [
      "The cold glass cools the warm air around it, turning vapor into droplets",
      "Water leaks through the glass from inside",
      "The glass is sweating because it is nervous",
      "Hot air makes water appear from nowhere",
    ],
    correct: 0,
    activeStage: 'condensation',
    reward: 'Crystal Vial 2 💧',
    clue: {
      title: "What is Condensation?",
      example: "CONDENSATION = water vapor (gas) → liquid droplets\n\nWarm air holds invisible water vapor.\nWhen warm air touches something COLD...\nThe vapor cools and turns back into tiny droplets!\nThis is exactly how CLOUDS form high in the sky! ☁️",
      highlightStage: 'condensation',
    },
  },
  {
    id: 3,
    spirit: 'Petra Precipitation', spiritEmoji: '🌧️', spiritColor: '#3B82F6',
    narrative: "Petra puffs up dramatically, turning dark gray. 'Omar! Look at me — I am VERY heavy with water today! Something is about to happen...'",
    question: "What causes a cloud to release water as rain?",
    options: [
      "The cloud collects so many droplets it becomes too heavy to hold them",
      "The cloud gets bored and wants to throw water",
      "The sun tells the cloud exactly when to rain",
      "Clouds only rain during nighttime",
    ],
    correct: 0,
    activeStage: 'precipitation',
    reward: 'Crystal Vial 3 💧',
    clue: {
      title: "What is Precipitation?",
      example: "PRECIPITATION = water falling from clouds to Earth\n\nClouds are made of MILLIONS of tiny droplets.\nAs more vapor condenses, droplets get BIGGER.\nWhen too heavy to float → they FALL as rain! 🌧️\nIn cold places: snow ❄️, sleet, or hail fall instead!",
      highlightStage: 'precipitation',
    },
  },
  {
    id: 4,
    spirit: 'Colly Collection', spiritEmoji: '💧', spiritColor: '#14B8A6',
    narrative: "After the rain, Colly points to a tiny stream forming in the sand, flowing toward the oasis. 'Watch where the water goes, Omar! It knows the way home.'",
    question: "After rain falls on land, where does most of the water go?",
    options: [
      "It flows into rivers, lakes, and oceans, or soaks into the ground",
      "It immediately evaporates straight back into the sky",
      "It turns into sand",
      "It floats back up to the clouds instantly",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Crystal Vial 4 💧',
    clue: {
      title: "What is Collection?",
      example: "COLLECTION = water gathers on Earth's surface\n\nRain flows DOWNHILL (gravity pulls it).\nIt collects in: rivers 🏞️, lakes, and oceans 🌊\nSome soaks INTO the ground → GROUNDWATER\nThis stored water waits for the sun to start again!\nThe cycle never ends! ♾️",
      highlightStage: 'collection',
    },
  },
  {
    id: 5,
    spirit: 'ALL FOUR SPIRITS', spiritEmoji: '🌀', spiritColor: '#A78BFA',
    narrative: "All four Cloud Spirits join hands and spin around Omar in a glowing circle. 'FINAL CHALLENGE, young scientist! Put the whole cycle in the correct order!'",
    question: "What is the CORRECT order of the water cycle?",
    options: [
      "Evaporation → Condensation → Precipitation → Collection",
      "Precipitation → Evaporation → Collection → Condensation",
      "Collection → Precipitation → Condensation → Evaporation",
      "Condensation → Collection → Evaporation → Precipitation",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'FOUNTAIN RESTORED! 🎉',
    clue: {
      title: "The Complete Water Cycle Order",
      example: "Remember with: 'Every Cat Plays Carefully'\n\n☀️ E-vaporation  → water rises as vapor\n☁️ C-ondensation → vapor cools, clouds form\n🌧️ P-recipitation → rain/snow falls down\n💧 C-ollection   → water fills rivers & oceans\n\nThen the sun heats it again → repeat forever! ♾️",
      highlightStage: 'all',
    },
  },
];

export const useScienceStore = create<ScienceState>((set) => ({
  scene: 'MISSION_BRIEFING',
  studentName: 'Omar',
  vialsCollected: 0,
  totalVials: 4,
  currentQuestion: 0,
  questions: QUESTIONS,
  score: 0,
  clueUsed: [false, false, false, false, false],
  xpEarned: 0,
  setScene: (scene) => set({ scene }),
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
    scene: 'MISSION_BRIEFING', vialsCollected: 0, currentQuestion: 0,
    score: 0, clueUsed: [false, false, false, false, false], xpEarned: 0,
  }),
}));
