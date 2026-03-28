'use client';
import { useEffect, useState } from 'react';
import { useScienceStore } from './store/gameStore';
import QuestMapScene         from './scenes/QuestMapScene';
import ScienceMissionBriefing from './scenes/MissionBriefing';
import CloudSpiritTeaching    from './scenes/CloudSpiritTeaching';
import ScienceSimulationScene from './scenes/SimulationScene';
import ScienceQuizScene       from './scenes/QuizScene';
import ScienceVictoryScene    from './scenes/VictoryScene';

const SCENES = {
  QUEST_MAP:        QuestMapScene,
  MISSION_BRIEFING: ScienceMissionBriefing,
  CLOUD_TEACHING:   CloudSpiritTeaching,
  SIMULATION:       ScienceSimulationScene,
  QUIZ:             ScienceQuizScene,
  VICTORY:          ScienceVictoryScene,
} as const;

export default function ScienceGameApp() {
  const scene = useScienceStore(s => s.scene);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ background: '#0c1a2e', width: '100vw', height: '100vh' }} />;
  const Scene = SCENES[scene];
  return <Scene />;
}
