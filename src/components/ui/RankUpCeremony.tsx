'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RANK_PROGRESSION } from '@/store/progressStore';
import type { GradeRank } from '@/types';

interface RankUpCeremonyProps {
  grade: number;
  onClose: () => void;
}

export default function RankUpCeremony({ grade, onClose }: RankUpCeremonyProps) {
  const rank: GradeRank = RANK_PROGRESSION.find(r => r.grade === grade) ?? RANK_PROGRESSION[0];
  const prevRank = RANK_PROGRESSION.find(r => r.grade === grade - 1);

  const isProgrammeGraduation = grade === 5 || grade === 10;

  useEffect(() => {
    const boom = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const colors = grade <= 5
          ? ['#22C55E', '#84CC16', '#FCD34D', '#FFFFFF']
          : grade <= 10
          ? ['#8B5CF6', '#06B6D4', '#F97316', '#FFFFFF']
          : ['#FFD700', '#FFA500', '#FFFFFF', '#FF6B6B'];

        confetti({ particleCount: 200, spread: 140, origin: { y: 0.55 }, colors });
        setTimeout(() => confetti({ particleCount: 100, angle: 60,  spread: 90, origin: { x: 0, y: 0.6 }, colors }), 500);
        setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 90, origin: { x: 1, y: 0.6 }, colors }), 800);
      } catch {}
    };
    boom();

    // Auto-close after 9 seconds
    const t = setTimeout(onClose, 9000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)' }} />

      <motion.div
        className="relative max-w-md w-full rounded-3xl overflow-hidden z-10 text-center"
        style={{
          background: rank.bgGradient,
          border: `3px solid ${rank.color}`,
          boxShadow: `0 0 120px ${rank.color}66`,
        }}
        initial={{ scale: 0.3, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}>

        {/* Top glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${rank.color}33 0%, transparent 70%)` }} />

        <div className="relative px-8 pt-8 pb-6">
          {/* Programme graduation special header */}
          {isProgrammeGraduation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: rank.color, color: '#000' }}>
              🎓 {grade === 5 ? 'PYP GRADUATION!' : 'MYP GRADUATION!'}
            </motion.div>
          )}

          {/* Rank emoji */}
          <motion.div
            className="text-8xl mb-4 inline-block"
            animate={{ rotate: [-8, 8, -5, 5, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ filter: `drop-shadow(0 0 24px ${rank.color})` }}>
            {rank.emoji}
          </motion.div>

          {/* RANK UP header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}>
            <p className="font-black text-sm uppercase tracking-widest mb-1" style={{ color: rank.color }}>
              ⬆ RANK UP — Grade {grade}
            </p>
            <h2 className="font-black text-3xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {rank.rank}
            </h2>
          </motion.div>

          {/* Previous → New rank */}
          {prevRank && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl mb-4"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              <span className="text-2xl opacity-50">{prevRank.emoji}</span>
              <span className="text-gray-400 text-sm font-bold">{prevRank.rank}</span>
              <span className="text-white font-black">→</span>
              <span className="text-2xl">{rank.emoji}</span>
              <span className="font-black text-sm" style={{ color: rank.color }}>{rank.rank}</span>
            </motion.div>
          )}

          {/* World unlocked message */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl p-4 mb-5"
            style={{ background: `${rank.color}22`, border: `1px solid ${rank.color}44` }}>
            <p className="text-white text-sm font-bold mb-1">
              🗺️ New World Unlocked!
            </p>
            <p className="text-sm" style={{ color: rank.color }}>
              The <strong>{rank.world.charAt(0).toUpperCase() + rank.world.slice(1)} Realm</strong> is now open for exploration!
            </p>
            {isProgrammeGraduation && (
              <p className="text-white text-xs mt-2 opacity-80">
                {grade === 5
                  ? '🎉 You have completed the Primary Years Programme! Welcome to MYP!'
                  : '🎉 You have completed the Middle Years Programme! Welcome to the Diploma Programme!'}
              </p>
            )}
          </motion.div>

          {/* Coin bonus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-center gap-2 mb-5">
            <span className="text-2xl">💰</span>
            <span className="font-black text-lg" style={{ color: '#FFD700' }}>
              +100 Bonus Coins
            </span>
            <span className="text-gray-400 text-sm">for grade completion!</span>
          </motion.div>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            onClick={onClose}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-2xl font-black text-black text-base transition-all"
            style={{
              background: `linear-gradient(135deg, ${rank.color}, ${rank.color}CC)`,
              boxShadow: `0 0 20px ${rank.color}66`,
            }}>
            🚀 Explore Grade {grade}!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
