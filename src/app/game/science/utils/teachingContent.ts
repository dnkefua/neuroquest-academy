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

// Topic-specific teaching content generators
const TOPIC_PANELS: Record<string, TeachingPanel[]> = {
  'The Water Cycle': [
    {
      character: 'All Cloud Spirits',
      color: '#A78BFA',
      emoji: '🌀',
      title: 'We are the CLOUD SPIRITS — Guardians of Water!',
      content: 'Water never disappears. It travels in an endless loop!\nWe call it... THE WATER CYCLE 🌀\n\nIt has four stages: Evaporation, Condensation,\nPrecipitation, and Collection.\n\nLearn them all... and we set you FREE! 🗝️',
      visual: 'topic-diagram',
      highlightStage: 'all',
    },
    {
      character: 'Evie Evaporation',
      color: '#F59E0B',
      emoji: '☀️',
      title: 'I am EVAPORATION! Heat is my superpower!',
      content: 'The SUN heats water in oceans, rivers, and lakes.\nThe water turns into WATER VAPOR — an invisible gas!\nIt rises HIGH into the sky to find the clouds. ⬆️\n\nHeat makes water molecules move faster\nuntil they escape into the air!',
      visual: 'concept',
      highlightStage: 'evaporation',
    },
    {
      character: 'Coco Condensation',
      color: '#93C5FD',
      emoji: '☁️',
      title: 'I am CONDENSATION! I turn invisible into visible!',
      content: 'High in the sky, the air is very COLD.\nCold air cannot hold as much water vapor.\nSo the vapor COOLS DOWN and turns back into tiny droplets.\nThose droplets cluster together to form CLOUDS! ☁️',
      visual: 'concept',
      highlightStage: 'condensation',
    },
    {
      character: 'Petra Precipitation',
      color: '#3B82F6',
      emoji: '🌧️',
      title: 'I am PRECIPITATION! I am the Giver of Water!',
      content: 'When clouds collect TOO MUCH water, they release it!\nIt falls to Earth as RAIN, SNOW, SLEET, or HAIL.\n\nWater droplets merge until they\'re too heavy to float!\nGravity pulls them down to the ground below.',
      visual: 'concept',
      highlightStage: 'precipitation',
    },
    {
      character: 'Colly Collection',
      color: '#14B8A6',
      emoji: '💧',
      title: 'I am COLLECTION! I am patient. I wait below.',
      content: 'Water collects in rivers, lakes, and OCEANS.\nSome soaks INTO the ground — we call it GROUNDWATER.\nAll rivers eventually flow back to the sea.\n\nThen the Sun heats the ocean water again...\nand the cycle REPEATS FOREVER! ♾️',
      visual: 'concept',
      highlightStage: 'collection',
    },
    {
      character: 'All Cloud Spirits',
      color: '#A78BFA',
      emoji: '🌊',
      title: 'THE COMPLETE WATER CYCLE — Now you know it all!',
      content: '☀️ EVAPORATION  → water vapor rises from surfaces\n☁️ CONDENSATION → vapor cools, forms clouds\n🌧️ PRECIPITATION → water falls as rain or snow\n💧 COLLECTION   → water gathers in rivers & oceans\n         ↑____________________________|\n              (repeats forever!)\n\n"Answer our 5 questions... and we free you! 🗝️"',
      visual: 'topic-diagram',
      highlightStage: 'all',
    },
  ],
};

// Generate panels for any quest based on its content
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

  // Generate dynamic panels from quest content
  return generateDynamicPanels(quest);
}

function generateDynamicPanels(quest: GameQuest): TeachingPanel[] {
  const panels: TeachingPanel[] = [];

  // Introduction panel
  panels.push({
    character: quest.teacherName,
    color: getSubjectColor(quest.subject),
    emoji: quest.teacherEmoji,
    title: `Welcome to ${quest.title}!`,
    content: `${quest.briefingDescription}\n\nYou are about to embark on a journey through ${quest.locationName}.\n\nYour guide, ${quest.teacherName}, will help you master the concepts!\n\nAre you ready to begin? ${quest.emoji}`,
    visual: 'topic-diagram',
    highlightStage: 'introduction',
  });

  // Generate concept panels from questions
  const concepts = extractConceptsFromQuestions(quest.questions);
  concepts.slice(0, 3).forEach((concept, i) => {
    panels.push({
      character: quest.teacherName,
      color: getSubjectColor(quest.subject),
      emoji: getConceptEmoji(concept.type),
      title: concept.title,
      content: concept.explanation,
      visual: 'concept',
      highlightStage: `concept-${i + 1}`,
    });
  });

  // Summary panel
  panels.push({
    character: quest.teacherName,
    color: getSubjectColor(quest.subject),
    emoji: '🎓',
    title: `${quest.title} — Ready to Test Your Knowledge!`,
    content: `You've learned the key concepts of ${quest.title}!\n\nNow it's time to prove your mastery.\n\nAnswer the questions correctly to complete your quest!\n\nGood luck, brave scholar! ${quest.emoji}`,
    visual: 'summary',
    highlightStage: 'all',
  });

  return panels;
}

function extractConceptsFromQuestions(questions: GameQuest['questions']): Array<{ title: string; explanation: string; type: string }> {
  const concepts: Array<{ title: string; explanation: string; type: string }> = [];

  // Group questions by concept type
  const seenTypes = new Set<string>();

  questions.forEach((q) => {
    // Extract concept type from the question
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

  return 'concept';
}

function getConceptEmoji(type: string): string {
  const emojis: Record<string, string> = {
    cells: '🔬',
    atoms: '⚛️',
    forces: '⚡',
    electricity: '🔌',
    waves: '🌊',
    ecosystem: '🌿',
    photosynthesis: '🌱',
    chemical: '⚗️',
    body: '❤️',
    concept: '💡',
  };
  return emojis[type] || '📚';
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
      title: 'Welcome to your Science Quest!',
      content: 'Prepare to explore fascinating concepts\nand test your knowledge!\n\nPay close attention to the lesson,\nthen answer questions to prove your mastery!\n\nLet\'s begin! 🎓',
      visual: 'topic-diagram',
      highlightStage: 'introduction',
    },
    {
      character: 'Science Guide',
      color: '#0EA5E9',
      emoji: '🎓',
      title: 'Ready to Test Your Knowledge!',
      content: 'You\'ve learned the key concepts!\n\nNow it\'s time to prove your mastery.\n\nAnswer the questions correctly to complete your quest!\n\nGood luck! 🔬',
      visual: 'summary',
      highlightStage: 'all',
    },
  ];
}