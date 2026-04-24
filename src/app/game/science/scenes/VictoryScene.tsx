'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEconomyStore } from '@/store/economyStore';
import { useProgressStore } from '@/store/progressStore';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';
import VialCounter from '../components/ui/VialCounter';
import { getNextQuest, getQuestById, useScienceStore } from '../store/gameStore';

export default function ScienceVictoryScene() {
  const {
    currentGrade,
    currentQuestId,
    loadQuest,
    questions,
    reset,
    score,
    setScene,
    vialsCollected,
    clueUsed,
    xpEarned,
  } = useScienceStore();
  const { completeQuest, completedQuests } = useProgressStore();
  const { earnCoins } = useEconomyStore();
  const router = useRouter();
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  const cluesUsedCount = clueUsed.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);
  const questPassed = pct >= 80;
  const quest = getQuestById(currentQuestId, currentGrade);
  const nextQuest = getNextQuest(currentQuestId, currentGrade);
  const isAlreadyComplete = completedQuests.includes(currentQuestId);

  useEffect(() => {
    gameAudio.stopBackground();
    gameAudio.playVictory();
    gameTTS.speak(`${questPassed ? 'Expedition complete' : 'Keep trying'}. You scored ${pct} percent.`);

    if (questPassed && !isAlreadyComplete) {
      completeQuest(currentQuestId);
      earnCoins(100, `quest-complete-${currentQuestId}`);
    }

    async function celebrate() {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.58 },
        colors: ['#38BDF8', '#0EA5E9', '#14B8A6', '#6EE7B7', '#FFFFFF'],
      });
    }

    celebrate();
    // Run once when the result screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden px-3 pb-3 pt-14"
      style={{ background: 'radial-gradient(ellipse at center, #0d2137 0%, #071020 100%)' }}
    >
      <button
        onClick={() => setTtsOn(gameTTS.toggle())}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all hover:scale-110"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${ttsOn ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.2)'}`,
          color: ttsOn ? '#38BDF8' : 'rgba(255,255,255,0.3)',
        }}
      >
        {ttsOn ? 'Voice' : 'Mute'}
      </button>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 14 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-2 w-2 rounded-full bg-sky-300/40"
            style={{ left: `${(index * 7.3) % 100}%` }}
            initial={{ y: '-5vh', opacity: 1 }}
            animate={{ y: '110vh', opacity: 0 }}
            transition={{ duration: 2 + (index % 3), delay: (index * 0.35) % 3, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 16 }}
        className="relative z-10 flex max-h-[calc(100dvh-4.5rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl p-4 text-center shadow-2xl sm:p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(10,34,64,0.97), rgba(7,16,32,0.97))',
          border: '2px solid rgba(56,189,248,0.6)',
          boxShadow: '0 0 60px rgba(56,189,248,0.22)',
        }}
      >
        <motion.div
          className="mb-2 inline-block text-5xl sm:text-6xl"
          animate={{ rotate: [-4, 4, -2, 2, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {pct === 100 ? '100%' : questPassed ? 'PASS' : 'TRY'}
        </motion.div>

        <h1 className="mb-1 text-2xl font-black text-sky-300 sm:text-3xl">
          {pct === 100 ? 'PERFECT EXPEDITION' : questPassed ? 'EXPEDITION COMPLETE' : 'KEEP TRYING'}
        </h1>
        <p className="mb-2 line-clamp-1 text-sm text-teal-400">{quest?.title || 'Science Quest'}</p>

        <div className="mb-3 flex justify-center">
          <VialCounter collected={vialsCollected} total={4} justCollectedIndex={null} />
        </div>

        <div
          className="mb-3 space-y-2 rounded-2xl p-3 text-left"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            ['Correct Answers', `${score}/${questions.length}`],
            ['Crystal Vials', `${vialsCollected}/4`],
            ['Clues Used', `${cluesUsedCount}/${questions.length}`],
            ['XP Earned', `+${xpEarned} XP`],
            ['Score', `${pct}% ${questPassed ? 'Passed' : 'Try again'}`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400 sm:text-sm">{label}</span>
              <span className="text-xs font-black text-white sm:text-sm">{value}</span>
            </div>
          ))}
        </div>

        <div
          className="mb-3 rounded-2xl p-3 text-left"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}
        >
          <p className="mb-1 text-xs font-bold uppercase text-sky-400">What you learned</p>
          <p className="line-clamp-2 text-xs leading-5 text-gray-300">{quest?.subtitle ?? 'Science systems connect evidence, models, and explanation.'}</p>
        </div>

        <div className="flex flex-col gap-2">
          {questPassed && nextQuest && (
            <button
              onClick={() => {
                gameAudio.playClick();
                loadQuest(nextQuest.id);
              }}
              className="w-full rounded-2xl py-2.5 text-sm font-black text-black transition-all hover:scale-105 sm:text-base"
              style={{ background: `linear-gradient(135deg, ${quest?.color ?? '#38BDF8'}, #0EA5E9)` }}
            >
              Next: {nextQuest.title}
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                reset();
                setScene('QUEST_MAP');
              }}
              className="flex-1 rounded-2xl border border-sky-500 py-2.5 text-xs font-black text-sky-400 transition-all hover:bg-sky-500/20 sm:text-sm"
            >
              Quest Map
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 rounded-2xl py-2.5 text-xs font-black text-black transition-all hover:scale-105 sm:text-sm"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)' }}
            >
              Home
            </button>
          </div>

          {!questPassed && (
            <button
              onClick={() => loadQuest(currentQuestId)}
              className="w-full rounded-2xl border border-teal-500 py-2.5 text-xs font-bold text-teal-300 transition-all hover:bg-teal-500/20 sm:text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
