import type { GameQuest } from '@/lib/questData';

export interface TeachingPanel {
  character: string;
  color: string;
  emoji: string;
  title: string;
  content: string;
  visual: 'topic-diagram' | 'concept' | 'example' | 'summary' | null;
  highlightStage?: string;
}

// Topic-specific teaching content generators - SHORTENED for quick intro
const TOPIC_PANELS: Record<string, TeachingPanel[]> = {
  'The Water Cycle': [
    {
      character: 'Cloud Spirits',
      color: '#A78BFA',
      emoji: '🌀',
      title: 'The Water Cycle',
      content: 'Water travels in an endless loop:\n\n☀️ EVAPORATION → water rises as vapor\n☁️ CONDENSATION → vapor forms clouds\n🌧️ PRECIPITATION → rain falls\n💧 COLLECTION → water gathers in oceans\n\nThen it repeats! 🔄',
      visual: 'topic-diagram',
      highlightStage: 'all',
    },
  ],
};

// Generate panels for any quest based on its content - SHORTENED
export function generateTeachingPanels(quest: GameQuest | null): TeachingPanel[] {
  if (!quest) {
    return getDefaultPanels();
  }

  const topic = quest.title.toLowerCase();

  // Check for topic-specific panels
  for (const [key, panels] of Object.entries(TOPIC_PANELS)) {
    if (topic.includes(key.toLowerCase()) || key.toLowerCase().includes(topic)) {
      return panels;
    }
  }

  // Generate dynamic panels from quest content - MAX 2 panels
  return generateDynamicPanels(quest);
}

function generateDynamicPanels(quest: GameQuest): TeachingPanel[] {
  const panels: TeachingPanel[] = [];

  // Introduction panel with visual
  panels.push({
    character: quest.teacherName,
    color: getSubjectColor(quest.subject),
    emoji: quest.teacherEmoji,
    title: quest.title,
    content: quest.briefingDescription.slice(0, 150) + (quest.briefingDescription.length > 150 ? '...' : ''),
    visual: 'topic-diagram',
    highlightStage: 'introduction',
  });

  // One concept panel from first question clue
  if (quest.questions.length > 0 && quest.questions[0].clue) {
    panels.push({
      character: quest.teacherName,
      color: getSubjectColor(quest.subject),
      emoji: quest.teacherEmoji,
      title: quest.questions[0].clue.title,
      content: quest.questions[0].clue.example.slice(0, 200),
      visual: 'concept',
      highlightStage: 'concept',
    });
  }

  return panels;
}

function extractConceptsFromQuestions(questions: GameQuest['questions']): Array<{ title: string; explanation: string; type: string }> {
  const concepts: Array<{ title: string; explanation: string; type: string }> = [];
  const seenTypes = new Set<string>();

  questions.forEach((q) => {
    const type = detectConceptType(q.question, q.narrative);
    if (!seenTypes.has(type)) {
      seenTypes.add(type);
      concepts.push({
        title: q.clue?.title || `Understanding ${type}`,
        explanation: q.clue?.example || q.narrative || '',
        type,
      });
    }
  });

  return concepts;
}

function detectConceptType(question: string, narrative: string): string {
  const text = `${question} ${narrative}`.toLowerCase();

  if (text.includes('cell') || text.includes('organelle') || text.includes('nucleus')) return 'cells';
  if (text.includes('atom') || text.includes('electron') || text.includes('proton')) return 'atoms';
  if (text.includes('force') || text.includes('motion') || text.includes('newton')) return 'forces';
  if (text.includes('circuit') || text.includes('current') || text.includes('voltage')) return 'electricity';
  if (text.includes('wave') || text.includes('frequency') || text.includes('sound')) return 'waves';
  if (text.includes('ecosystem') || text.includes('food') || text.includes('chain')) return 'ecosystem';
  if (text.includes('photosynthesis') || text.includes('plant') || text.includes('chlorophyll')) return 'photosynthesis';
  if (text.includes('chemical') || text.includes('reaction') || text.includes('bond')) return 'chemical';
  if (text.includes('body') || text.includes('organ') || text.includes('system')) return 'body';
  if (text.includes('matter') || text.includes('solid') || text.includes('liquid') || text.includes('gas')) return 'matter';

  return 'concept';
}

function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    science: '#0EA5E9',
    math: '#8B5CF6',
    english: '#F59E0B',
    social: '#F97316',
    socialSkills: '#EC4899',
  };
  return colors[subject] || '#0EA5E9';
}

function getDefaultPanels(): TeachingPanel[] {
  return [
    {
      character: 'Science Guide',
      color: '#0EA5E9',
      emoji: '🔬',
      title: 'Science Quest',
      content: 'Explore the concepts and answer questions to master this topic!',
      visual: 'topic-diagram',
      highlightStage: 'introduction',
    },
  ];
}