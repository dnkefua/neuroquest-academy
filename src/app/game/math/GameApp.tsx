'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import QuestMapScene      from './scenes/QuestMapScene';
import ClassroomScene     from './scenes/ClassroomScene';
import MissionBriefing    from './scenes/MissionBriefing';
import ConceptIntro       from './scenes/ConceptIntro';
import PirateEncounter    from './scenes/PirateEncounter';
import QuizScene          from './scenes/QuizScene';
import VictoryScene       from './scenes/VictoryScene';
import ReaderControls     from '../shared/ReaderControls';
import { gameTTS }        from '../shared/tts';

const SCENES = {
  QUEST_MAP:        QuestMapScene,
  CLASSROOM:        ClassroomScene,
  MISSION_BRIEFING: MissionBriefing,
  CONCEPT_INTRO:    ConceptIntro,
  PIRATE_ENCOUNTER: PirateEncounter,
  QUIZ:             QuizScene,
  VICTORY:          VictoryScene,
} as const;

export default function GameApp() {
  const scene = useGameStore(s => s.scene);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div style={{ background: '#0f0c29', width: '100vw', height: '100dvh' }} />;
  }

  const Scene = SCENES[scene];
  return (
    <div className="fixed inset-0 h-screen min-h-dvh w-screen overflow-hidden bg-[#0b1220]" onPointerDownCapture={() => gameTTS.prime()}>
      <div className="h-full w-full overflow-hidden [&>*]:!h-full">
        <Scene />
      </div>
      <ReaderControls accent="#8B5CF6" />
    </div>
  );
}
