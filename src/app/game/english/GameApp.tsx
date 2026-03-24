'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEnglishStore, hasQuestsForGrade } from './store/gameStore';
import { useProgressStore } from '@/store/progressStore';
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
  const urlGrade = searchParams.get('grade');
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

  // Check if quests available
  if (!hasQuestsForGrade(grade)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <span className="text-8xl mb-6 block">📖</span>
          <h1 className="font-black text-white text-3xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Coming Soon
          </h1>
          <p className="text-gray-300 mb-6">
            Grade {grade} English quests are being prepared!
          </p>
          <button
            onClick={() => router.push('/world-map')}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: '#F59E0B' }}>
            ← Back to World Map
          </button>
        </motion.div>
      </div>
    );
  }

  // Render appropriate scene
  switch (scene) {
    case 'QUEST_MAP':
      return <QuestMapScene />;
    case 'MISSION_BRIEFING':
      return <MissionBriefing />;
    case 'QUIZ':
      return <QuizScene />;
    case 'VICTORY':
      return <VictoryScene />;
    default:
      return <QuestMapScene />;
  }
}