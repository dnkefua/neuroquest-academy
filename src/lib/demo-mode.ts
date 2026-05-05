/**
 * Demo Mode for NeuroQuest Academy
 * 
 * Enables a sandbox preview without requiring:
 * - Real Firebase authentication
 * - Active AI API calls
 * - Live database connections
 * 
 * Uses mock data and simulated responses for demonstrations,
 * pilots, and sales presentations.
 */

import type { UserProfile, StudentClass } from '@/types';

// Demo user profiles for different personas
export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    uid: 'demo-student-001',
    name: 'Demo Student',
    email: 'student@demo.local',
    role: 'student',
    grade: 8,
    language: 'EN',
    xp: 2450,
    streak: 7,
    currentEmotion: 'happy',
    createdAt: new Date().toISOString(),
    studentClass: 'math',
    approvedQuestIds: ['g8-math-1', 'g8-math-2', 'g8-science-1'],
    completedQuests: ['g8-math-1'],
  },
  parent: {
    uid: 'demo-parent-001',
    name: 'Demo Parent',
    email: 'parent@demo.local',
    role: 'parent',
    grade: 8,
    language: 'EN',
    xp: 0,
    streak: 0,
    currentEmotion: 'neutral',
    createdAt: new Date().toISOString(),
    childUids: ['demo-student-001'],
  },
  teacher: {
    uid: 'demo-teacher-001',
    name: 'Demo Teacher',
    email: 'teacher@demo.local',
    role: 'teacher',
    grade: 8,
    language: 'EN',
    xp: 0,
    streak: 0,
    currentEmotion: 'neutral',
    createdAt: new Date().toISOString(),
  },
};

// Demo quest data
export const DEMO_QUESTS = [
  {
    id: 'g8-math-1',
    title: 'Algebraic Expressions',
    subject: 'math',
    grade: 8,
    difficulty: 'medium',
    xpReward: 150,
    duration: '20 min',
    description: 'Learn to solve algebraic expressions step by step',
    objectives: [
      'Understand variables and constants',
      'Simplify expressions',
      'Solve basic equations',
    ],
  },
  {
    id: 'g8-math-2',
    title: 'Linear Equations',
    subject: 'math',
    grade: 8,
    difficulty: 'medium',
    xpReward: 175,
    duration: '25 min',
    description: 'Master linear equations with real-world examples',
    objectives: [
      'Identify linear patterns',
      'Graph linear functions',
      'Solve systems of equations',
    ],
  },
  {
    id: 'g8-science-1',
    title: 'Chemical Reactions',
    subject: 'science',
    grade: 8,
    difficulty: 'hard',
    xpReward: 200,
    duration: '30 min',
    description: 'Explore chemical reactions and their applications',
    objectives: [
      'Understand reaction types',
      'Balance chemical equations',
      'Apply to real-world scenarios',
    ],
  },
];

// Demo progress data
export const DEMO_PROGRESS = {
  totalXP: 2450,
  level: 25,
  streak: 7,
  questsCompleted: 12,
  averageScore: 87,
  subjectsProgress: {
    math: { completed: 5, total: 8, mastery: 62 },
    science: { completed: 4, total: 8, mastery: 50 },
    english: { completed: 2, total: 8, mastery: 25 },
    arabic: { completed: 1, total: 8, mastery: 12 },
  },
};

// Demo curriculum map for Grade 8
export const DEMO_CURRICULUM = {
  grade: 8,
  framework: 'IB MYP',
  subjects: [
    {
      id: 'math',
      name: 'Mathematics',
      topics: [
        { id: 'num-algebra', name: 'Number and Algebra', quests: 10 },
        { id: 'geometry', name: 'Geometry and Measurement', quests: 8 },
        { id: 'statistics', name: 'Statistics and Probability', quests: 6 },
      ],
    },
    {
      id: 'science',
      name: 'Sciences',
      topics: [
        { id: 'physics', name: 'Physics', quests: 8 },
        { id: 'chemistry', name: 'Chemistry', quests: 6 },
        { id: 'biology', name: 'Biology', quests: 6 },
      ],
    },
    {
      id: 'english',
      name: 'Language and Literature',
      topics: [
        { id: 'writing', name: 'Written Expression', quests: 6 },
        { id: 'reading', name: 'Reading Comprehension', quests: 6 },
      ],
    },
    {
      id: 'arabic',
      name: 'Language Acquisition (Arabic)',
      topics: [
        { id: 'writing-ar', name: 'Arabic Writing', quests: 5 },
        { id: 'reading-ar', name: 'Arabic Reading', quests: 5 },
      ],
    },
  ],
};

// Check if demo mode is enabled
export function isDemoMode(): boolean {
  return typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost' && !process.env.NEXT_PUBLIC_DEMO_MODE
      ? localStorage.getItem('demo_mode') === 'true'
      : process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    : false;
}

// Get demo profile by role
export function getDemoProfile(role: 'student' | 'parent' | 'teacher' = 'student'): UserProfile {
  return DEMO_PROFILES[role] || DEMO_PROFILES.student;
}

// Simulate API delay for realistic demo
export async function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Demo mode export for use in components
export const DEMO_MODE = {
  enabled: isDemoMode(),
  profile: DEMO_PROFILES.student,
  quests: DEMO_QUESTS,
  progress: DEMO_PROGRESS,
  curriculum: DEMO_CURRICULUM,
};
