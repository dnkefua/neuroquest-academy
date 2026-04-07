'use client';
import type { GeneratedTopic } from './topic-generator';

export interface GameDesignSpec {
  topicId: string;
  title: string;
  genre: 'puzzle' | 'adventure' | 'simulation' | 'quiz' | 'platformer' | 'strategy';
  narrative: string;
  mechanics: GameMechanic[];
  levels: GameLevel[];
  rewards: GameReward[];
  learningOutcomes: string[];
  estimatedPlayTime: number;
  componentType: string;
}

export interface GameMechanic {
  name: string;
  description: string;
  learningConnection: string;
}

export interface GameLevel {
  id: string;
  title: string;
  objective: string;
  challenges: string[];
  hints: string[];
  bossChallenge?: string;
}

export interface GameReward {
  type: 'xp' | 'coins' | 'badge' | 'unlock' | 'power-up';
  name: string;
  condition: string;
}

export function generateGameDesign(topic: GeneratedTopic): GameDesignSpec {
  const template = GAME_TEMPLATES[topic.subject]?.[topic.grade];
  if (template) {
    const defaultSpec = generateDefaultGameDesign(topic);
    return {
      ...defaultSpec,
      topicId: topic.id,
      title: `${topic.title} Quest`,
      genre: template.genre,
      narrative: template.narrative,
      mechanics: template.mechanics,
      rewards: template.rewards,
      estimatedPlayTime: template.estimatedPlayTime,
      componentType: template.componentType,
      learningOutcomes: topic.learningObjectives,
    };
  }

  return generateDefaultGameDesign(topic);
}

function generateDefaultGameDesign(topic: GeneratedTopic): GameDesignSpec {
  const genreMap: Record<string, GameDesignSpec['genre']> = {
    math: 'puzzle',
    science: 'simulation',
    english: 'adventure',
    'social-studies': 'strategy',
    'social-skills': 'adventure',
    'emotional-regulation': 'simulation',
  };

  const genre = genreMap[topic.subject] || 'quiz';

  return {
    topicId: topic.id,
    title: `${topic.title} Quest`,
    genre,
    narrative: generateNarrative(topic, genre),
    mechanics: generateMechanics(topic, genre),
    levels: generateLevels(topic, genre),
    rewards: generateRewards(topic),
    learningOutcomes: topic.learningObjectives,
    estimatedPlayTime: topic.estimatedMinutes + 5,
    componentType: getGameComponentType(topic, genre),
  };
}

function generateNarrative(topic: GeneratedTopic, genre: string): string {
  const narratives: Record<string, string> = {
    puzzle: `A mysterious puzzle box has appeared in the realm, and only by mastering ${topic.title.toLowerCase()} can you unlock its secrets and claim the treasure within.`,
    adventure: `Your quest takes you through the Land of ${topic.title}, where ancient knowledge is hidden behind challenges that test your understanding.`,
    simulation: `Step into the virtual laboratory where you can experiment with ${topic.title.toLowerCase()} in a safe, interactive environment.`,
    quiz: `The Grand Tournament of Knowledge has begun! Compete against challenges based on ${topic.title.toLowerCase()} to earn glory and rewards.`,
    platformer: `Navigate through the world of ${topic.title}, jumping over obstacles and collecting knowledge orbs as you master each concept.`,
    strategy: `As the ruler of a growing kingdom, you must apply ${topic.title.toLowerCase()} to make wise decisions that ensure your people's prosperity.`,
  };
  return narratives[genre] || narratives.quiz;
}

