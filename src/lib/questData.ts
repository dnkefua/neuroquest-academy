import type { CurriculumQuest, CurriculumSubject, Programme } from '@/types';

// Import curriculum quest data
import { PYP_QUESTS } from '@/curriculum/data/grades1-5';
import { MYP_QUESTS } from '@/curriculum/data/grades6-10';
import { DP_QUESTS } from '@/curriculum/data/grades11-12';
import { ENGLISH_QUESTS } from '@/curriculum/data/english';
import { SOCIAL_QUESTS } from '@/curriculum/data/social';
import { SOCIAL_SKILLS_QUESTS } from '@/curriculum/data/socialSkills';

// ── Game Quest Types ───────────────────────────────────────────────────────────

export type LocationType = 'hut' | 'village' | 'city' | 'castle' | 'boss';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Boss';

export interface GameQuest {
  id: string;
  grade: number;
  programme: Programme;
  subject: CurriculumSubject;
  title: string;
  subtitle: string;
  emoji: string;
  locationName: string;
  locationType: LocationType;
  color: string;
  glowColor: string;
  difficulty: Difficulty;
  briefingTitle: string;
  briefingDescription: string;
  teacherName: string;
  teacherEmoji: string;
  questions: GameQuestion[];
}

export interface GameQuestion {
  id: number;
  narrative: string;
  question: string;
  equation?: string;
  options: string[];
  correct: number;
  clue: {
    title: string;
    example: string;
    visual?: 'numberLine' | 'text' | 'diagram';
    cost: number;
  };
}

// ── Theme configurations by subject ─────────────────────────────────────────────

const SUBJECT_THEMES: Record<CurriculumSubject, { colors: string[]; emoji: string }> = {
  math: { colors: ['#8B5CF6', '#0EA5E9', '#10B981', '#F97316'], emoji: '🔢' },
  science: { colors: ['#0EA5E9', '#6366F1', '#10B981', '#F97316'], emoji: '🔬' },
  english: { colors: ['#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'], emoji: '📖' },
  social: { colors: ['#F59E0B', '#84CC16', '#F97316', '#EF4444'], emoji: '🌍' },
  socialSkills: { colors: ['#EC4899', '#8B5CF6', '#14B8A6', '#F59E0B'], emoji: '💜' },
};

const LOCATION_TYPES: LocationType[] = ['hut', 'village', 'city', 'castle', 'boss'];
const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Boss'];

// ── Curriculum Quest Registry ───────────────────────────────────────────────────

export const ALL_CURRICULUM_QUESTS: CurriculumQuest[] = [
  ...PYP_QUESTS,
  ...MYP_QUESTS,
  ...DP_QUESTS,
  ...ENGLISH_QUESTS,
  ...SOCIAL_QUESTS,
  ...SOCIAL_SKILLS_QUESTS,
];

// ── Helper Functions ─────────────────────────────────────────────────────────────

/**
 * Get all curriculum quests for a specific grade and subject
 */
export function getCurriculumQuestsByGradeSubject(
  grade: number,
  subject: CurriculumSubject
): CurriculumQuest[] {
  return ALL_CURRICULUM_QUESTS.filter(
    (q) => q.grade === grade && q.subject === subject
  );
}

/**
 * Get a single curriculum quest by ID
 */
export function getCurriculumQuestById(id: string): CurriculumQuest | undefined {
  return ALL_CURRICULUM_QUESTS.find((q) => q.id === id);
}

/**
 * Get all grades that have quests for a subject
 */
export function getGradesForSubject(subject: CurriculumSubject): number[] {
  const grades = new Set<number>();
  ALL_CURRICULUM_QUESTS.forEach((q) => {
    if (q.subject === subject) grades.add(q.grade);
  });
  return Array.from(grades).sort((a, b) => a - b);
}

/**
 * Get all subjects available for a grade
 */
export function getSubjectsForGrade(grade: number): CurriculumSubject[] {
  const subjects = new Set<CurriculumSubject>();
  ALL_CURRICULUM_QUESTS.forEach((q) => {
    if (q.grade === grade) subjects.add(q.subject);
  });
  return Array.from(subjects);
}

/**
 * Get programme for a grade
 */
export function getProgrammeForGrade(grade: number): Programme {
  if (grade >= 1 && grade <= 5) return 'PYP';
  if (grade >= 6 && grade <= 10) return 'MYP';
  return 'DP';
}

/**
 * Convert curriculum quest question to game question format
 */
function toGameQuestion(q: CurriculumQuest['questions'][0], index: number): GameQuestion {
  // Use clue if provided, otherwise generate defaults
  const defaultClue = {
    title: 'Hint',
    explanation: 'Think carefully about the question.',
    visual: 'text' as const,
    cost: 10,
  };
  const clueData = q.clue || defaultClue;

  return {
    id: index + 1,
    narrative: q.narrative,
    question: q.question,
    equation: q.equation,
    options: q.options,
    correct: q.correctIndex,
    clue: {
      title: clueData.title,
      example: clueData.explanation,
      visual: clueData.visual,
      cost: clueData.cost,
    },
  };
}

/**
 * Convert curriculum quest to game quest format
 * Creates 4 quests from each curriculum quest, splitting questions across them
 */
