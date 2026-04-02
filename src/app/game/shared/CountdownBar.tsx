'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownBarProps {
  seconds: number;
  color1: string;
  color2: string;
  /** Only start counting once this is true (default: true = start immediately) */
  active?: boolean;
}

/**
 * Animated countdown progress bar.
 * Uses a single interval created once — no per-tick interval churn.
 * The bar itself animates via a single Framer transition, not per-tick state.
 */
export default function CountdownBar({ seconds, color1, color2, active = true }: CountdownBarProps) {
  const [remaining, setRemaining] = useState(seconds);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const interval = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="w-full mb-3">
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        {/* Bar driven by a single Framer transition — zero per-tick re-renders */}
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: seconds, ease: 'linear' }}
        />
      </div>
      <p className="text-center text-xs text-gray-400 mt-1">
        {remaining > 0 ? `Starting in ${remaining}s…` : 'Ready!'}
      </p>
    </div>
  );
}
