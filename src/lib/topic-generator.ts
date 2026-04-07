'use client';
import { getIBContext, getTopicsForSubjectAndGrade, getAvailableGrades, getAllSubjects } from './ib-curriculum';
import type { IBGradeContext } from './ib-curriculum';

export interface GeneratedTopic {
  id: string;
  grade: number;
  subject: string;
  unit: string;
  title: string;
  description: string;
  keyConcepts: string[];
  learningObjectives: string[];
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  ibFramework: string;
  ibTopicKey: string;
  priorKnowledge: string;
  sampleProblems: string[];
  realWorldConnections: string[];
  vocabulary: { term: string; definition: string }[];
}

export function generateTopicsForGrade(subject: string, grade: number): GeneratedTopic[] {
  const context = getIBContext(subject, grade);
  if (!context) return [];

  const programme = context.framework.includes('PYP') ? 'PYP' : context.framework.includes('MYP') ? 'MYP' : 'DP';
  const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    PYP: grade <= 3 ? 'beginner' : 'intermediate',
    MYP: grade <= 8 ? 'intermediate' : 'advanced',
    DP: 'advanced',
  };

  return context.topics.map((topic, i) => ({
    id: `${subject}-g${grade}-topic-${i + 1}`,
    grade,
    subject,
    unit: context.unit,
    title: topic,
    description: generateTopicDescription(topic, subject, grade),
    keyConcepts: generateKeyConcepts(topic, subject),
    learningObjectives: generateLearningObjectives(topic, subject, grade),
    estimatedMinutes: 10 + Math.floor(Math.random() * 20),
    difficulty: difficultyMap[programme] || 'intermediate',
    prerequisites: i > 0 ? [`${subject}-g${grade}-topic-${i}`] : [],
    ibFramework: context.framework,
    ibTopicKey: context.ibTopicKey,
    priorKnowledge: context.priorKnowledge,
    sampleProblems: context.sampleProblems || [],
    realWorldConnections: generateRealWorldConnections(topic, subject),
    vocabulary: generateVocabulary(topic, subject),
  }));
}

function generateTopicDescription(topic: string, subject: string, grade: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    math: {
      'counting': 'Students develop number sense by counting, reading, and writing numbers, building the foundation for all mathematical thinking.',
      'addition': 'Students solve addition and subtraction problems using concrete objects, drawings, and mental strategies.',
      'multiplication': 'Students understand multiplication as equal groups and develop fluency with multiplication facts.',
      'fractions': 'Students understand fractions as parts of a whole and represent them in multiple ways.',
      'algebra': 'Students use variables and expressions to represent and solve mathematical relationships.',
      'geometry': 'Students explore shapes, angles, and spatial relationships through hands-on investigation.',
      'statistics': 'Students collect, organize, and interpret data to make informed decisions.',
      'calculus': 'Students explore limits, derivatives, and integrals to model continuous change.',
    },
    science: {
      'living': 'Students observe and describe the characteristics and needs of living organisms.',
      'cells': 'Students explore the structure and function of cells as the basic units of life.',
      'forces': 'Students investigate how forces cause changes in motion and interact with objects.',
      'energy': 'Students explore different forms of energy and how it transfers and transforms.',
      'chemistry': 'Students investigate the composition of matter and how substances interact.',
      'genetics': 'Students explore how traits are inherited and how variation arises in populations.',
    },
    english: {
      'phonics': 'Students develop letter-sound relationships and early decoding skills for reading.',
      'narrative': 'Students write stories with clear structure, character development, and descriptive language.',
      'persuasive': 'Students construct arguments with evidence, reasoning, and persuasive techniques.',
      'poetry': 'Students analyze and create poetry using imagery, rhythm, and figurative language.',
      'analysis': 'Students develop critical reading skills to analyze theme, character, and author\'s craft.',
    },
  };

  const subjectDescs = descriptions[subject] || descriptions.english;
  const key = Object.keys(subjectDescs).find(k => topic.toLowerCase().includes(k));
  if (key) return subjectDescs[key];

  return `Students explore ${topic.toLowerCase()} through inquiry-based activities, collaborative learning, and real-world applications aligned with IB standards for Grade ${grade}.`;
}

