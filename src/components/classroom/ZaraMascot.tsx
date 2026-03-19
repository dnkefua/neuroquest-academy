'use client';

import { motion, AnimatePresence } from 'framer-motion';

export type ZaraExpression = 'teaching' | 'celebrating' | 'encouraging' | 'thinking' | 'calm';

interface Props {
  expression?: ZaraExpression;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EXPRESSIONS: Record<ZaraExpression, { eyes: string; mouth: string; color: string }> = {
  teaching:    { eyes: '●  ●', mouth: '◡', color: '#8B5CF6' },
  celebrating: { eyes: '★  ★', mouth: '⌣', color: '#F97316' },
  encouraging: { eyes: '●  ●', mouth: '‿', color: '#14B8A6' },
  thinking:    { eyes: '●  ·', mouth: '⌢', color: '#6C63FF' },
  calm:        { eyes: '─  ─', mouth: '◡', color: '#A8DADC' },
};

const SIZES = { sm: 64, md: 96, lg: 128 };

export default function ZaraMascot({ expression = 'teaching', message, size = 'md' }: Props) {
  const px = SIZES[size];
  const expr = EXPRESSIONS[expression];

  const bounceAnim = expression === 'celebrating'
    ? { y: [0, -12, 0], transition: { duration: 0.6, repeat: Infinity } }
    : expression === 'teaching'
    ? { y: [0, -4, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }
    : {};

  return (
    <div className="relative flex flex-col items-center">
      <motion.div animate={bounceAnim} style={{ width: px, height: px }}>
        <svg viewBox="0 0 100 100" width={px} height={px} xmlns="http://www.w3.org/2000/svg">
          {/* Graduation cap */}
          <rect x="28" y="18" width="44" height="6" rx="2" fill="#2D2D2D" />
          <polygon points="50,10 72,22 50,26 28,22" fill="#2D2D2D" />
          <line x1="72" y1="22" x2="78" y2="34" stroke="#F97316" strokeWidth="2" />
          <circle cx="78" cy="36" r="3" fill="#F97316" />
          {/* Head */}
          <circle cx="50" cy="55" r="28" fill={expr.color} />
          <circle cx="50" cy="55" r="26" fill="#FFD5B5" />
          {/* Cheeks */}
          <circle cx="30" cy="62" r="6" fill="#FFB5B5" opacity="0.5" />
          <circle cx="70" cy="62" r="6" fill="#FFB5B5" opacity="0.5" />
          {/* Eyes */}
          <text x="50" y="57" textAnchor="middle" fontSize="14" fill="#2D2D2D" fontFamily="sans-serif">{expr.eyes}</text>
          {/* Mouth */}
          <text x="50" y="70" textAnchor="middle" fontSize="16" fill="#2D2D2D" fontFamily="sans-serif">{expr.mouth}</text>
          {/* Body */}
          <ellipse cx="50" cy="90" rx="18" ry="10" fill={expr.color} />
        </svg>
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 left-full ml-3 w-52 bg-white rounded-2xl p-3 shadow-lg border border-purple-100 z-20"
            style={{ minWidth: 180 }}
          >
            {/* Speech bubble notch */}
            <div className="absolute left-0 top-4 -translate-x-2 w-3 h-3 bg-white border-l border-t border-purple-100 rotate-[-45deg]" />
            <p className="text-xs text-gray-700 font-dmsans leading-relaxed">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
