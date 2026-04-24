'use client';

import type { ScienceQuestion } from '../store/gameStore';

export type ScienceLabMode = 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'atom' | 'waves' | 'lab';
export type ScienceExplainerConcept = 'water-cycle' | 'circuit' | 'force' | 'gravity' | 'states-of-matter';

function getText(questTitle: string, question?: ScienceQuestion): string {
  return [
    questTitle,
    question?.question,
    question?.narrative,
    question?.clue.title,
    question?.clue.example,
    question?.clue.explanation,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function inferScienceLabMode(questTitle: string, question?: ScienceQuestion): ScienceLabMode {
  const text = getText(questTitle, question);
  const type = question?.clue.simulationType;

  if (type === 'water-cycle' || text.includes('water cycle') || text.includes('evaporation')) return 'water-cycle';
  if (type === 'circuit' || text.includes('circuit') || text.includes('electric') || text.includes('current')) return 'circuit';
  if (type === 'force' || text.includes('force') || text.includes('motion') || text.includes('acceleration')) return 'force';
  if (type === 'gravity' || text.includes('gravity')) return 'gravity';
  if (text.includes('atom') || text.includes('element') || text.includes('periodic') || text.includes('electron') || text.includes('proton')) return 'atom';
  if (text.includes('wave') || text.includes('sound') || text.includes('light')) return 'waves';

  return 'lab';
}

export function inferScienceExplainerConcept(
  questTitle: string,
  question?: ScienceQuestion,
): ScienceExplainerConcept | null {
  const text = getText(questTitle, question);
  const type = question?.clue.simulationType;

  if (type === 'water-cycle' || text.includes('water cycle') || text.includes('evaporation')) return 'water-cycle';
  if (type === 'circuit' || text.includes('circuit') || text.includes('electric') || text.includes('current')) return 'circuit';
  if (type === 'force' || text.includes('force') || text.includes('motion') || text.includes('acceleration')) return 'force';
  if (type === 'gravity' || text.includes('gravity')) return 'gravity';
  if (text.includes('solid') || text.includes('liquid') || text.includes('gas') || text.includes('state of matter') || text.includes('states of matter')) {
    return 'states-of-matter';
  }

  return null;
}

export function getScienceDetail(question?: ScienceQuestion): string {
  return question?.clue.explanation || question?.narrative || 'Watch the model, then answer the challenge.';
}
