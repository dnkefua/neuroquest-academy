'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useDailyRewardStore, POWER_UPS, DAILY_REWARD_SCHEDULE } from '@/store/dailyRewardStore';
import type { DailyReward } from '@/types';

interface DailyRewardChestProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyRewardChest({ isOpen, onClose }: DailyRewardChestProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState<DailyReward | null>(null);
  const [shakeCount, setShakeCount] = useState(0);

  const { claimDailyReward, canClaimToday, getTodayReward, consecutiveDays } = useDailyRewardStore();

  const todayReward = getTodayReward();
  const canClaim = canClaimToday();

  useEffect(() => {
    if (!isOpen) {
      setIsOpening(false);
      setHasClaimed(false);
      setClaimedReward(null);
      setShakeCount(0);
    }
  }, [isOpen]);

  const handleChestClick = () => {
    if (!canClaim || isOpening || hasClaimed) return;

    setShakeCount(prev => prev + 1);

    if (shakeCount >= 2) {
      setIsOpening(true);
      const result = claimDailyReward();

      if (result.isNewDay) {
        setClaimedReward(result.reward);
        setHasClaimed(true);

        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            startVelocity: 30,
            colors: ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
          });
        }, 300);
      }
    }
  };

  const powerUp = claimedReward ? POWER_UPS[claimedReward.powerUp] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative mx-4 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {hasClaimed ? '🎉 Reward Claimed!' : '🎁 Daily Reward Chest'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {hasClaimed
                  ? 'Come back tomorrow for another reward!'
                  : `Day ${consecutiveDays + 1} streak - Tap the chest to open!`}
              </p>
            </div>

            {!hasClaimed ? (
              <div className="flex flex-col items-center">
                <motion.div
                  className="cursor-pointer select-none"
                  animate={
                    !canClaim
                      ? {}
                      : shakeCount > 0
                      ? { rotate: [-5, 5, -5, 5, 0] }
                      : { y: [0, -5, 0] }
                  }
                  transition={{
                    duration: shakeCount > 0 ? 0.4 : 2,
                    repeat: shakeCount > 0 ? 0 : Infinity,
                  }}
                  onClick={handleChestClick}
                >
                  <div className="relative">
                    <motion.div
                      className="text-8xl"
                      whileHover={canClaim ? { scale: 1.1 } : {}}
                      whileTap={canClaim ? { scale: 0.9 } : {}}
                    >
                      {isOpening ? '📦' : canClaim ? '🎁' : '🔒'}
                    </motion.div>

                    {canClaim && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        !
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {todayReward && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">Today&apos;s reward:</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-2xl">{POWER_UPS[todayReward.powerUp]?.emoji}</span>
                      <span className="text-white font-semibold">
                        {POWER_UPS[todayReward.powerUp]?.name}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-3 text-sm text-gray-400">
                      <span>💰 {todayReward.coins} coins</span>
                      <span>✨ {todayReward.xp} XP</span>
                    </div>
                  </div>
                )}

                {!canClaim && (
                  <p className="mt-4 text-sm text-gray-500">
                    Already claimed today. Come back tomorrow!
                  </p>
                )}

                {shakeCount > 0 && shakeCount < 3 && canClaim && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-yellow-400"
                  >
                    {shakeCount === 1 ? 'One more tap to open!' : 'Opening...'}
                  </motion.p>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {powerUp && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="mb-4"
                  >
                    <div
                      className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                      style={{ backgroundColor: `${powerUp.color}20`, borderColor: powerUp.color }}
                    >
                      <span className="text-4xl">{powerUp.emoji}</span>
                      <div className="text-left">
                        <p className="font-bold text-white">{powerUp.name}</p>
                        <p className="text-sm text-gray-300">{powerUp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {claimedReward && (
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="px-4 py-2 rounded-lg bg-yellow-500/20">
                      <span className="text-yellow-300 font-semibold">
                        💰 +{claimedReward.coins} coins
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-purple-500/20">
                      <span className="text-purple-300 font-semibold">
                        ✨ +{claimedReward.xp} XP
                      </span>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Start Questing! 🚀
                </motion.button>
              </motion.div>
            )}

            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center mb-2">7-Day Reward Cycle</p>
              <div className="flex items-center justify-center gap-1">
                {DAILY_REWARD_SCHEDULE.map((reward, i) => {
                  const isCurrentDay = todayReward && (todayReward.day - 1) % 7 === i;
                  const isPastDay = claimedReward && i < (claimedReward.day - 1) % 7;

                  return (
                    <div
                      key={reward.day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        isPastDay
                          ? 'bg-green-500/30 text-green-400'
                          : isCurrentDay
                          ? 'bg-purple-500/30 text-purple-300 ring-2 ring-purple-500'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {isPastDay ? '✓' : reward.day}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
