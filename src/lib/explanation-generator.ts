'use client';
import type { GeneratedTopic } from './topic-generator';

export interface GeneratedExplanation {
  topicId: string;
  title: string;
  introduction: string;
  sections: ExplanationSection[];
  workedExamples: WorkedExample[];
  commonMisconceptions: string[];
  realWorldConnections: string[];
  keyVocabulary: { term: string; definition: string }[];
  summary: string;
  estimatedReadTime: number;
}

export interface ExplanationSection {
  heading: string;
  content: string;
  visualType: 'diagram' | 'number-line' | 'chart' | 'timeline' | 'map' | 'interactive';
  keyPoints: string[];
}

export interface WorkedExample {
  title: string;
  problem: string;
  steps: string[];
  solution: string;
  checkUnderstanding: string;
}

export function generateExplanation(topic: GeneratedTopic): GeneratedExplanation {
  return {
    topicId: topic.id,
    title: topic.title,
    introduction: generateIntroduction(topic),
    sections: generateSections(topic),
    workedExamples: generateWorkedExamples(topic),
    commonMisconceptions: generateMisconceptions(topic),
    realWorldConnections: topic.realWorldConnections,
    keyVocabulary: topic.vocabulary,
    summary: generateSummary(topic),
    estimatedReadTime: Math.ceil(topic.estimatedMinutes * 0.6),
  };
}

function generateIntroduction(topic: GeneratedTopic): string {
  const intros: Record<string, string> = {
    math: `In this quest, you'll explore ${topic.title.toLowerCase()}. This is a fundamental concept that connects to many areas of mathematics and real-world problem solving.`,
    science: `Welcome to the investigation of ${topic.title.toLowerCase()}. Scientists use evidence and experimentation to understand how the natural world works, and this topic is no exception.`,
    english: `Let's dive into ${topic.title.toLowerCase()}. Great writers and readers use these skills to create meaning, connect with audiences, and explore the human experience.`,
    'social-studies': `In this exploration of ${topic.title.toLowerCase()}, you'll discover how societies, cultures, and systems have shaped our world and continue to influence our lives today.`,
    'social-skills': `This quest focuses on ${topic.title.toLowerCase()} — an essential skill that helps you build stronger relationships, navigate challenges, and become the best version of yourself.`,
    'emotional-regulation': `Understanding ${topic.title.toLowerCase()} is key to managing your emotions and building resilience. Let's explore strategies that actually work.`,
  };
  return intros[topic.subject] || intros.math;
}

function generateSections(topic: GeneratedTopic): ExplanationSection[] {
  const sectionTemplates: Record<string, { heading: string; visualType: ExplanationSection['visualType'] }[]> = {
    math: [
      { heading: 'What Is It?', visualType: 'diagram' },
      { heading: 'How Does It Work?', visualType: 'number-line' },
      { heading: 'Step by Step', visualType: 'interactive' },
      { heading: 'Practice It', visualType: 'chart' },
    ],
    science: [
      { heading: 'The Big Idea', visualType: 'diagram' },
      { heading: 'How It Works', visualType: 'interactive' },
      { heading: 'Evidence & Experiments', visualType: 'chart' },
      { heading: 'Real-World Impact', visualType: 'diagram' },
    ],
    english: [
      { heading: 'Understanding the Concept', visualType: 'diagram' },
      { heading: 'Examples in Literature', visualType: 'timeline' },
      { heading: 'How Writers Use It', visualType: 'interactive' },
      { heading: 'Try It Yourself', visualType: 'diagram' },
    ],
    'social-studies': [
      { heading: 'Historical Context', visualType: 'timeline' },
      { heading: 'Key Concepts', visualType: 'map' },
      { heading: 'Impact on Society', visualType: 'chart' },
      { heading: 'Modern Connections', visualType: 'diagram' },
    ],
    'social-skills': [
      { heading: 'Why It Matters', visualType: 'diagram' },
      { heading: 'Understanding the Skill', visualType: 'interactive' },
      { heading: 'Practice Scenarios', visualType: 'diagram' },
      { heading: 'Apply It Today', visualType: 'interactive' },
    ],
    'emotional-regulation': [
      { heading: 'Understanding the Emotion', visualType: 'diagram' },
      { heading: 'What Happens in Your Body', visualType: 'chart' },
      { heading: 'Strategies That Work', visualType: 'interactive' },
      { heading: 'Practice & Reflect', visualType: 'diagram' },
    ],
  };

  const templates = sectionTemplates[topic.subject] || sectionTemplates.math;

  return templates.map((template, i) => ({
    heading: template.heading,
    content: generateSectionContent(topic, template.heading, i),
    visualType: template.visualType,
    keyPoints: generateKeyPoints(topic, i),
  }));
}

