'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BossArenaProps {
  bossName: string;
  bossEmoji: string;
  bossColor: string;
  bossHP: number;
  bossMaxHP: number;
  question: string;
  options: string[];
  correctIndex: number;
  answered: boolean;
  selected: number | null;
  onAnswer: (i: number) => void;
  questionIndex: number;
  isRTL?: boolean;
  showingEmotionCheck?: boolean;
  tutorMsg?: string | null;
}

const ABILITY_ICONS = ['⚔️', '🛡️', '✨', '💎'];
const ABILITY_COLORS = ['#8B5CF6', '#14B8A6', '#F97316', '#3B82F6'];

export default function BossArena({
  bossName, bossEmoji, bossColor, bossHP, bossMaxHP,
  question, options, correctIndex, answered, selected, onAnswer,
  questionIndex, isRTL, tutorMsg,
}: BossArenaProps) {
  const [bossDamaged, setBossDamaged] = useState(false);
  const prevHP = useRef(bossHP);

  useEffect(() => {
    if (bossHP < prevHP.current) {
      setBossDamaged(true);
      setTimeout(() => setBossDamaged(false), 600);
    }
    prevHP.current = bossHP;
  }, [bossHP]);

  const hpPercent = Math.max(0, (bossHP / bossMaxHP) * 100);
  const hpColor = hpPercent > 60 ? '#ef4444' : hpPercent > 30 ? '#f97316' : '#991b1b';

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Boss Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bossColor}22 0%, rgba(0,0,0,0.4) 100%)`, border: `1.5px solid ${bossColor}55` }}>
        {/* Boss name */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-nunito font-black text-red-400 uppercase tracking-widest">⚔ Boss</span>
          <span className="text-sm font-nunito font-black text-white">{bossName}</span>
        </div>

        {/* HP bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 font-dmsans mb-1">
            <span>HP</span>
            <span>{bossHP}/{bossMaxHP}</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/10">
            <motion.div className="h-full rounded-full hp-bar-fill"
              style={{ background: `linear-gradient(90deg, ${hpColor}, #dc2626)`, width: `${hpPercent}%` }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }} />
          </div>
        </div>

        {/* Boss emoji — floating with damage flash */}
        <motion.div
          className={`text-8xl inline-block boss-float ${bossDamaged ? 'boss-hit' : ''}`}
          key={bossDamaged ? 'hit' : 'idle'}
          animate={bossDamaged ? { x: [-4, 6, -4, 0], filter: ['brightness(3)', 'brightness(1)'] } : {}}>
          {bossHP <= 0 ? '💀' : bossEmoji}
        </motion.div>

        {/* Sparkle decorations */}
        <div className="absolute top-3 right-4 text-xs opacity-30">✦ ✦ ✦</div>
        <div className="absolute bottom-3 left-4 text-xs opacity-20">∿∿∿</div>
      </motion.div>

      {/* ── Challenge scroll ── */}
      <AnimatePresence mode="wait">
        <motion.div key={questionIndex}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3 }}
          className="quest-scroll rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-nunito font-black text-purple-400 uppercase tracking-widest">⚡ Challenge #{questionIndex + 1}</span>
          </div>
          <p className="font-nunito font-bold text-white text-base leading-relaxed mb-5">{question}</p>

          {/* Ability cards */}
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let extraClass = '';
              if (answered) {
                if (i === correctIndex) extraClass = 'correct';
                else if (i === selected && i !== correctIndex) extraClass = 'wrong';
                else extraClass = 'dimmed';
              }

              return (
                <motion.button key={i}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => onAnswer(i)}
                  disabled={answered}
                  className={`ability-card w-full text-left px-4 py-3 rounded-2xl font-dmsans text-sm text-white flex items-center gap-3 ${extraClass}`}>
                  <span className="text-lg flex-shrink-0"
                    style={{ color: ABILITY_COLORS[i % 4] }}>
                    {answered && i === correctIndex ? '✅' : answered && i === selected && i !== correctIndex ? '❌' : ABILITY_ICONS[i % 4]}
                  </span>
                  <span className="font-bold mr-1 opacity-60">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className={`mt-4 p-3 rounded-2xl text-sm font-dmsans ${selected === correctIndex ? 'bg-green-500/20 border border-green-500/40 text-green-300' : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'}`}>
                {selected === correctIndex
                  ? <span>⚔️ Critical Hit! {tutorMsg}</span>
                  : <span>🛡️ Blocked! {tutorMsg ?? 'Keep your guard up — study the correct answer above!'}</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
