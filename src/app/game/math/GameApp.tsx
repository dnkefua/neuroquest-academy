'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import QuestMapScene      from './scenes/QuestMapScene';
import ClassroomScene     from './scenes/ClassroomScene';
import MissionBriefing    from './scenes/MissionBriefing';
import PirateEncounter    from './scenes/PirateEncounter';
import QuizScene          from './scenes/QuizScene';
import VictoryScene       from './scenes/VictoryScene';

const SCENES = {
  QUEST_MAP:        QuestMapScene,
  CLASSROOM:        ClassroomScene,
  MISSION_BRIEFING: MissionBriefing,
  PIRATE_ENCOUNTER: PirateEncounter,
  QUIZ:             QuizScene,
  VICTORY:          VictoryScene,
} as const;

export default function GameApp() {
  const scene = useGameStore(s => s.scene);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div style={{ background: '#0f0c29', width: '100vw', height: '100vh' }} />;
  }

  const Scene = SCENES[scene];
  return <Scene />;
}