function generateMechanics(topic: GeneratedTopic, genre: string): GameMechanic[] {
  const mechanicSets: Record<string, GameMechanic[]> = {
    puzzle: [
      { name: 'Pattern Matching', description: 'Identify and complete patterns to progress.', learningConnection: 'Recognizing mathematical patterns and relationships.' },
      { name: 'Logic Gates', description: 'Solve logic puzzles to unlock new areas.', learningConnection: 'Developing logical reasoning and problem-solving skills.' },
      { name: 'Time Challenge', description: 'Solve problems within a time limit for bonus rewards.', learningConnection: 'Building fluency and automaticity.' },
    ],
    adventure: [
      { name: 'Dialogue Choices', description: 'Choose responses that demonstrate understanding.', learningConnection: 'Applying knowledge in contextual scenarios.' },
      { name: 'Item Collection', description: 'Collect knowledge items to unlock new abilities.', learningConnection: 'Building a foundation of key concepts.' },
      { name: 'Puzzle Doors', description: 'Solve topic-related puzzles to open doors.', learningConnection: 'Applying concepts to overcome obstacles.' },
    ],
    simulation: [
      { name: 'Variable Manipulation', description: 'Adjust variables and observe outcomes.', learningConnection: 'Understanding cause and effect relationships.' },
      { name: 'Hypothesis Testing', description: 'Make predictions and test them.', learningConnection: 'Developing scientific thinking skills.' },
      { name: 'Data Collection', description: 'Gather and analyze data from experiments.', learningConnection: 'Building data literacy and analytical skills.' },
    ],
    quiz: [
      { name: 'Timed Questions', description: 'Answer questions correctly and quickly.', learningConnection: 'Building knowledge recall speed.' },
      { name: 'Streak Bonus', description: 'Consecutive correct answers earn multipliers.', learningConnection: 'Encouraging consistent accuracy.' },
      { name: 'Lifelines', description: 'Use hints and eliminations strategically.', learningConnection: 'Learning to use resources effectively.' },
    ],
    platformer: [
      { name: 'Knowledge Platforms', description: 'Answer correctly to create platforms.', learningConnection: 'Connecting knowledge to progress.' },
      { name: 'Power-Up Questions', description: 'Collect power-ups by answering bonus questions.', learningConnection: 'Reinforcing key concepts through repetition.' },
      { name: 'Boss Battles', description: 'Defeat bosses by solving complex problems.', learningConnection: 'Applying multiple concepts together.' },
    ],
    strategy: [
      { name: 'Resource Management', description: 'Allocate resources based on topic knowledge.', learningConnection: 'Applying concepts to decision-making.' },
      { name: 'Event Cards', description: 'Draw cards that present topic-related scenarios.', learningConnection: 'Connecting knowledge to real-world situations.' },
      { name: 'Alliance Building', description: 'Form alliances by demonstrating expertise.', learningConnection: 'Collaborative learning and peer teaching.' },
    ],
  };

  return mechanicSets[genre] || mechanicSets.quiz;
}

function generateLevels(topic: GeneratedTopic, genre: string): GameLevel[] {
  const numLevels = Math.min(3 + Math.floor(topic.grade / 3), 5);
  const levels: GameLevel[] = [];

  for (let i = 0; i < numLevels; i++) {
    const isBoss = i === numLevels - 1;
    levels.push({
      id: `level-${i + 1}`,
      title: isBoss ? `Boss: ${topic.title} Master` : `Stage ${i + 1}: ${topic.unit}`,
      objective: isBoss
        ? `Demonstrate mastery of ${topic.title.toLowerCase()} by solving the ultimate challenge.`
        : `Complete challenges related to ${topic.title.toLowerCase()}.`,
      challenges: generateChallenges(topic, i, isBoss),
      hints: topic.sampleProblems.slice(0, 2),
      bossChallenge: isBoss ? `Solve a multi-step problem combining all concepts from ${topic.title.toLowerCase()}.` : undefined,
    });
  }

  return levels;
}

function generateChallenges(topic: GeneratedTopic, levelIndex: number, isBoss: boolean): string[] {
  const baseChallenges = [
    `Identify the key concept of ${topic.title.toLowerCase()}.`,
    `Apply ${topic.title.toLowerCase()} to solve a basic problem.`,
    `Explain why the solution works.`,
  ];

  if (isBoss) {
    return [
      ...baseChallenges,
      `Solve a complex, multi-step problem.`,
      `Connect ${topic.title.toLowerCase()} to a real-world scenario.`,
      `Teach the concept to a virtual student.`,
    ];
  }

  return baseChallenges.slice(0, 2 + levelIndex);
}

function generateRewards(topic: GeneratedTopic): GameReward[] {
  const baseXP = 50 + topic.grade * 20;
  const baseCoins = 30 + topic.grade * 15;

  return [
    { type: 'xp', name: `${topic.title} XP`, condition: 'Complete all levels' },
    { type: 'coins', name: `${baseCoins} Coins`, condition: 'Complete all levels' },
    { type: 'badge', name: `${topic.unit} Badge`, condition: 'Achieve 80% or higher' },
    { type: 'power-up', name: 'Focus Boost', condition: 'Complete without hints' },
    { type: 'unlock', name: 'Next Topic', condition: 'Complete the boss challenge' },
  ];
}

function getGameComponentType(topic: GeneratedTopic, genre: string): string {
  const typeMap: Record<string, string> = {
    math: 'MathQuestGame',
    science: 'ScienceSimGame',
    english: 'LiteraryAdventure',
    'social-studies': 'StrategyGame',
    'social-skills': 'SocialScenarioGame',
    'emotional-regulation': 'MindfulnessGame',
  };
  return typeMap[topic.subject] || 'QuizGame';
}

