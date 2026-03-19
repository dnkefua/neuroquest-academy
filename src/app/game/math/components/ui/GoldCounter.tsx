'use client';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function GoldCounter({ coins, target }: { coins: number; target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const prevRef = useRef(0);

  useEffect(() => {
    const controls = animate(count, coins, { duration: 0.8, ease: 'easeOut' });
    prevRef.current = coins;
    return controls.stop;
  }, [coins, count]);

  const pct = (coins / target) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl">💰</div>
      <div>
        <div className="flex items-baseline gap-1">
          <motion.span className="font-black text-2xl text-yellow-400">{rounded}</motion.span>
          <span className="text-yellow-600 text-sm">/ {target}</span>
        </div>
        <div className="w-24 bg-black/30 rounded-full h-2 mt-1">
          <motion.div
            className="h-2 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
