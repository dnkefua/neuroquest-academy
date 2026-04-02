'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEnglishStore, getQuestById, getNextQuest } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';
import GoldCounter from '../../math/components/ui/GoldCounter';
import confetti from 'canvas-confetti';

export default function VictoryScene() {
  const { currentQuestId, score, questions, xpEarned, clueUsed, reset, setScene, loadQuest, currentGrade } = useEnglishStore();
  const { completeQuest, completedQuests } = useProgressStore();
  const { earnCoins, walletCoins } = useEconomyStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const grade = parseInt(searchParams?.get('grade') || '6', 10);
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);

  const cluesUsedCount = clueUsed.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);
  const isPerfect = score === questions.length;
  const questPassed = pct >= 80;
  const isAlreadyComplete = completedQuests.includes(currentQuestId);
  const nextQuest = getNextQuest(currentQuestId, currentGrade);
  const currentQuest = getQuestById(currentQuestId, currentGrade);

  useEffect(() => {
    if (questPassed && !isAlreadyComplete) {
      completeQuest(currentQuestId);
      earnCoins(100, `quest-complete-${currentQuestId}`);
    }

    const title = pct === 100 ? 'Perfect Quest!' : questPassed ? 'Quest Complete!' : 'Good effort!';
    gameTTS.speak(`${title} You answered ${score} out of ${questions.length} questions correctly and earned ${xpEarned} XP! ${questPassed ? 'Amazing work!' : 'Try again to unlock the next quest!'}`);

    async function boom() {
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#F59E0B', '#EF4444', '#8B5CF6', '#22C55E', '#FFD700'] });
      setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0, y: 0.6 } }), 600);
      setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1, y: 0.6 } }), 900);
    }
    boom();
    gameAudio.playVictory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a3a 0%, #0a0a1a 100%)' }}>

      {/* Audio controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={() => setTtsOn(gameTTS.toggle())}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${ttsOn ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.2)'}`, color: ttsOn ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
          {ttsOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Gold rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute text-2xl"
            initial={{ y: -50, x: `${(i * 5.3) % 100}vw`, opacity: 1 }}
            animate={{ y: '110vh', opacity: 0 }}
            transition={{ duration: 2 + (i % 4), delay: (i * 0.3) % 2, repeat: Infinity }}>
            💰
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative max-w-md w-full rounded-3xl p-8 shadow-2xl text-center z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(15,12,41,0.97), rgba(26,5,51,0.97))',
          border: `2px solid ${questPassed ? 'rgba(245,158,11,0.6)' : 'rgba(139,92,246,0.5)'}`,
          boxShadow: questPassed ? '0 0 80px rgba(245,158,11,0.3)' : '0 0 40px rgba(139,92,246,0.2)',
        }}>

        {/* Trophy */}
        <motion.div className="text-8xl mb-4 inline-block"
          animate={{ rotate: [-5, 5, -3, 3, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 20px ${pct === 100 ? '#FFD700' : questPassed ? '#22C55E' : '#F59E0B'})` }}>
          {pct === 100 ? '🏆' : questPassed ? '🌟' : '💪'}
        </motion.div>

        <h1 className="font-black text-3xl mb-1"
          style={{ fontFamily: 'Georgia, serif', color: pct === 100 ? '#FFD700' : questPassed ? '#4ADE80' : '#FCD34D' }}>
          {pct === 100 ? 'PERFECT QUEST!' : questPassed ? 'QUEST COMPLETE!' : 'GOOD EFFORT!'}
        </h1>
        <p className="text-sm mb-1" style={{ color: questPassed ? '#FCD34D' : 'rgba(255,255,255,0.5)' }}>
          {currentQuest ? `📖 ${currentQuest.title}` : '📖 English Library'}
        </p>
        {questPassed && !isAlreadyComplete && (
          <p className="text-amber-400 text-xs mb-4">✨ +100 bonus coins earned!</p>
        )}
        {!questPassed && (
          <p className="text-orange-400 text-xs mb-4">Score 80% or higher to unlock the next quest!</p>
        )}

        {/* Stats */}
        <div className="rounded-2xl p-5 mb-5 text-left space-y-3"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            ['✅', 'Correct Answers', `${score}/${questions.length}`],
            ['📊', 'Score', `${pct}%  ${pct >= 80 ? '✅ Passed' : '❌ Try again'}`],
            ['💡', 'Clues Used', `${cluesUsedCount}/${questions.length}`],
            ['⭐', 'XP Earned', `+${xpEarned} XP`],
          ].map(([icon, label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{icon} {label}</span>
              <span className="font-black text-white text-sm">{value}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-white/10">
            <GoldCounter coins={useEnglishStore.getState().goldCoins} target={100} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Next Quest button */}
          {questPassed && nextQuest && (
            <motion.button
              onClick={() => loadQuest(nextQuest.id, currentGrade)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-2xl font-black text-black text-base"
              style={{ background: `linear-gradient(135deg, #F59E0B, #EF4444)` }}>
              📖 Next: {nextQuest.title} →
            </motion.button>
          )}

          <div className="flex gap-3">
            <button onClick={() => reset()}
              className="flex-1 py-3 rounded-2xl font-black text-sm border border-amber-500 text-amber-400 hover:bg-amber-500/20 transition-all">
              🔄 Try Again
            </button>
            <button onClick={() => { reset(); setScene('QUEST_MAP'); }}
              className="flex-1 py-3 rounded-2xl font-black text-sm border border-gray-600 text-gray-400 hover:bg-white/5 transition-all">
              🗺️ Quest Map
            </button>
            <button onClick={() => window.location.href = '/dashboard'}
              className="flex-1 py-3 rounded-2xl font-black text-sm text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
              🏠 Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
