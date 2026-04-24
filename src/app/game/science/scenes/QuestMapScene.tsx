'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useScienceStore, getQuestsForGrade, hasQuestsForGrade } from '../store/gameStore';
import type { ScienceQuestLocal } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { gameTTS, useTTSCleanup } from '../../shared/tts';
import { gameAudio } from '../../shared/audio';
import { getProgrammeForGrade } from '@/lib/questData';

type LocationType = 'hut' | 'village' | 'city' | 'castle' | 'boss';

const LOCATION_ICONS: Record<LocationType, string> = {
  hut: '🏕️', village: '🏘️', city: '🏙️', castle: '🏛️', boss: '🌀',
};

export default function QuestMapScene() {
  const { loadQuest, currentQuestId, currentGrade, setGrade } = useScienceStore();
  const { completedQuests, approvedQuestIds } = useProgressStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  // Cleanup TTS on unmount
  useTTSCleanup();

  // Get grade from URL or use store's current grade
  const urlGrade = parseInt(searchParams?.get('grade') || '6', 10);

  // Set grade from URL inside useEffect to avoid calling state updates during render
  useEffect(() => {
    if (urlGrade && urlGrade !== currentGrade && hasQuestsForGrade(urlGrade)) {
      setGrade(urlGrade);
    }
  }, [urlGrade, currentGrade, setGrade]);

  // Use urlGrade directly so quests are correct on first render (no flash of grade 6)
  const activeGrade = hasQuestsForGrade(urlGrade) ? urlGrade : currentGrade;
  const quests = getQuestsForGrade(activeGrade);

  useEffect(() => {
    setPageIndex(0);
  }, [activeGrade]);

  useEffect(() => {
    const updatePageSize = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      if (height < 620) {
        setPageSize(2);
        return;
      }
      setPageSize(width < 640 ? 3 : 4);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    window.addEventListener('orientationchange', updatePageSize);
    return () => {
      window.removeEventListener('resize', updatePageSize);
      window.removeEventListener('orientationchange', updatePageSize);
    };
  }, []);

  // Get dynamic topic from first quest or use default
  const firstQuest = quests[0];
  const gradeInfo = {
    programme: getProgrammeForGrade(activeGrade),
    topic: firstQuest?.subtitle || firstQuest?.title?.split(' ').slice(0, 3).join(' ') || 'Science',
  };

  // A quest is unlocked if it's the first one, the previous one is completed, or a parent approved it
  function isUnlocked(index: number) {
    if (index === 0) return true;
    return completedQuests.includes(quests[index - 1].id) || approvedQuestIds.includes(quests[index].id);
  }

  function isCompleted(questId: string) {
    return completedQuests.includes(questId);
  }

  function handleQuestClick(quest: ScienceQuestLocal, index: number) {
    if (!isUnlocked(index)) {
      gameTTS.speak('Complete the previous quest to unlock this one!');
      return;
    }
    gameAudio.playClick();
    gameTTS.stop();
    loadQuest(quest.id);
  }

  const completedCount = quests.filter(q => isCompleted(q.id)).length;
  const pageCount = Math.max(1, Math.ceil(quests.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = safePageIndex * pageSize;
  const visibleQuests = quests.slice(pageStart, pageStart + pageSize);

  return (
    <div className="relative grid h-dvh w-full grid-rows-[auto_auto_minmax(0,1fr)_auto] items-stretch overflow-hidden px-3 pb-3 pt-14 sm:px-4 sm:pb-4 sm:pt-14"
      style={{ background: 'linear-gradient(180deg, #041428 0%, #0a2540 50%, #052e16 100%)' }}>

      {/* Bubbles animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${(i * 17.3 + 7) % 100}%`,
              bottom: '-20px',
              background: 'rgba(14,165,233,0.15)',
              animation: `bubble ${5 + (i % 5)}s ease-in-out ${(i % 8) * 0.5}s infinite`,
            }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-2 flex w-full max-w-5xl items-center justify-between gap-3">
        <button onClick={() => router.push('/world-map')}
          className="text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center gap-1">
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-white sm:text-2xl" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(14,165,233,0.6)' }}>
            🔬 Science Lab
          </h1>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-cyan-300 sm:text-xs">Grade {activeGrade} · {gradeInfo.programme} · {gradeInfo.topic}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTtsOn(gameTTS.toggle())}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base hover:scale-110 transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
            {ttsOn ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Progress summary */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto mb-2 flex w-full max-w-5xl items-center gap-3 rounded-2xl px-4 py-2"
        style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }}>
        <div className="text-2xl">🌊</div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white sm:text-sm">Quest Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 rounded-full bg-white/10">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0EA5E9, #14B8A6)' }}
                initial={{ width: 0 }}
                animate={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, delay: 0.3 }} />
            </div>
            <span className="text-cyan-300 text-xs font-bold">{completedCount}/{quests.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Quest path */}
      <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-5xl grid-cols-1 gap-2 overflow-hidden md:grid-cols-2">
        {visibleQuests.map((quest, localIndex) => {
          const index = pageStart + localIndex;
          const unlocked = isUnlocked(index);
          const completed = isCompleted(quest.id);

          return (
            <div key={quest.id} className="relative">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
                onMouseEnter={() => setHoveredId(quest.id)}
                onMouseLeave={() => setHoveredId(null)}>

                <button
                  onClick={() => handleQuestClick(quest, index)}
                  disabled={!unlocked}
                  className="flex h-full min-h-0 w-full items-center gap-3 rounded-2xl p-3 text-left transition-all"
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
                  <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-2xl sm:h-12 sm:w-12"
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
                    <div className="mb-0.5 flex items-center gap-2">
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
                    <p className="line-clamp-1 text-sm font-black leading-tight text-white sm:text-base"
                      style={{ color: unlocked ? 'white' : 'rgba(255,255,255,0.3)' }}>
                      {LOCATION_ICONS[quest.locationType]} {quest.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 sm:text-xs"
                      style={{ color: unlocked ? quest.color : 'rgba(255,255,255,0.2)' }}>
                      {quest.subtitle}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{quest.questions.length} questions</p>
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

      <div className="relative z-10 mx-auto mt-2 flex w-full max-w-5xl flex-shrink-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-sm">
        <button
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
          disabled={safePageIndex === 0}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white transition-all disabled:opacity-35"
        >
          Back
        </button>

        <div className="min-w-0 text-center">
          {quests.length > 0 && completedCount === quests.length ? (
            <p className="truncate text-xs font-black text-cyan-300 sm:text-sm">Science lab conquered</p>
          ) : (
            <p className="truncate text-xs font-bold text-cyan-200 sm:text-sm">
              Quests {pageStart + 1}-{Math.min(pageStart + visibleQuests.length, quests.length)} of {quests.length}
            </p>
          )}
          <p className="text-[10px] text-white/45">Page {safePageIndex + 1} of {pageCount}</p>
        </div>

        <button
          onClick={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))}
          disabled={safePageIndex >= pageCount - 1}
          className="rounded-xl px-3 py-2 text-xs font-black text-slate-950 transition-all disabled:opacity-35"
          style={{ background: 'linear-gradient(135deg, #0EA5E9, #14B8A6)' }}
        >
          Next
        </button>
      </div>

      {/* All done celebration */}
      {quests.length > 0 && completedCount === quests.length && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute bottom-16 left-1/2 z-20 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl p-3 text-center"
          style={{ background: 'rgba(14,165,233,0.12)', border: '2px solid rgba(14,165,233,0.5)' }}>
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-black text-cyan-400 text-lg">SCIENCE LAB CONQUERED!</p>
          <p className="text-cyan-300/70 text-sm mt-1">You've mastered Grade {currentGrade} Science! A true Science Champion!</p>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
