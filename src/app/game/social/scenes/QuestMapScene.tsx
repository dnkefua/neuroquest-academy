'use client';

import { motion } from 'framer-motion';
import { useSocialStore, getQuests, hasQuestsForGrade } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useRouter } from 'next/navigation';
import { gameAudio } from '../../shared/audio';
import { useEffect } from 'react';

interface QuestMapSceneProps {
  grade: number;
}

export default function QuestMapScene({ grade }: QuestMapSceneProps) {
  const { setGrade, setScene, currentQuestId } = useSocialStore();
  const { completedQuests } = useProgressStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasQuestsForGrade(grade)) {
      router.push('/world-map');
      return;
    }
    setGrade(grade);
  }, [grade, setGrade, router]);

  const quests = getQuests(grade);

  if (quests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1f1400 0%, #2d1f00 100%)' }}>
        <p className="text-white">Loading quests...</p>
      </div>
    );
  }

  const handleQuestSelect = (questId: string) => {
    gameAudio.playClick();
    useSocialStore.getState().loadQuest(questId, grade);
    setScene('MISSION_BRIEFING');
  };

  const handleBack = () => {
    gameAudio.playClick();
    router.push('/world-map');
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #1f1400 0%, #2d1f00 50%, #1a0f00 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <button onClick={handleBack}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all">
          ← Back
        </button>
        <span className="text-sm font-bold text-amber-300">🌍 Grade {grade} Social Studies</span>
        <div className="w-16" />
      </div>

      {/* Quest Map */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-lg mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-black text-white text-2xl text-center mb-6"
            style={{ fontFamily: 'Georgia, serif' }}>
            Choose Your Adventure
          </motion.h1>

          {quests.map((quest, index) => {
            const isCompleted = completedQuests.includes(quest.id);
            const isLocked = index > 0 && !completedQuests.includes(quests[index - 1].id);

            return (
              <motion.button
                key={quest.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isLocked && handleQuestSelect(quest.id)}
                disabled={isLocked}
                className="w-full p-4 rounded-2xl text-left transition-all relative overflow-hidden"
                style={{
                  background: isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${isCompleted ? '#22C55E' : isLocked ? 'rgba(255,255,255,0.05)' : quest.color}`,
                  opacity: isLocked ? 0.5 : 1,
                }}
                whileHover={isLocked ? {} : { scale: 1.02 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}>

                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-3xl">🔒</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="text-4xl">{quest.emoji}</div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{quest.title}</p>
                    <p className="text-sm text-gray-400">{quest.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: quest.color + '30', color: quest.color }}>
                        {quest.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{quest.questions.length} questions</span>
                    </div>
                  </div>
                  {isCompleted && <span className="text-2xl">✅</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}