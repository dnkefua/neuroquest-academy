export type CurriculumCompletionStatus = 'complete' | 'scaffolded';

export interface SchoolSourceDocument {
  id: string;
  title: string;
  path: string;
  appliesTo: string;
}

export const SCHOOL_IB_SOURCE_DOCUMENTS: SchoolSourceDocument[] = [
  {
    id: 'eis-myp-parent-handbook-2025-2026',
    title: 'EISJ The Middle Years Curriculum Programme Parent Handbook Years 7 to 9, 2025-2026',
    path: 'textbook-folder/EIS IB corricullum.pdf',
    appliesTo: 'IB MYP framework, learner profile, ATL skills, global contexts, subject groups',
  },
  {
    id: 'pearson-secondary-catalog-2026',
    title: 'Pearson International Secondary Catalogue 2026',
    path: 'textbook-folder/2026-Pearson-Int-Sec-Cat.pdf',
    appliesTo: 'Secondary textbook family and progression scaffold',
  },
  {
    id: 'pearson-primary-catalog-2026',
    title: 'Pearson International Primary Catalogue 2026',
    path: 'textbook-folder/2026-Pearson-INT-Primary-Cat-UK-web.pdf',
    appliesTo: 'Primary textbook family and PYP scaffold',
  },
  {
    id: 'pearson-y8-math-progress-answers',
    title: 'Pearson Maths Progress International Year 8 Answers',
    path: 'textbook-folder/mathsprogint_y8ans.pdf',
    appliesTo: 'Grade 8 mathematics completed scope',
  },
  {
    id: 'pearson-y7-math-progress-answers',
    title: 'Pearson Maths Progress International Year 7 Answers',
    path: 'textbook-folder/maths-y7answers.pdf',
    appliesTo: 'Grade 7 mathematics scaffold',
  },
  {
    id: 'pearson-y9-math-progress-workbook',
    title: 'Pearson Maths Progress International Year 9A Workbook',
    path: 'textbook-folder/mathsprogint_y9a_wb.pdf',
    appliesTo: 'Grade 9 mathematics scaffold',
  },
];

export const GRADE_8_MATH_SOURCE_SCOPE = [
  {
    unit: 'Unit 1 Number',
    topics: ['calculating with negative integers', 'prime factor decomposition', 'using indices', 'priority of operations'],
  },
  {
    unit: 'Unit 2 Equations and formulae',
    topics: ['solving one-step equations', 'solving two-step equations', 'more complex equations', 'working with formulae'],
  },
  {
    unit: 'Unit 3 Working with powers',
    topics: ['simplifying expressions', 'more simplifying', 'factorising expressions', 'expanding and factorising expressions', 'substituting and solving'],
  },
  {
    unit: 'Unit 4 2D shapes and 3D solids',
    topics: ['area of triangles, parallelograms and trapezia', 'area of compound shapes', 'properties of 3D solids', 'surface area', 'volume', 'plans and elevations'],
  },
  {
    unit: 'Unit 5 Graphs',
    topics: ['direct proportion', 'interpreting graphs', 'distance-time graphs', 'rates of change', 'misleading graphs'],
  },
];

export function getSchoolSourceDocuments(subject: string, grade: number): SchoolSourceDocument[] {
  const sources = SCHOOL_IB_SOURCE_DOCUMENTS.filter((doc) => {
    if (grade >= 7 && grade <= 9 && doc.id === 'eis-myp-parent-handbook-2025-2026') return true;
    if (grade >= 1 && grade <= 6 && doc.id === 'pearson-primary-catalog-2026') return true;
    if (grade >= 7 && grade <= 12 && doc.id === 'pearson-secondary-catalog-2026') return true;
    if (subject === 'math' && grade === 7 && doc.id === 'pearson-y7-math-progress-answers') return true;
    if (subject === 'math' && grade === 8 && doc.id === 'pearson-y8-math-progress-answers') return true;
    if (subject === 'math' && grade === 9 && doc.id === 'pearson-y9-math-progress-workbook') return true;
    return false;
  });

  return sources;
}

export function getCurriculumCompletionStatus(grade: number): CurriculumCompletionStatus {
  return grade === 8 ? 'complete' : 'scaffolded';
}
