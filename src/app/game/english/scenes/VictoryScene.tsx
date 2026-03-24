'use client';

import { motion } from 'framer-motion';
import { useEnglishStore } from '../store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { gameAudio } from '../../shared/audio';
import confetti from 'canvas-confetti';

export default function VictoryScene() {
  const { currentQuestId, score, questions, setScene } = useEnglishStore();
  const { completedQuests } = useProgressStore();
  const { walletCoins } = useEconomyStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const grade = parseInt(searchParams.get('grade') || '6', 10);

  const isPerfect = score === questions.length;
  const totalQuestions = questions.length;

  // Fire confetti
  if (typeof window !== 'undefined') {
    gameAudio.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EF4444', '#8B5CF6', '#22C55E']
    });
  }

  const handleContinue = () => {
    setScene('QUEST_MAP');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #1f1400 0%, #2d1f00 50%, #1a0f00 100%)' }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6">

        {/* Trophy */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          className="text-8xl mb-4">
          {isPerfect ? '🏆' : '⭐'}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}>
          <h1 className="font-black text-white text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
            {isPerfect ? 'Perfect Score!' : 'Quest Complete!'}
          </h1>
          <p className="text-amber-300 text-lg mt-2">
            You've mastered this reading challenge!
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
          >

          <div className="p-4 rounded-xl text-center">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-white">{score}/{totalQuestions}</div>
            <div className="text-xs text-gray-400">Correct</div>
          </div>

          <div className="p-4 rounded-xl text-center">
            <div className="text-3xl mb-1">💰</div>
            <div className="text-2xl font-bold text-amber-400">{walletCoins}</div>
            <div className="text-xs text-gray-400">Coins</div>
          </div>

          <div className="p-4 rounded-xl text-center">
            <div className="text-3xl mb-1">{isPerfect ? '🎯' : '📚'}</div>
            <div className="text-2xl font-bold text-white">{isPerfect ? '100%' : `${Math.round(score/totalQuestions*100)}%`}</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </motion.div>

        {/* Bonus message */}
        {isPerfect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-3 rounded-xl text-center"
            style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }}>
            <p className="text-amber-300 font-bold">🎉 +100 Bonus Coins for Perfect Score!</p>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3">

          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            Continue →
          </button>

          <button
            onClick={handleDashboard}
            className="w-full py-3 rounded-xl font-bold text-gray-300 border border-gray-600 hover:bg-white/5 transition-all">
            Back to Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}