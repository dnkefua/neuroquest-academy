import type { Question } from '../store/gameStore';

export interface MathQuest {
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
  teacherName?: string;
  teacherEmoji?: string;
  subject?: string;
  theme?: string;
  questions: Question[];
}

// ── Quest 1: Pirate Cove (Beginner) ────────────────────────────────────────
const QUEST_1_QUESTIONS: Question[] = [
  {
    id: 1,
    narrative: "Captain Plus throws 3 gold coins INTO the treasure chest (+3), then Navigator Minus TAKES 5 coins out (-5).",
    question: "How many coins are in the chest?",
    equation: "3 + (-5) = ?",
    options: ["-2", "8", "2", "-8"],
    correct: 0,
    numberLineStart: 3, numberLineMove: -5,
    clue: { title: "Adding a Negative Number", example: "Think of it as moving LEFT on the number line!\nStart at 3 → hop 5 steps LEFT → land on -2\n3 + (-5) = 3 - 5 = -2 ✅", startValue: 3, moveValue: -5 },
  },
  {
    id: 2,
    narrative: "Parrot Pete finds a treasure map at position -4 on the Number Sea. He sails 6 leagues in the POSITIVE direction.",
    question: "Where does Pete end up?",
    equation: "-4 + 6 = ?",
    options: ["2", "-10", "10", "-2"],
    correct: 0,
    numberLineStart: -4, numberLineMove: 6,
    clue: { title: "Negative + Positive", example: "Start at -4 → hop 6 steps RIGHT\n-4, -3, -2, -1, 0, 1, 2 ← STOP!\n-4 + 6 = 2 ✅", startValue: -4, moveValue: 6 },
  },
  {
    id: 3,
    narrative: "Gold-Eye Greta owes the crew -7 coins (debt). She then loses another 3 coins overboard.",
    question: "What is Greta's total coin balance?",
    equation: "-7 + (-3) = ?",
    options: ["-10", "4", "-4", "10"],
    correct: 0,
    numberLineStart: -7, numberLineMove: -3,
    clue: { title: "Two Negatives", example: "Two negatives = move MORE to the left!\nStart at -7 → hop 3 more LEFT → -10\n-7 + (-3) = -7 - 3 = -10 ✅", startValue: -7, moveValue: -3 },
  },
  {
    id: 4,
    narrative: "Jolly Zero's ship is at position -2. The wind pushes him FORWARD 5 leagues, but then a wave pushes him BACK 3 leagues.",
    question: "Where is Zero's ship now?",
    equation: "-2 + 5 + (-3) = ?",
    options: ["0", "-4", "6", "-6"],
    correct: 0,
    numberLineStart: -2, numberLineMove: 5, numberLineMove2: -3,
    clue: { title: "Three Steps — Solve in Order!", example: "Step 1: -2 + 5 = 3 (move right 5)\nStep 2: 3 + (-3) = 0 (move left 3)\nFinal Answer: 0 ✅", startValue: -2, moveValue: 5, moveValue2: -3 },
  },
  {
    id: 5,
    narrative: "A diver is at -8 meters below sea level. She swims UP 12 meters, then DOWN 3 meters.",
    question: "What is the diver's final depth?",
    equation: "-8 + 12 + (-3) = ?",
    options: ["1", "-1", "7", "-7"],
    correct: 0,
    numberLineStart: -8, numberLineMove: 12, numberLineMove2: -3,
    clue: { title: "Real World Negative Numbers!", example: "Below sea = NEGATIVE! Above = POSITIVE!\nStep 1: -8 + 12 = 4 (swim up 12m)\nStep 2: 4 + (-3) = 1 (dive down 3m)\nDiver is 1 meter ABOVE sea level! ✅", startValue: -8, moveValue: 12, moveValue2: -3 },
  },
];