const GAME_TEMPLATES: Record<string, Record<number, Omit<GameDesignSpec, 'topicId' | 'title' | 'levels' | 'learningOutcomes'>>> = {
  math: {
    1: {
      genre: 'puzzle',
      narrative: 'Help Zara the Fairy count and collect magical gems by solving number puzzles!',
      mechanics: [
        { name: 'Counting Challenge', description: 'Count objects to collect gems.', learningConnection: 'Developing number sense.' },
        { name: 'Match Pairs', description: 'Match numbers to quantities.', learningConnection: 'Connecting numerals to quantities.' },
      ],
      rewards: [
        { type: 'xp', name: 'Number Explorer XP', condition: 'Complete all stages' },
        { type: 'coins', name: '20 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Counting Champion', condition: 'Score 90%+' },
      ],
      estimatedPlayTime: 15,
      componentType: 'MathQuestGame',
    },
    3: {
      genre: 'puzzle',
      narrative: 'Build bridges across the Multiplication River by solving multiplication puzzles!',
      mechanics: [
        { name: 'Equal Groups', description: 'Create equal groups to build bridge sections.', learningConnection: 'Understanding multiplication as equal groups.' },
        { name: 'Array Builder', description: 'Arrange objects in arrays to unlock paths.', learningConnection: 'Visualizing multiplication.' },
      ],
      rewards: [
        { type: 'xp', name: 'Multiplication Master XP', condition: 'Complete all stages' },
        { type: 'coins', name: '60 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Bridge Builder', condition: 'Score 85%+' },
      ],
      estimatedPlayTime: 20,
      componentType: 'MathQuestGame',
    },
    6: {
      genre: 'puzzle',
      narrative: 'Navigate the Algebra Dungeon by solving equations to unlock doors!',
      mechanics: [
        { name: 'Equation Solver', description: 'Solve for x to unlock doors.', learningConnection: 'Developing algebraic thinking.' },
        { name: 'Pattern Detective', description: 'Find the rule in number patterns.', learningConnection: 'Recognizing patterns and sequences.' },
      ],
      rewards: [
        { type: 'xp', name: 'Algebra Explorer XP', condition: 'Complete all stages' },
        { type: 'coins', name: '100 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Equation Cracker', condition: 'Score 80%+' },
      ],
      estimatedPlayTime: 25,
      componentType: 'MathQuestGame',
    },
  },
  science: {
    1: {
      genre: 'simulation',
      narrative: 'Explore the Garden of Life and discover what plants and animals need to thrive!',
      mechanics: [
        { name: 'Garden Simulator', description: 'Give plants what they need to grow.', learningConnection: 'Understanding basic needs of living things.' },
        { name: 'Animal Sorter', description: 'Sort animals by their features.', learningConnection: 'Classification and observation skills.' },
      ],
      rewards: [
        { type: 'xp', name: 'Nature Explorer XP', condition: 'Complete all stages' },
        { type: 'coins', name: '20 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Garden Guardian', condition: 'Score 90%+' },
      ],
      estimatedPlayTime: 15,
      componentType: 'ScienceSimGame',
    },
    7: {
      genre: 'simulation',
      narrative: 'Shrink down to microscopic size and explore the amazing world inside a cell!',
      mechanics: [
        { name: 'Cell Explorer', description: 'Navigate through a 3D cell model.', learningConnection: 'Understanding cell structure and function.' },
        { name: 'Organelle Match', description: 'Match organelles to their functions.', learningConnection: 'Connecting structure to function.' },
      ],
      rewards: [
        { type: 'xp', name: 'Cell Biologist XP', condition: 'Complete all stages' },
        { type: 'coins', name: '100 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Micro Explorer', condition: 'Score 85%+' },
      ],
      estimatedPlayTime: 20,
      componentType: 'ScienceSimGame',
    },
  },
  english: {
    5: {
      genre: 'adventure',
      narrative: 'Journey through the Story Kingdom and help characters tell their tales!',
      mechanics: [
        { name: 'Story Builder', description: 'Arrange events to create a coherent story.', learningConnection: 'Understanding narrative structure.' },
        { name: 'Word Wizard', description: 'Choose the best words to enhance descriptions.', learningConnection: 'Expanding vocabulary and descriptive writing.' },
      ],
      rewards: [
        { type: 'xp', name: 'Storyteller XP', condition: 'Complete all stages' },
        { type: 'coins', name: '80 Coins', condition: 'Complete all stages' },
        { type: 'badge', name: 'Master Storyteller', condition: 'Score 85%+' },
      ],
      estimatedPlayTime: 20,
      componentType: 'LiteraryAdventure',
    },
  },
};
