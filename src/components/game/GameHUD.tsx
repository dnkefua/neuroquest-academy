'use client';

import { motion } from 'framer-motion';

interface GameHUDProps {
  playerHP: number;
  maxHP: number;
  xp: number;
  level: number;
  questName: string;
  questionIndex?: number;
  totalQuestions?: number;
  phase: 'quest' | 'battle' | 'victory';
  subjectColor: string;
}

const PHASE_LABELS = {
  quest: '📜 Quest',
  battle: '⚔️ Battle',
  victory: '🏆 Victory',
};

export default function GameHUD({
  playerHP, maxHP, xp, level, questName, questionIndex, totalQuestions, phase, subjectColor,
}: GameHUDProps) {
  return (
    <div className="sticky top-0 z-30 w-full"
      style={{ background: 'linear-gradient(180deg, rgba(10,8,30,0.98) 0%, rgba(10,8,30,0.9) 100%)', borderBottom: `1px solid ${subjectColor}44` }}>
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Phase badge */}
          <span className="text-xs font-nunito font-black px-2 py-1 rounded-lg"
            style={{ background: `${subjectColor}22`, color: subjectColor, border: `1px solid ${subjectColor}44` }}>
            {PHASE_LABELS[phase]}
          </span>

          {/* Quest name */}
          <span className="text-white font-nunito font-bold text-sm flex-1 truncate opacity-80">{questName}</span>

          {/* Level */}
          <div className="flex items-center gap-1 text-yellow-400 font-nunito font-black text-xs">
            <span>⭐</span><span>Lv.{level}</span>
          </div>

          {/* Question counter in battle */}
          {phase === 'battle' && totalQuestions && (
            <span className="text-xs text-gray-400 font-dmsans">
              {questionIndex! + 1}/{totalQuestions}
            </span>
          )}
        </div>

        {/* HP hearts row */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex gap-1">
            {Array.from({ length: maxHP }).map((_, i) => (
              <motion.span key={i}
                className={i < playerHP ? '' : 'grayscale opacity-30'}
                animate={i === playerHP && playerHP < maxHP ? { scale: [1, 1.4, 0.8, 1] } : {}}
                transition={{ duration: 0.4 }}>
                ❤️
              </motion.span>
            ))}
          </div>

          {/* XP mini bar */}
          <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${subjectColor}, #14B8A6)` }}
              animate={{ width: `${(xp % 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <span className="text-xs text-gray-400 font-dmsans">{xp} XP</span>
        </div>
      </div>
    </div>
  );
}