// ── Quest 2: Storm Sea Village (Intermediate) ───────────────────────────────
const QUEST_2_QUESTIONS: Question[] = [
  {
    id: 1,
    narrative: "Navigator Minus must subtract from a negative port. The ship is at -3, and must move 4 leagues BACK.",
    question: "What is -3 minus 4?",
    equation: "-3 - 4 = ?",
    options: ["-7", "1", "7", "-1"],
    correct: 0,
    numberLineStart: -3, numberLineMove: -4,
    clue: { title: "Subtracting from a Negative", example: "Subtracting moves you LEFT!\nStart at -3 → move 4 LEFT → -7\n-3 - 4 = -7 ✅", startValue: -3, moveValue: -4 },
  },
  {
    id: 2,
    narrative: "The storm blew the fleet to position 5. Captain subtracts a debt of 8 leagues.",
    question: "What position is the fleet at now?",
    equation: "5 - 8 = ?",
    options: ["-3", "3", "13", "-13"],
    correct: 0,
    numberLineStart: 5, numberLineMove: -8,
    clue: { title: "Subtracting Past Zero", example: "Start at 5 → move 8 LEFT → cross zero!\n5, 4, 3, 2, 1, 0, -1, -2, -3 ← STOP!\n5 - 8 = -3 ✅", startValue: 5, moveValue: -8 },
  },
  {
    id: 3,
    narrative: "Subtracting a negative is like adding! The galley is at -2, minus (-6) leagues.",
    question: "What is -2 minus (-6)?",
    equation: "-2 - (-6) = ?",
    options: ["4", "-8", "-4", "8"],
    correct: 0,
    numberLineStart: -2, numberLineMove: 6,
    clue: { title: "Minus a Negative = Plus!", example: "Two negatives cancel!\n-2 - (-6) = -2 + 6 = 4\nStart at -2 → move 6 RIGHT → 4 ✅", startValue: -2, moveValue: 6 },
  },
  {
    id: 4,
    narrative: "The storm pushed the fleet 9 leagues back from position 4, then a gale pushed 3 more leagues forward.",
    question: "What is the final position?",
    equation: "4 - 9 + 3 = ?",
    options: ["-2", "2", "16", "-16"],
    correct: 0,
    numberLineStart: 4, numberLineMove: -9, numberLineMove2: 3,
    clue: { title: "Mixed Operations", example: "Step 1: 4 - 9 = -5 (move left 9)\nStep 2: -5 + 3 = -2 (move right 3)\nFinal: -2 ✅", startValue: 4, moveValue: -9, moveValue2: 3 },
  },
  {
    id: 5,
    narrative: "STORM BOSS! A ship at -6 receives cargo worth +10, but then loses a crate worth -4 (the crate falls off).",
    question: "What is -6 + 10 - (-4)?",
    equation: "-6 + 10 - (-4) = ?",
    options: ["8", "0", "-8", "12"],
    correct: 0,
    numberLineStart: -6, numberLineMove: 10, numberLineMove2: 4,
    clue: { title: "All Operations Together!", example: "-6 + 10 - (-4)\n= -6 + 10 + 4  (minus neg = plus!)\nStep 1: -6 + 10 = 4\nStep 2: 4 + 4 = 8 ✅", startValue: -6, moveValue: 10, moveValue2: 4 },
  },
];

