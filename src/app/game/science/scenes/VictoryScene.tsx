'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useScienceStore, getQuestById, getNextQuest } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import VialCounter from '../components/ui/VialCounter';
import { gameAudio } from '../../shared/audio';
import { gameTTS } from '../../shared/tts';

export default function ScienceVictoryScene() {
  const { score, vialsCollected, clueUsed, xpEarned, questions, reset, currentQuestId, setScene, loadQuest, currentGrade } = useScienceStore();
  const { completeQuest, completedQuests } = useProgressStore();
  const { earnCoins } = useEconomyStore();
  const router = useRouter();
  const cluesUsedCount = clueUsed.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);
  const questPassed = pct >= 80;
  const [ttsOn, setTtsOn] = useState(gameTTS.enabled);
  const [hasRewarded, setHasRewarded] = useState(false);

  const quest = getQuestById(currentQuestId, currentGrade);
  const nextQuest = getNextQuest(currentQuestId, currentGrade);
  const isAlreadyComplete = completedQuests.includes(currentQuestId);

  useEffect(() => {
    gameAudio.stopBackground();
    gameAudio.playVictory();
    const title = pct === 100 ? 'Perfect Expedition!' : 'Expedition Complete!';
    gameTTS.speak(`${title} You scored ${pct} percent! Incredible work, Explorer!`);
    async function boom() {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 180, spread: 120, origin: { y: 0.6 }, colors: ['#38BDF8','#0EA5E9','#14B8A6','#6EE7B7','#FFF'] });
      setTimeout(() => confetti({ particleCount: 90, angle: 60,  spread: 80, origin: { x: 0, y: 0.6 } }), 600);
      setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 80, origin: { x: 1, y: 0.6 } }), 900);
    }
    boom();

    // Award quest completion bonus
    if (questPassed && !hasRewarded) {
      if (!isAlreadyComplete) {
        completeQuest(currentQuestId);
        earnCoins(100, `quest-complete-${currentQuestId}`); // First-time bonus
      }
      setHasRewarded(true);
    }
  }, [questPassed, currentQuestId, isAlreadyComplete, completeQuest, earnCoins, hasRewarded, pct]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0d2137 0%, #071020 100%)' }}>

      {/* TTS toggle */}
      <button onClick={() => setTtsOn(gameTTS.toggle())}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-all"
        style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${ttsOn ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.2)'}`, color: ttsOn ? '#38BDF8' : 'rgba(255,255,255,0.3)' }}>
        {ttsOn ? '🔊' : '🔇'}
      </button>

      {/* Restored fountain & rain drops */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Background desert sky */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1A6FA820 0%, transparent 60%)' }} />
        {/* Falling water drops */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div key={i} className="absolute text-xl"
            style={{ left: `${(i * 5.6) % 100}%` }}
            initial={{ y: '-5vh', opacity: 1 }}
            animate={{ y: '110vh', opacity: 0 }}
            transition={{ duration: 2 + (i % 3), delay: (i * 0.35) % 3, repeat: Infinity }}>
            💧
          </motion.div>
        ))}
        {/* Cloud spirits dancing */}
        {['10%', '30%', '60%', '80%'].map((left, i) => (
          <motion.div key={i} className="absolute text-3xl"
            style={{ top: '8%', left }}
            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}>
            {['☀️', '☁️', '🌧️', '💧'][i]}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative max-w-md w-full rounded-3xl p-8 shadow-2xl text-center z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(10,34,64,0.97), rgba(7,16,32,0.97))',
          border: '2px solid rgba(56,189,248,0.6)',
          boxShadow: '0 0 80px rgba(56,189,248,0.3)',
        }}>

        {/* Trophy */}
        <motion.div className="text-7xl mb-3 inline-block"
          animate={{ rotate: [-5, 5, -3, 3, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ filter: 'drop-shadow(0 0 16px #38BDF8)' }}>
          {pct === 100 ? '🏆' : pct >= 80 ? '🌊' : '💪'}
        </motion.div>

        <h1 className="font-black text-3xl text-sky-300 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
          {pct === 100 ? 'PERFECT EXPEDITION!' : questPassed ? 'EXPEDITION COMPLETE!' : 'KEEP TRYING!'}
        </h1>
        <p className="text-teal-400 text-sm mb-2">{quest?.emoji} {quest?.title}</p>
        <div className="text-4xl mb-5">⛲</div>

        {/* Vials display */}
        <div className="flex justify-center mb-5">
          <VialCounter collected={vialsCollected} total={4} justCollectedIndex={null} />
        </div>

        {/* Stats */}
        <div className="rounded-2xl p-5 mb-5 text-left space-y-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            ['✅', 'Correct Answers', `${score}/${questions.length}`],
            ['💧', 'Crystal Vials',   `${vialsCollected}/4`],
            ['💡', 'Clues Used',      `${cluesUsedCount}/5`],
            ['⭐', 'XP Earned',       `+${xpEarned} XP`],
            ...(questPassed ? [['🎖️', 'Quest Complete', questPassed ? '✅ Passed!' : '❌ Try Again']] : []),
            ...(questPassed && !isAlreadyComplete ? [['💰', 'Bonus Coins', '+100 coins']] : []),
          ].map(([icon, label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{icon} {label}</span>
              <span className="font-black text-white text-sm">{value}</span>
            </div>
          ))}
        </div>

        {/* Learning summary */}
        <div className="rounded-2xl p-4 mb-5 text-left"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}>
          <p className="text-sky-400 text-xs font-bold uppercase mb-2">📖 What you learned:</p>
          <p className="text-gray-300 text-xs leading-relaxed">
            {quest?.subtitle ?? 'Water travels in an endless cycle through our world.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {questPassed && nextQuest && (
            <button onClick={() => {
              gameAudio.playClick();
              loadQuest(nextQuest.id);
            }}
              className="w-full py-4 rounded-2xl font-black text-base text-black transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${quest?.color ?? '#38BDF8'}, #0EA5E9)`, boxShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
              {nextQuest.emoji} Next: {nextQuest.title} →
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={() => { reset(); setScene('QUEST_MAP'); }}
              className="flex-1 py-3 rounded-2xl font-black text-sm border border-sky-500 text-sky-400 hover:bg-sky-500/20 transition-all">
              🗺️ Quest Map
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="flex-1 py-3 rounded-2xl font-black text-sm text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)' }}>
              🏠 Home
            </button>
          </div>
          {!questPassed && (
            <button onClick={() => loadQuest(currentQuestId)}
              className="w-full py-3 rounded-2xl font-bold text-sm border border-teal-500 text-teal-300 hover:bg-teal-500/20 transition-all">
              🔄 Try Again (Need 80% to pass)
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}