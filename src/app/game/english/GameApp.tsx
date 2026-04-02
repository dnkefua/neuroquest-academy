'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEnglishStore, hasQuestsForGrade } from './store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import ClassroomScene from './scenes/ClassroomScene';
import QuestMapScene from './scenes/QuestMapScene';
import MissionBriefing from './scenes/MissionBriefing';
import QuizScene from './scenes/QuizScene';
import VictoryScene from './scenes/VictoryScene';
import dynamic from 'next/dynamic';
import GameSkeleton from '../shared/components/GameSkeleton';

const WalletHUD = dynamic(() => import('@/components/ui/WalletHUD'), { ssr: false });

export default function EnglishGameApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const scene = useEnglishStore(s => s.scene);
  const currentGrade = useProgressStore(s => s.currentGrade);
  const setGrade = useEnglishStore(s => s.setGrade);

  // Read grade from URL or use user's grade
  const urlGrade = searchParams?.get('grade');
  const grade = urlGrade ? parseInt(urlGrade, 10) : currentGrade;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasQuestsForGrade(grade)) {
      setGrade(grade);
    }
  }, [mounted, grade, setGrade]);

  if (!mounted) {
    return <GameSkeleton />;
  }

  // Render appropriate scene - ClassroomScene is the entry point
  switch (scene) {
    case 'CLASSROOM':
      return <ClassroomScene />;
    case 'QUEST_MAP':
      return <QuestMapScene />;
    case 'MISSION_BRIEFING':
      return <MissionBriefing />;
    case 'QUIZ':
      return <QuizScene />;
    case 'VICTORY':
      return <VictoryScene />;
    default:
      return <ClassroomScene />;
  }
}