// ── Quest 3: Crystal Caverns (Advanced) ────────────────────────────────────
const QUEST_3_QUESTIONS: Question[] = [
  {
    id: 1,
    narrative: "Deep in the crystal caves, the temperature is -15°C. The fire crystal warms it by 22 degrees.",
    question: "What is the new temperature?",
    equation: "-15 + 22 = ?",
    options: ["7", "-7", "37", "-37"],
    correct: 0,
    numberLineStart: -15, numberLineMove: 22,
    clue: { title: "Large Jumps on the Number Line", example: "Start at -15 → jump 22 RIGHT\n-15 + 22 = 7°C ✅\nThe cave is now 7 degrees!", startValue: -15, moveValue: 22 },
  },
  {
    id: 2,
    narrative: "The crystal elevator goes from floor -12 to floor +8.",
    question: "How many floors did it travel?",
    equation: "8 - (-12) = ?",
    options: ["20", "-20", "4", "-4"],
    correct: 0,
    numberLineStart: -12, numberLineMove: 20,
    clue: { title: "Finding the Distance", example: "Distance = higher - lower\n8 - (-12) = 8 + 12 = 20 floors ✅", startValue: -12, moveValue: 20 },
  },
  {
    id: 3,
    narrative: "A crystal miner starts at -30 and rises 15 levels, then sinks 25 levels to reach a deeper vein.",
    question: "Where is the miner now?",
    equation: "-30 + 15 - 25 = ?",
    options: ["-40", "10", "40", "-10"],
    correct: 0,
    numberLineStart: -30, numberLineMove: 15, numberLineMove2: -25,
    clue: { title: "Three Steps — Large Numbers", example: "Step 1: -30 + 15 = -15 (rise 15)\nStep 2: -15 - 25 = -40 (sink 25)\nFinal: -40 ✅", startValue: -30, moveValue: 15, moveValue2: -25 },
  },
  {
    id: 4,
    narrative: "The cave score is -48. A gem adds +55 points, but a cave-in deducts 19 points.",
    question: "What is the final score?",
    equation: "-48 + 55 - 19 = ?",
    options: ["-12", "12", "-122", "122"],
    correct: 0,
    numberLineStart: -48, numberLineMove: 55, numberLineMove2: -19,
    clue: { title: "Cave Score Strategy", example: "Step 1: -48 + 55 = 7\nStep 2: 7 - 19 = -12\nFinal Score: -12 ✅", startValue: -48, moveValue: 55, moveValue2: -19 },
  },
  {
    id: 5,
    narrative: "CRYSTAL GUARDIAN! The Guardian stands at -100. A power burst sends it +67, then a drain pulls -(-28).",
    question: "Evaluate: -100 + 67 - (-28)",
    equation: "-100 + 67 - (-28) = ?",
    options: ["-5", "5", "-195", "195"],
    correct: 0,
    numberLineStart: -100, numberLineMove: 67, numberLineMove2: 28,
    clue: { title: "The Final Formula!", example: "-100 + 67 - (-28)\n= -100 + 67 + 28\nStep 1: -100 + 67 = -33\nStep 2: -33 + 28 = -5 ✅", startValue: -100, moveValue: 67, moveValue2: 28 },
  },
];

// ── Quest 4: The Number Kraken (Boss) ──────────────────────────────────────
const QUEST_4_QUESTIONS: Question[] = [
  {
    id: 1,
    narrative: "The Kraken's first tentacle reaches from -200 to +150. How far is that reach?",
    question: "What is 150 - (-200)?",
    equation: "150 - (-200) = ?",
    options: ["350", "50", "-350", "-50"],
    correct: 0,
    numberLineStart: -200, numberLineMove: 350,
    clue: { title: "Kraken Reach = Total Distance", example: "150 - (-200) = 150 + 200 = 350\nThe Kraken's reach is 350 units! ✅", startValue: -200, moveValue: 350 },
  },
  {
    id: 2,
    narrative: "The Kraken's cave temperature drops 75 degrees from 20°C, then rises 40°C due to volcanic heat.",
    question: "What is 20 - 75 + 40?",
    equation: "20 - 75 + 40 = ?",
    options: ["-15", "15", "135", "-135"],
    correct: 0,
    numberLineStart: 20, numberLineMove: -75, numberLineMove2: 40,
    clue: { title: "Temperature Changes", example: "Step 1: 20 - 75 = -55\nStep 2: -55 + 40 = -15°C ✅", startValue: 20, moveValue: -75, moveValue2: 40 },
  },
  {
    id: 3,
    narrative: "The hero is at depth -500m. She fires a grappling hook to -500 - (-300) meters.",
    question: "What depth does the hook reach?",
    equation: "-500 - (-300) = ?",
    options: ["-200", "-800", "200", "800"],
    correct: 0,
    numberLineStart: -500, numberLineMove: 300,
    clue: { title: "Subtracting Negatives (Large!)", example: "-500 - (-300) = -500 + 300 = -200\nThe hook reaches -200m! ✅", startValue: -500, moveValue: 300 },
  },
  {
    id: 4,
    narrative: "The Kraken has -999 HP (it's heavily shielded!). The hero deals +1200 damage, then the Kraken self-heals -(-85).",
    question: "What is the Kraken's final HP?",
    equation: "-999 + 1200 - (-85) = ?",
    options: ["286", "-286", "116", "-116"],
    correct: 0,
    numberLineStart: -999, numberLineMove: 1200, numberLineMove2: 85,
    clue: { title: "HP Calculation", example: "-999 + 1200 - (-85)\n= -999 + 1200 + 85\nStep 1: -999 + 1200 = 201\nStep 2: 201 + 85 = 286 ✅", startValue: -999, moveValue: 1200, moveValue2: 85 },
  },
  {
    id: 5,
    narrative: "FINAL BLOW! The battle score starts at -500. Add 630, subtract -180, then subtract 60.",
    question: "Evaluate: -500 + 630 - (-180) - 60",
    equation: "-500 + 630 - (-180) - 60 = ?",
    options: ["250", "-250", "810", "-810"],
    correct: 0,
    numberLineStart: -500, numberLineMove: 630, numberLineMove2: 120,
    clue: { title: "BOSS FINAL FORMULA", example: "-500 + 630 - (-180) - 60\n= -500 + 630 + 180 - 60\nStep 1: -500 + 630 = 130\nStep 2: 130 + 180 = 310\nStep 3: 310 - 60 = 250 ✅", startValue: -500, moveValue: 630, moveValue2: 120 },
  },
];

