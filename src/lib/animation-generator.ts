'use client';
import type { GeneratedTopic } from './topic-generator';

export interface AnimationSpec {
  topicId: string;
  title: string;
  type: 'concept' | 'process' | 'simulation' | 'visualization';
  duration: number;
  scenes: AnimationScene[];
  interactiveElements: InteractiveElement[];
  componentType: string;
}

export interface AnimationScene {
  id: string;
  title: string;
  description: string;
  duration: number;
  elements: string[];
  transitions: string[];
}

export interface InteractiveElement {
  type: 'drag-drop' | 'slider' | 'click-reveal' | 'draw' | 'sort';
  prompt: string;
  feedback: string;
}

export function generateAnimationSpec(topic: GeneratedTopic): AnimationSpec {
  const spec = ANIMATION_TEMPLATES[topic.subject]?.[topic.grade];
  if (spec) {
    const defaultSpec = generateDefaultAnimation(topic);
    return {
      ...defaultSpec,
      topicId: topic.id,
      title: topic.title,
      type: spec.type,
      duration: spec.duration,
      interactiveElements: spec.interactiveElements,
      componentType: spec.componentType,
    };
  }

  return generateDefaultAnimation(topic);
}

function generateDefaultAnimation(topic: GeneratedTopic): AnimationSpec {
  const typeMap: Record<string, AnimationSpec['type']> = {
    math: 'visualization',
    science: 'simulation',
    english: 'concept',
    'social-studies': 'process',
    'social-skills': 'concept',
    'emotional-regulation': 'concept',
  };

  return {
    topicId: topic.id,
    title: topic.title,
    type: typeMap[topic.subject] || 'concept',
    duration: topic.estimatedMinutes,
    scenes: [
      {
        id: `${topic.id}-intro`,
        title: 'Introduction',
        description: `Introduce ${topic.title.toLowerCase()} with engaging visuals and a hook question.`,
        duration: Math.round(topic.estimatedMinutes * 0.2),
        elements: ['title card', 'hook question', 'key visual'],
        transitions: ['fade in', 'zoom'],
      },
      {
        id: `${topic.id}-explore`,
        title: 'Explore the Concept',
        description: `Interactive exploration of ${topic.title.toLowerCase()} with manipulatives and visual representations.`,
        duration: Math.round(topic.estimatedMinutes * 0.5),
        elements: ['interactive diagram', 'manipulatives', 'step-by-step reveal'],
        transitions: ['slide', 'morph'],
      },
      {
        id: `${topic.id}-apply`,
        title: 'Apply Your Knowledge',
        description: `Practice applying ${topic.title.toLowerCase()} to solve problems and answer questions.`,
        duration: Math.round(topic.estimatedMinutes * 0.3),
        elements: ['practice problems', 'feedback system', 'progress indicator'],
        transitions: ['fade', 'slide'],
      },
    ],
    interactiveElements: [
      {
        type: 'drag-drop',
        prompt: 'Drag elements to the correct positions to demonstrate your understanding.',
        feedback: 'Great job! You\'ve correctly arranged the components.',
      },
      {
        type: 'slider',
        prompt: 'Use the slider to explore how changing values affects the outcome.',
        feedback: 'Notice how the relationship changes as you adjust the values.',
      },
    ],
    componentType: getComponentType(topic),
  };
}

function getComponentType(topic: GeneratedTopic): string {
  const componentMap: Record<string, Record<string, string>> = {
    math: {
      'fraction': 'FractionVisualizer',
      'number': 'NumberLineAnimation',
      'geometry': 'ShapeExplorer',
      'graph': 'GraphPlotter',
      'area': 'AreaVisualizer',
      'volume': 'Volume3D',
      'algebra': 'EquationBalancer',
      'default': 'MathAnimation',
    },
    science: {
      'cell': 'CellExplorer',
      'water': 'WaterCycle3D',
      'circuit': 'CircuitBuilder',
      'force': 'PhysicsLab',
      'wave': 'WaveSimulator',
      'atom': 'AtomModel',
      'default': 'ScienceSimulation',
    },
    english: {
      'narrative': 'StoryArcDiagram',
      'poetry': 'PoetryAnalyzer',
      'character': 'CharacterMap',
      'theme': 'ThemeExplorer',
      'default': 'LiteraryAnimation',
    },
  };

  const subjectMap = componentMap[topic.subject] || componentMap.english;
  const lowerTitle = topic.title.toLowerCase();

  for (const [key, component] of Object.entries(subjectMap)) {
    if (key !== 'default' && lowerTitle.includes(key)) return component;
  }

  return subjectMap.default || 'ConceptAnimation';
}