function generateSectionContent(topic: GeneratedTopic, heading: string, index: number): string {
  const contentMap: Record<string, string[]> = {
    'What Is It?': [
      `${topic.title} is a fundamental concept in ${topic.subject}.`,
      `Think of it as a tool that helps us understand and solve problems.`,
      `At its core, it involves understanding relationships between quantities and patterns.`,
    ],
    'How Does It Work?': [
      `When we apply ${topic.title.toLowerCase()}, we follow a logical sequence of steps.`,
      `Each step builds on the previous one, creating a chain of reasoning.`,
      `The key is to understand why each step works, not just memorize the process.`,
    ],
    'Step by Step': [
      `Let's break this down into manageable pieces.`,
      `First, identify what you know and what you need to find.`,
      `Then, choose the right strategy and apply it carefully.`,
      `Finally, check your answer makes sense in the context of the problem.`,
    ],
    'Practice It': [
      `Now it's your turn! Try solving problems on your own.`,
      `Start with easier problems and gradually increase difficulty.`,
      `Remember: making mistakes is how we learn. Each error teaches us something valuable.`,
    ],
    'The Big Idea': [
      `The central idea behind ${topic.title.toLowerCase()} is that natural phenomena follow predictable patterns.`,
      `Scientists use observation, experimentation, and evidence to understand these patterns.`,
      `This knowledge helps us solve real-world problems and make informed decisions.`,
    ],
    'How It Works': [
      `At the most basic level, this involves interactions between components of a system.`,
      `Each component plays a specific role, and together they create something greater than the sum of their parts.`,
      `Understanding these interactions helps us predict outcomes and design solutions.`,
    ],
    'Evidence & Experiments': [
      `Scientists gather evidence through careful observation and controlled experiments.`,
      `Data is collected, analyzed, and used to support or refute hypotheses.`,
      `This process of inquiry is how scientific knowledge grows and evolves.`,
    ],
    'Real-World Impact': [
      `This concept has direct applications in technology, medicine, and environmental science.`,
      `Understanding it helps us make better decisions about our health, our communities, and our planet.`,
      `Many careers rely on this knowledge, from engineering to healthcare to research.`,
    ],
  };

  const contents = contentMap[heading];
  if (contents) return contents.join(' ');

  return `${topic.title} connects to ${topic.keyConcepts.join(' and ').toLowerCase()}. As you explore this topic, think about how it relates to your own experiences and the world around you. The more connections you make, the deeper your understanding becomes.`;
}

function generateKeyPoints(topic: GeneratedTopic, sectionIndex: number): string[] {
  const allPoints = topic.learningObjectives;
  const start = sectionIndex * 2;
  return allPoints.slice(start, start + 3).length > 0
    ? allPoints.slice(start, start + 3)
    : [`Key concept ${sectionIndex + 1} of ${topic.title}`, `Connects to ${topic.keyConcepts.join(', ')}`, `Practice makes progress!`];
}

function generateWorkedExamples(topic: GeneratedTopic): WorkedExample[] {
  const examples: WorkedExample[] = [];

  topic.sampleProblems.forEach((problem, i) => {
    examples.push({
      title: `Example ${i + 1}`,
      problem,
      steps: generateSolutionSteps(problem, topic.subject),
      solution: `The answer follows from applying the concepts of ${topic.title.toLowerCase()}.`,
      checkUnderstanding: `Can you explain why this solution works? Try changing one number and solving again.`,
    });
  });

  if (examples.length === 0) {
    examples.push({
      title: 'Guided Example',
      problem: `Apply ${topic.title.toLowerCase()} to solve a real-world problem.`,
      steps: [
        'Read the problem carefully and identify what is being asked',
        'List the information you know',
        'Choose the right strategy or formula',
        'Work through the solution step by step',
        'Check your answer makes sense',
      ],
      solution: 'The solution demonstrates the application of key concepts from this topic.',
      checkUnderstanding: 'Try creating your own problem using the same concepts.',
    });
  }

  return examples;
}

function generateSolutionSteps(problem: string, subject: string): string[] {
  const stepTemplates: Record<string, string[]> = {
    math: [
      'Identify what the problem is asking',
      'List the known values and what you need to find',
      'Choose the appropriate formula or strategy',
      'Substitute values and solve step by step',
      'Check your answer by working backwards',
    ],
    science: [
      'Identify the scientific principle involved',
      'List the variables and their relationships',
      'Apply the relevant formula or concept',
      'Calculate or explain the result',
      'Connect back to the real-world context',
    ],
    english: [
      'Read the text carefully',
      'Identify the key literary device or technique',
      'Find evidence from the text to support your analysis',
      'Explain how the evidence connects to the meaning',
      'Connect to the broader theme or context',
    ],
  };

  return stepTemplates[subject] || stepTemplates.math;
}

function generateMisconceptions(topic: GeneratedTopic): string[] {
  const misconceptionMap: Record<string, string[]> = {
    math: [
      'Multiplication always makes numbers bigger (not true with fractions!)',
      'The equal sign means "the answer comes next" (it means "is the same as")',
      'Bigger denominator means bigger fraction (actually the opposite)',
      'Negative numbers are "less than nothing" (they represent direction and position)',
    ],
    science: [
      'Heavier objects fall faster (gravity accelerates all objects equally)',
      'Plants get their mass from soil (most comes from air and water)',
      'Evolution means individuals change during their lifetime (populations evolve over generations)',
      'Chemical reactions destroy matter (matter is conserved, just rearranged)',
    ],
    english: [
      'Longer essays are always better (quality matters more than quantity)',
      'There is only one correct interpretation of a text (multiple valid readings exist)',
      'Vocabulary words should be memorized in isolation (context is key)',
      'Good writers get it right the first time (revision is essential)',
    ],
  };

  const misconceptions = misconceptionMap[topic.subject] || misconceptionMap.math;
  return misconceptions.slice(0, 3);
}

function generateSummary(topic: GeneratedTopic): string {
  return `In this topic, you explored ${topic.title.toLowerCase()}. You learned to ${topic.learningObjectives[0]?.toLowerCase() || 'understand key concepts'}, and connected this to ${topic.keyConcepts.join(' and ').toLowerCase()}. Remember: mastery comes through practice, reflection, and making connections to the world around you.`;
}