// ── Quest registry ──────────────────────────────────────────────────────────
export const MATH_QUESTS: MathQuest[] = [
  {
    id: 'g6-math-q1',
    title: 'Pirate Cove',
    subtitle: 'Adding Positive & Negative Numbers',
    emoji: '🏴‍☠️',
    locationName: "Captain's Cove",
    locationType: 'hut',
    color: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.5)',
    difficulty: 'Beginner',
    briefingTitle: 'The Pirate Treasure Challenge',
    briefingDescription: 'Help the pirates count their treasure using positive and negative numbers!',
    teacherName: 'Zara the Wise',
    teacherEmoji: '🧙‍♀️',
    subject: 'math',
    theme: 'Adding positive and negative integers',
    questions: QUEST_1_QUESTIONS,
  },
  {
    id: 'g6-math-q2',
    title: 'Storm Sea Village',
    subtitle: 'Subtracting with Negatives',
    emoji: '⛵',
    locationName: 'Storm Village',
    locationType: 'village',
    color: '#0EA5E9',
    glowColor: 'rgba(14,165,233,0.5)',
    difficulty: 'Intermediate',
    briefingTitle: 'Surviving the Number Storm',
    briefingDescription: 'Navigate the storm by mastering subtraction with negative numbers!',
    teacherName: 'Captain Zero',
    teacherEmoji: '🏴‍☠️',
    subject: 'math',
    theme: 'Subtracting with negative numbers',
    questions: QUEST_2_QUESTIONS,
  },
  {
    id: 'g6-math-q3',
    title: 'Crystal Caverns',
    subtitle: 'Mixed Operations & Large Numbers',
    emoji: '💎',
    locationName: 'Crystal City',
    locationType: 'city',
    color: '#10B981',
    glowColor: 'rgba(16,185,129,0.5)',
    difficulty: 'Advanced',
    briefingTitle: 'The Crystal Mining Expedition',
    briefingDescription: 'Dig through the caverns using advanced negative number operations!',
    teacherName: 'Crystal the Miner',
    teacherEmoji: '⛏️',
    subject: 'math',
    theme: 'Mixed operations with large integers',
    questions: QUEST_3_QUESTIONS,
  },
  {
    id: 'g6-math-q4',
    title: 'The Number Kraken',
    subtitle: 'BOSS BATTLE — Master All Operations',
    emoji: '🦑',
    locationName: "Kraken's Lair",
    locationType: 'boss',
    color: '#F97316',
    glowColor: 'rgba(249,115,22,0.6)',
    difficulty: 'Boss',
    briefingTitle: 'BOSS: The Number Kraken Awakens!',
    briefingDescription: 'Face the ultimate challenge — defeat the Kraken with your mastery of all negative number operations!',
    teacherName: 'Zara the Wise',
    teacherEmoji: '🧙‍♀️',
    subject: 'math',
    theme: 'All integer operations',
    questions: QUEST_4_QUESTIONS,
  },
];

export const getQuestById = (id: string) => MATH_QUESTS.find(q => q.id === id);
export const getNextQuest = (currentId: string) => {
  const idx = MATH_QUESTS.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < MATH_QUESTS.length - 1 ? MATH_QUESTS[idx + 1] : null;
};
