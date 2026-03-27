'use client';

import WaterCycleDiagram from './WaterCycleDiagram';
import CellDiagram from './CellDiagram';
import AtomDiagram from './AtomDiagram';
import ElectricityDiagram from './ElectricityDiagram';
import HumanBodyDiagram from './HumanBodyDiagram';
import EcosystemDiagram from './EcosystemDiagram';
import ForcesDiagram from './ForcesDiagram';
import PhotosynthesisDiagram from './PhotosynthesisDiagram';
import WavesDiagram from './WavesDiagram';
import PeriodicDiagram from './PeriodicDiagram';
import StatesOfMatterDiagram from './StatesOfMatterDiagram';
import GenericDiagram from './GenericDiagram';

interface TopicVisualizerProps {
  questTitle: string;
  questionIndex?: number;
  highlightStage?: string;
}

// Map quest titles to visualizer components
const VISUALIZER_MAP: Record<string, React.ComponentType<{ highlightStage?: string }>> = {
  // Water Cycle (Grade 6)
  'The Water Cycle': WaterCycleDiagram,

  // Cells (Grade 7)
  'Cells & Life': CellDiagram,

  // Atoms & Elements (Grade 8)
  'Elements & Atoms': AtomDiagram,
  'Periodic Table & Reactivity': PeriodicDiagram,

  // Electricity (Grade 9)
  'Electricity': ElectricityDiagram,

  // Human Body (Grade 10)
  'Human Body': HumanBodyDiagram,

  // Ecosystems
  'Ecosystems & Food Chains': EcosystemDiagram,
  'The Ecosystem Web': EcosystemDiagram,
  'Ecology & Environment': EcosystemDiagram,

  // Forces
  'Forces & Motion': ForcesDiagram,
  'Speed, Velocity & Forces': ForcesDiagram,
  'The Forces and Motion Mystery': ForcesDiagram,
  "Newton's Laws": ForcesDiagram,

  // Photosynthesis
  'Photosynthesis & Respiration': PhotosynthesisDiagram,
  'The Seed Garden Mystery': PhotosynthesisDiagram,

  // Waves
  'Waves (Sound & Light)': WavesDiagram,

  // Chemistry
  'Chemical Reactions': AtomDiagram,
  'Chemical Bonding': AtomDiagram,
  'Chemical Reactions & Energy': AtomDiagram,
  'Organic Chemistry': AtomDiagram,

  // States of Matter (Grade 4)
  'The States of Matter Mystery': StatesOfMatterDiagram,

  // Genetics
  'Genetics & DNA': CellDiagram,
  'Reproduction & Evolution': CellDiagram,
  'Evolution & Natural Selection': CellDiagram,

  // Thermodynamics
  'Thermodynamics': ForcesDiagram,
};

export default function TopicVisualizer({ questTitle, highlightStage }: TopicVisualizerProps) {
  // Normalize title for matching
  const normalizedTitle = questTitle.toLowerCase();

  // Find matching visualizer
  let Visualizer: React.ComponentType<{ highlightStage?: string }> | null = null;

  // Try exact match first
  if (VISUALIZER_MAP[questTitle]) {
    Visualizer = VISUALIZER_MAP[questTitle];
  } else {
    // Try partial match
    for (const [key, component] of Object.entries(VISUALIZER_MAP)) {
      if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
        Visualizer = component;
        break;
      }
    }
  }

  // Fallback to generic diagram
  if (!Visualizer) {
    return <GenericDiagram topic={questTitle} />;
  }

  return <Visualizer highlightStage={highlightStage} />;
}

// Export for use in clue display
export function getVisualizerForQuest(questTitle: string): string {
  const normalizedTitle = questTitle.toLowerCase();

  if (normalizedTitle.includes('water cycle')) return 'water-cycle';
  if (normalizedTitle.includes('cell') || normalizedTitle.includes('genetic') || normalizedTitle.includes('dna') || normalizedTitle.includes('evolution')) return 'cell';
  if (normalizedTitle.includes('atom') || normalizedTitle.includes('element') || normalizedTitle.includes('periodic') || normalizedTitle.includes('chemical')) return 'atom';
  if (normalizedTitle.includes('electric')) return 'electricity';
  if (normalizedTitle.includes('body') || normalizedTitle.includes('human')) return 'body';
  if (normalizedTitle.includes('ecosystem') || normalizedTitle.includes('food')) return 'ecosystem';
  if (normalizedTitle.includes('force') || normalizedTitle.includes('motion') || normalizedTitle.includes('newton')) return 'forces';
  if (normalizedTitle.includes('photo') || normalizedTitle.includes('plant') || normalizedTitle.includes('seed')) return 'photosynthesis';
  if (normalizedTitle.includes('wave')) return 'waves';
  if (normalizedTitle.includes('matter') || normalizedTitle.includes('state')) return 'states-of-matter';
  if (normalizedTitle.includes('thermo')) return 'thermodynamics';

  return 'generic';
}