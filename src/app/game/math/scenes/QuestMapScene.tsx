'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore, getQuestsForGrade, hasQuestsForGrade, type MathQuestLocal } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { gameTTS } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';

const LOCATION_ICONS: Record<MathQuestLocal['locationType'], string> = {
  hut: '🏚️', village: '🏘️', city: '🏙️', castle: '🏰', boss: '🦑',
};

// Grade display names
const GRADE_NAMES: Record<number, { programme: string; topic: string }> = {
  1: { programme: 'PYP', topic: 'Counting & Numbers' },
  2: { programme: 'PYP', topic: 'Place Value & Operations' },
  3: { programme: 'PYP', topic: 'Multiplication & Division' },
  4: { programme: 'PYP', topic: 'Decimals & Geometry' },
  5: { programme: 'PYP', topic: 'Fractions & Data' },
  6: { programme: 'MYP', topic: 'Positive & Negative Numbers' },
  7: { programme: 'MYP', topic: 'Fractions & Percents' },
  8: { programme: 'MYP', topic: 'Ratios & Geometry' },
  9: { programme: 'MYP', topic: 'Algebra & Pythagoras' },
  10: { programme: 'MYP', topic: 'Quadratic Equations' },
  11: { programme: 'DP', topic: 'Functions & Calculus' },
  12: { programme: 'DP', topic: 'Advanced Mathematics' },
};

export default function QuestMapScene() {
  const { loadQuest, currentQuestId, currentGrade, setGrade } = useGameStore();
  const { completedQuests } = useProgressStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Get grade from URL or use store's current grade
  const urlGrade = parseInt(searchParams.get('grade') || '6', 10);

  // Set grade from URL if different - use useEffect to avoid state update during render
  useEffect(() => {
    if (urlGrade && urlGrade !== currentGrade && hasQuestsForGrade(urlGrade)) {
      setGrade(urlGrade);
    }
  }, [urlGrade, currentGrade, setGrade]);

  // Get quests for current grade
  const quests = getQuestsForGrade(currentGrade);
  const gradeInfo = GRADE_NAMES[currentGrade] || { programme: 'IB', topic: 'Mathematics' };

  // A quest is unlocked if it's the first one, or the previous one is completed
  function isUnlocked(index: number) {
    if (index === 0) return true;
    return completedQuests.includes(quests[index - 1].id);
  }

  function isCompleted(questId: string) {
    return completedQuests.includes(questId);
  }

  function handleQuestClick(quest: MathQuestLocal, index: number) {
    if (!isUnlocked(index)) {
      gameTTS.speak('Complete the previous quest to unlock this one!');
      return;
    }
    gameAudio.playClick();
    gameTTS.stop();
    loadQuest(quest.id);
  }

  const completedCount = quests.filter(q => isCompleted(q.id)).length;

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)' }}>

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 2), height: 1 + (i % 2),
              left: `${(i * 17.3 + 7) % 100}%`, top: `${(i * 13.7 + 11) % 100}%`,
              opacity: 0.1 + (i % 5) * 0.08,
              animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 8) * 0.5}s infinite`,
            }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-lg flex items-center justify-between mb-6">
        <button onClick={() => router.push('/game/math')}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center gap-1">
          ← Back
        </button>
        <div className="text-center">
          <h1 className="font-black text-2xl text-white" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(139,92,246,0.6)' }}>
            ⚔️ Math Arena
          </h1>
          <p className="text-purple-300 text-xs mt-0.5">Grade {currentGrade} · {gradeInfo.programme} · {gradeInfo.topic}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTtsOn(gameTTS.toggle())}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base hover:scale-110 transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
            {ttsOn ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Progress summary */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg mb-6 px-5 py-3 rounded-2xl flex items-center gap-4"
        style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="text-2xl">🗺️</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Quest Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 rounded-full bg-white/10">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #14B8A6)' }}
                initial={{ width: 0 }}
                animate={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, delay: 0.3 }} />
            </div>
            <span className="text-purple-300 text-xs font-bold">{completedCount}/{quests.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Quest path */}
      <div className="relative z-10 w-full max-w-lg space-y-4">
        {quests.map((quest, index) => {
          const unlocked = isUnlocked(index);
          const completed = isCompleted(quest.id);
          const isCurrent = currentQuestId === quest.id;

          return (
            <div key={quest.id} className="relative">
              {/* Connector path line */}
              {index < quests.length - 1 && (
                <div className="absolute left-[52px] top-full w-0.5 h-4 z-0"
                  style={{ background: completed ? quest.color : 'rgba(255,255,255,0.1)' }} />
              )}

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
                onMouseEnter={() => setHoveredId(quest.id)}
                onMouseLeave={() => setHoveredId(null)}>

                <button
                  onClick={() => handleQuestClick(quest, index)}
                  disabled={!unlocked}
                  className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all"
                  style={{
                    background: completed
                      ? `linear-gradient(135deg, ${quest.color}18, rgba(0,0,0,0.3))`
                      : unlocked
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.02)',
                    border: `2px solid ${completed ? quest.color + '80' : unlocked ? quest.color + '40' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: hoveredId === quest.id && unlocked
                      ? `0 0 30px ${quest.glowColor}`
                      : completed ? `0 0 15px ${quest.glowColor}` : 'none',
                    opacity: unlocked ? 1 : 0.45,
                    transform: hoveredId === quest.id && unlocked ? 'scale(1.02)' : 'scale(1)',
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}>

                  {/* Location icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 relative"
                    style={{
                      background: unlocked ? `${quest.color}20` : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${unlocked ? quest.color + '50' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    {unlocked ? quest.emoji : '🔒'}
                    {completed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        style={{ background: '#00C851', border: '2px solid #000' }}>
                        ✓
                      </div>
                    )}
                    {quest.locationType === 'boss' && unlocked && !completed && (
                      <motion.div className="absolute -top-1 -right-1 text-xs"
                        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        ⚡
                      </motion.div>
                    )}
                  </div>

                  {/* Quest info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${quest.color}22`,
                          color: unlocked ? quest.color : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${quest.color}40`,
                        }}>
                        {quest.difficulty}
                      </span>
                      {completed && (
                        <span className="text-xs font-bold text-green-400">✅ Complete</span>
                      )}
                      {!unlocked && (
                        <span className="text-xs text-gray-500">🔒 Locked</span>
                      )}
                    </div>
                    <p className="font-black text-white text-base leading-tight"
                      style={{ color: unlocked ? 'white' : 'rgba(255,255,255,0.3)' }}>
                      {LOCATION_ICONS[quest.locationType]} {quest.title}
                    </p>
                    <p className="text-xs mt-0.5 truncate"
                      style={{ color: unlocked ? quest.color : 'rgba(255,255,255,0.2)' }}>
                      {quest.subtitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{quest.questions.length} questions</p>
                  </div>

                  {/* Arrow */}
                  {unlocked && (
                    <motion.div className="text-xl flex-shrink-0"
                      style={{ color: quest.color }}
                      animate={hoveredId === quest.id ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.6, repeat: Infinity }}>
                      {completed ? '🔄' : '→'}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* All done celebration */}
      {quests.length > 0 && completedCount === quests.length && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg mt-6 p-5 rounded-2xl text-center"
          style={{ background: 'rgba(255,215,0,0.12)', border: '2px solid rgba(255,215,0,0.5)' }}>
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-black text-yellow-400 text-lg">MATH ARENA CONQUERED!</p>
          <p className="text-yellow-300/70 text-sm mt-1">You've defeated the Number Kraken! A true Math Champion!</p>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
      `}</style>
    </div>
  );
}