export function toGameQuests(quest: CurriculumQuest): GameQuest[] {
  const theme = SUBJECT_THEMES[quest.subject];
  const questions = quest.questions;

  // Split 5 questions into 4 quests: [2, 1, 1, 1]
  // Quest 1 gets 2 questions (intro), others get 1 each
  const questionSplits = [2, 1, 1, 1];
  let questionIndex = 0;

  const locationNames: Record<CurriculumSubject, string[]> = {
    math: ['Number Caves', 'Equation Village', 'Calculus City', 'Infinity Tower', "Final Boss Arena"],
    science: ['Lab Station', 'Discovery Base', 'Research Hub', 'Experiment Lab', 'Breakthrough Center'],
    english: ['Story Cottage', 'Grammar Village', 'Literature Town', 'Writer Castle', 'Author Hall'],
    social: ['Village Square', 'Market Town', 'Capital City', 'Government Hall', 'World Stage'],
    socialSkills: ['Friendship Corner', 'Community Center', 'Understanding Hub', 'Leadership Tower', 'Harmony Hall'],
  };

  return questionSplits.map((count, i): GameQuest => {
    const questQuestions = questions.slice(questionIndex, questionIndex + count);
    questionIndex += count;

    const difficulty = DIFFICULTIES[Math.min(i, 3)];
    const locationType = LOCATION_TYPES[Math.min(i, 4)];
    const color = theme.colors[i % theme.colors.length];

    return {
      id: `${quest.id}-q${i + 1}`,
      grade: quest.grade,
      programme: quest.programme,
      subject: quest.subject,
      title: quest.title,
      subtitle: i === 0 ? quest.theme : `Part ${i + 1}: ${quest.theme}`,
      emoji: i === 3 ? '🏆' : theme.emoji,
      locationName: locationNames[quest.subject][i] || quest.realmName,
      locationType,
      color,
      glowColor: color + '80',
      difficulty,
      briefingTitle: i === 0 ? quest.title : `${quest.title} - Part ${i + 1}`,
      briefingDescription: i === 0
        ? quest.narrativeWorld.slice(0, 100) + '...'
        : `Continue your journey through ${quest.realmName}!`,
      teacherName: quest.characterTeacher,
      teacherEmoji: quest.teacherEmoji,
      questions: questQuestions.map((q, idx) => toGameQuestion(q, idx)),
    };
  });
}

/**
 * Get all game quests for a grade and subject
 */
export function getGameQuests(grade: number, subject: CurriculumSubject): GameQuest[] {
  const curriculumQuests = getCurriculumQuestsByGradeSubject(grade, subject);
  return curriculumQuests.flatMap(toGameQuests);
}

/**
 * Get a specific game quest by ID
 */
export function getGameQuestById(id: string): GameQuest | undefined {
  // Parse ID like "g6-math-q1"
  const match = id.match(/^g(\d+)-(math|science|english|social|socialSkills)-q(\d+)$/);
  if (!match) return undefined;

  const [, gradeStr, subject, questNum] = match;
  const grade = parseInt(gradeStr, 10);
  const quests = getGameQuests(grade, subject as CurriculumSubject);
  return quests.find((q) => q.id === id);
}

/**
 * Get the next quest in sequence
 */
export function getNextGameQuest(currentId: string): GameQuest | null {
  const match = currentId.match(/^g(\d+)-(math|science|english|social|socialSkills)-q(\d+)$/);
  if (!match) return null;

  const [, gradeStr, subject, questNum] = match;
  const grade = parseInt(gradeStr, 10);
  const questNumber = parseInt(questNum, 10);

  const quests = getGameQuests(grade, subject as CurriculumSubject);
  const nextQuest = quests.find((q) => q.id === `${currentId.slice(0, -2)}-q${questNumber + 1}`);

  return nextQuest || null;
}

// ── Export counts for UI ────────────────────────────────────────────────────────

export function getQuestCountForGrade(grade: number, subject: CurriculumSubject): number {
  return getGameQuests(grade, subject).length;
}

export function getTotalQuestsForGrade(grade: number): number {
  const subjects = getSubjectsForGrade(grade);
  return subjects.reduce((sum, subject) => sum + getQuestCountForGrade(grade, subject), 0);
}

/**
 * Check if any quests exist for a grade/subject combination
 */
export function hasQuestsForGradeSubject(grade: number, subject: CurriculumSubject): boolean {
  return getQuestCountForGrade(grade, subject) > 0;
}

/**
 * Get all subjects that have quests for a specific grade
 * Returns subjects with their availability status
 */
export function getAvailableSubjectsForGrade(grade: number): Array<{ id: CurriculumSubject; label: string; emoji: string; hasQuests: boolean }> {
  const SUBJECT_INFO: Array<{ id: CurriculumSubject; label: string; emoji: string }> = [
    { id: 'math', label: 'Mathematics', emoji: '🔢' },
    { id: 'science', label: 'Science', emoji: '🔬' },
    { id: 'english', label: 'English', emoji: '📖' },
    { id: 'social', label: 'Social Studies', emoji: '🌍' },
    { id: 'socialSkills', label: 'Social Skills', emoji: '💜' },
  ];

  return SUBJECT_INFO.map(subject => ({
    ...subject,
    hasQuests: hasQuestsForGradeSubject(grade, subject.id),
  }));
}

/**
 * Get route path for a subject
 */
export function getRouteForSubject(subject: CurriculumSubject, grade: number): string {
  const routes: Record<CurriculumSubject, (g: number) => string> = {
    math: (g) => `/game/math?grade=${g}`,
    science: (g) => `/game/science?grade=${g}`,
    english: (g) => `/game/english?grade=${g}`,
    social: (g) => `/game/social?grade=${g}`,
    socialSkills: (g) => `/game/socialSkills?grade=${g}`,
  };
  return routes[subject](grade);
}