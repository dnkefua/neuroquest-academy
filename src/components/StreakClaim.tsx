'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useStreakStore, STREAK_REWARDS, getStreakReward } from '@/store/streakStore';
import { useEconomyStore } from '@/store/economyStore';

export default function StreakClaim() {
  const { currentStreak, longestStreak, canClaimToday, claimToday, lastClaimDate } = useStreakStore();
  const { earnCoins, walletCoins } = useEconomyStore();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState(0);

  // Check if should show claim modal on mount
  useEffect(() => {
    if (canClaimToday()) {
      setShowClaimModal(true);
    }
  }, []);

  const handleClaim = () => {
    const result = claimToday();
    if (result.reward > 0) {
      earnCoins(result.reward, 'daily_streak');
      setClaimedReward(result.reward);
      setJustClaimed(true);
      // Auto close after showing reward
      setTimeout(() => {
        setShowClaimModal(false);
        setJustClaimed(false);
      }, 2500);
    }
  };

  const todayReward = getStreakReward(currentStreak + 1);
  const isWeeklyBonus = (currentStreak + 1) % 7 === 0;

  return (
    <>
      {/* Streak badge in header */}
      <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
        <span className="text-lg">🔥</span>
        <div className="flex flex-col">
          <span className="font-nunito font-bold text-white text-sm leading-tight">
            {currentStreak} day streak
          </span>
          {longestStreak > currentStreak && (
            <span className="text-xs text-purple-200">Best: {longestStreak}</span>
          )}
        </div>
        {canClaimToday() && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-1 px-2 py-0.5 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900">
            +{todayReward}💰
          </motion.div>
        )}
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !justClaimed && setShowClaimModal(false)}>
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}>

              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />

              <div className="relative">
                {justClaimed ? (
                  <>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="text-7xl mb-4">
                      🎉
                    </motion.div>
                    <h2 className="font-nunito text-2xl font-black text-white mb-2">
                      {isWeeklyBonus ? 'Weekly Bonus!' : 'Streak Claimed!'}
                    </h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-purple-100 text-lg">
                      You earned <span className="font-bold text-yellow-300">{claimedReward} coins!</span>
                    </motion.p>
                    {isWeeklyBonus && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 bg-white/20 rounded-xl px-4 py-2">
                        <p className="text-sm text-purple-100">🔥 7-day streak completed!</p>
                        <p className="text-xs text-purple-200">+{STREAK_REWARDS.weeklyBonus} bonus coins!</p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">🔥</div>
                    <h2 className="font-nunito text-2xl font-black text-white mb-2">
                      Daily Streak
                    </h2>
                    <p className="text-purple-100 mb-4">
                      Keep your streak going!
                    </p>

                    {/* Streak visualization */}
                    <div className="flex justify-center gap-2 mb-4">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <div
                          key={day}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${day < currentStreak
                              ? 'bg-yellow-400 text-yellow-900'
                              : day === currentStreak
                                ? 'bg-white/30 text-white border-2 border-yellow-300'
                                : 'bg-white/10 text-white/50'}`}>
                          {day < currentStreak ? '✓' : day + 1}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/20 rounded-xl px-4 py-3 mb-4">
                      <p className="text-purple-100 text-sm mb-1">
                        {currentStreak === 0 ? 'Start your streak!' : `Day ${currentStreak + 1} reward:`}
                      </p>
                      <p className="text-3xl font-black text-yellow-300">
                        +{todayReward} coins
                      </p>
                      {isWeeklyBonus && (
                        <p className="text-sm text-purple-200 mt-1">
                          +{STREAK_REWARDS.weeklyBonus} weekly bonus! 🎁
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClaim}
                      className="w-full py-3 bg-white text-purple-700 font-nunito font-black text-lg rounded-xl">
                      Claim Reward ✨
                    </motion.button>

                    <button
                      onClick={() => setShowClaimModal(false)}
                      className="mt-3 text-purple-200 text-sm hover:text-white transition-colors">
                      Remind me later
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Compact streak display for header/sidebar
export function StreakBadge() {
  const { currentStreak, longestStreak, canClaimToday } = useStreakStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-orange-500/20 rounded-xl px-3 py-1.5">
        <span className="text-lg">🔥</span>
        <div className="flex flex-col">
          <span className="font-nunito font-bold text-orange-100 text-sm leading-tight">
            {currentStreak} day streak
          </span>
        </div>
        {canClaimToday() && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-yellow-400 rounded-full"
          />
        )}
      </div>
    </div>
  );
}