const ANIMATION_TEMPLATES: Record<string, Record<number, Omit<AnimationSpec, 'topicId' | 'title' | 'scenes'>>> = {
  math: {
    1: {
      type: 'visualization',
      duration: 10,
      interactiveElements: [
        { type: 'drag-drop', prompt: 'Drag counters to show the number.', feedback: 'Perfect counting!' },
      ],
      componentType: 'NumberLineAnimation',
    },
    3: {
      type: 'visualization',
      duration: 15,
      interactiveElements: [
        { type: 'drag-drop', prompt: 'Group objects into equal sets.', feedback: 'Great grouping!' },
        { type: 'slider', prompt: 'Adjust the number of groups.', feedback: 'See how multiplication works!' },
      ],
      componentType: 'MathAnimation',
    },
    5: {
      type: 'visualization',
      duration: 15,
      interactiveElements: [
        { type: 'slider', prompt: 'Adjust the numerator and denominator.', feedback: 'Watch the fraction change!' },
      ],
      componentType: 'FractionVisualizer',
    },
    7: {
      type: 'visualization',
      duration: 15,
      interactiveElements: [
        { type: 'slider', prompt: 'Change the value of x and see the equation balance.', feedback: 'The equation stays balanced!' },
      ],
      componentType: 'EquationBalancer',
    },
    10: {
      type: 'visualization',
      duration: 20,
      interactiveElements: [
        { type: 'slider', prompt: 'Adjust coefficients and watch the parabola change.', feedback: 'See how each coefficient affects the shape!' },
      ],
      componentType: 'GraphPlotter',
    },
    12: {
      type: 'visualization',
      duration: 25,
      interactiveElements: [
        { type: 'slider', prompt: 'Change the point and see the tangent line update.', feedback: 'The derivative is the slope of the tangent!' },
      ],
      componentType: 'GraphPlotter',
    },
  },
  science: {
    1: {
      type: 'simulation',
      duration: 10,
      interactiveElements: [
        { type: 'click-reveal', prompt: 'Click on each part of the plant to learn what it does.', feedback: 'Each part has an important job!' },
      ],
      componentType: 'ScienceSimulation',
    },
    5: {
      type: 'simulation',
      duration: 15,
      interactiveElements: [
        { type: 'drag-drop', prompt: 'Sort changes into physical or chemical.', feedback: 'Great classification!' },
      ],
      componentType: 'ScienceSimulation',
    },
    7: {
      type: 'simulation',
      duration: 15,
      interactiveElements: [
        { type: 'click-reveal', prompt: 'Click on each organelle to discover its function.', feedback: 'Each organelle has a specific role!' },
      ],
      componentType: 'CellExplorer',
    },
    8: {
      type: 'simulation',
      duration: 15,
      interactiveElements: [
        { type: 'drag-drop', prompt: 'Build an atom by adding protons, neutrons, and electrons.', feedback: 'You\'ve built the correct atom!' },
      ],
      componentType: 'AtomModel',
    },
    10: {
      type: 'simulation',
      duration: 20,
      interactiveElements: [
        { type: 'slider', prompt: 'Adjust voltage and resistance to see current change.', feedback: 'Ohm\'s Law in action!' },
      ],
      componentType: 'CircuitBuilder',
    },
  },
  english: {
    5: {
      type: 'concept',
      duration: 10,
      interactiveElements: [
        { type: 'drag-drop', prompt: 'Arrange story events in the correct order.', feedback: 'Great story structure!' },
      ],
      componentType: 'StoryArcDiagram',
    },
    8: {
      type: 'concept',
      duration: 15,
      interactiveElements: [
        { type: 'click-reveal', prompt: 'Click on highlighted words to discover figurative language.', feedback: 'You found the literary device!' },
      ],
      componentType: 'LiteraryAnimation',
    },
    10: {
      type: 'concept',
      duration: 20,
      interactiveElements: [
        { type: 'click-reveal', prompt: 'Click on characters to explore their motivations and relationships.', feedback: 'Characters drive the story!' },
      ],
      componentType: 'CharacterMap',
    },
  },
};