function generateKeyConcepts(topic: string, subject: string): string[] {
  const conceptMap: Record<string, string[]> = {
    math: ['Logic', 'Patterns', 'Relationships', 'Change', 'Representation'],
    science: ['Systems', 'Change', 'Evidence', 'Interactions', 'Structure'],
    english: ['Communication', 'Perspective', 'Creativity', 'Context', 'Style'],
    'social-studies': ['Systems', 'Change', 'Perspective', 'Power', 'Identity'],
    'social-skills': ['Connection', 'Responsibility', 'Identity', 'Communication', 'Empathy'],
  };
  const concepts = conceptMap[subject] || conceptMap.english;
  return concepts.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateLearningObjectives(topic: string, subject: string, grade: number): string[] {
  const objectiveTemplates: Record<string, string[]> = {
    math: [
      'Understand and apply {concept} to solve problems',
      'Represent {concept} using multiple methods',
      'Explain reasoning using mathematical language',
      'Connect {concept} to real-world situations',
    ],
    science: [
      'Describe the structure and function of {concept}',
      'Investigate {concept} through hands-on experiments',
      'Analyze data and draw evidence-based conclusions about {concept}',
      'Connect {concept} to real-world phenomena',
    ],
    english: [
      'Analyze how authors use {concept} to convey meaning',
      'Write effectively using {concept} techniques',
      'Evaluate the impact of {concept} on the reader',
      'Connect {concept} to broader themes and contexts',
    ],
  };

  const templates = objectiveTemplates[subject] || objectiveTemplates.english;
  const concept = topic.split(' ').slice(0, 3).join(' ').toLowerCase();
  return templates.map(t => t.replace('{concept}', concept)).slice(0, 3 + Math.min(grade, 4));
}

function generateRealWorldConnections(topic: string, subject: string): string[] {
  const connections: Record<string, string[]> = {
    math: [
      'Budgeting and financial planning',
      'Architecture and construction',
      'Sports statistics and analytics',
      'Cooking and recipe scaling',
      'Technology and coding',
    ],
    science: [
      'Environmental conservation',
      'Medical advances and health',
      'Engineering and innovation',
      'Climate change and sustainability',
      'Space exploration',
    ],
    english: [
      'Social media communication',
      'Journalism and news media',
      'Creative writing and storytelling',
      'Public speaking and debate',
      'Cultural expression through literature',
    ],
  };

  const subjectConnections = connections[subject] || connections.english;
  return subjectConnections.slice(0, 3);
}

function generateVocabulary(topic: string, subject: string): { term: string; definition: string }[] {
  const vocabSets: Record<string, Record<string, string>> = {
    math: {
      'variable': 'A symbol (usually a letter) that represents an unknown value',
      'equation': 'A mathematical statement showing two expressions are equal',
      'function': 'A relationship where each input has exactly one output',
      'derivative': 'The rate of change of a function at a point',
      'integral': 'The accumulation of quantities, reverse of differentiation',
      'fraction': 'A number representing a part of a whole',
      'decimal': 'A number expressed in base-10 notation with a decimal point',
    },
    science: {
      'cell': 'The basic structural and functional unit of all living organisms',
      'atom': 'The smallest unit of an element that retains its properties',
      'energy': 'The ability to do work or cause change',
      'ecosystem': 'A community of organisms interacting with their environment',
      'DNA': 'The molecule that carries genetic information',
      'force': 'A push or pull that can change the motion of an object',
    },
    english: {
      'metaphor': 'A comparison between two unlike things without using "like" or "as"',
      'theme': 'The central message or insight about life in a literary work',
      'narrative': 'A story or account of events, real or imagined',
      'perspective': 'The point of view from which a story is told',
      'imagery': 'Language that appeals to the senses',
      'tone': 'The author\'s attitude toward the subject or audience',
    },
  };

  const vocab = vocabSets[subject] || vocabSets.english;
  const entries = Object.entries(vocab);
  return entries.slice(0, 4).map(([term, definition]) => ({ term, definition }));
}

export function generateAllTopics(): GeneratedTopic[] {
  const all: GeneratedTopic[] = [];
  for (const subject of getAllSubjects()) {
    for (const grade of getAvailableGrades(subject)) {
      all.push(...generateTopicsForGrade(subject, grade));
    }
  }
  return all;
}

export function getTopicById(id: string): GeneratedTopic | undefined {
  return generateAllTopics().find(t => t.id === id);
}

export function getTopicsBySubject(subject: string): GeneratedTopic[] {
  const all: GeneratedTopic[] = [];
  for (const grade of getAvailableGrades(subject)) {
    all.push(...generateTopicsForGrade(subject, grade));
  }
  return all;
}
