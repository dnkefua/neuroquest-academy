'use client';

import { useSocialSkillsStore } from './store/gameStore';
import QuestMapScene from './scenes/QuestMapScene';
import MissionBriefing from './scenes/MissionBriefing';
import QuizScene from './scenes/QuizScene';
import VictoryScene from './scenes/VictoryScene';

interface GameAppProps {
  grade: number;
}

export default function GameApp({ grade }: GameAppProps) {
  const { scene } = useSocialSkillsStore();

  switch (scene) {
    case 'QUEST_MAP':
      return <QuestMapScene grade={grade} />;
    case 'MISSION_BRIEFING':
      return <MissionBriefing />;
    case 'QUIZ':
      return <QuizScene />;
    case 'VICTORY':
      return <VictoryScene />;
    default:
      return <QuestMapScene grade={grade} />;
  }
}