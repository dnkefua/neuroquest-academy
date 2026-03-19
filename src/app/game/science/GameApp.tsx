'use client';
import { useEffect, useState } from 'react';
import { useScienceStore } from './store/gameStore';
import ScienceMissionBriefing from './scenes/MissionBriefing';
import CloudSpiritTeaching    from './scenes/CloudSpiritTeaching';
import ScienceQuizScene       from './scenes/QuizScene';
import ScienceVictoryScene    from './scenes/VictoryScene';

const SCENES = {
  MISSION_BRIEFING: ScienceMissionBriefing,
  CLOUD_TEACHING:   CloudSpiritTeaching,
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
