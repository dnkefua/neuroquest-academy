'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEconomyStore } from '@/store/economyStore';
import { useProgressStore } from '@/store/progressStore';

interface GraduationCardProps {
  studentName: string;
  onClose: () => void;
}

export default function GraduationCard({ studentName, onClose }: GraduationCardProps) {
  const totalCoins   = useEconomyStore(s => s.totalCoins);
  const { completedQuests, bossesDefeated, graduationDate } = useProgressStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const gradDate = graduationDate
    ? new Date(graduationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Launch celebration
  useEffect(() => {
    const launch = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const gold = ['#FFD700', '#FFA500', '#FFFACD', '#DAA520'];
        confetti({ particleCount: 300, spread: 160, origin: { y: 0.4 }, colors: gold });
        setTimeout(() => confetti({ particleCount: 150, angle: 60,  spread: 100, origin: { x: 0, y: 0.5 }, colors: gold }), 600);
        setTimeout(() => confetti({ particleCount: 150, angle: 120, spread: 100, origin: { x: 1, y: 0.5 }, colors: gold }), 900);
        setTimeout(() => confetti({ particleCount: 200, spread: 180, origin: { y: 0.3 }, colors: gold }), 2000);
      } catch {}
    };
    launch();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Backdrop */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #1a0a00 0%, #0c0820 100%)' }} />

      <div className="relative z-10 w-full max-w-2xl py-8">

        {/* Zara graduation speech */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6">
          <div className="text-6xl mb-3">🧙‍♀️</div>
          <p className="text-purple-300 text-sm font-bold italic">
            "You did it. You actually did it. 🌟"
          </p>
        </motion.div>

        {/* The diploma */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.5, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 150, delay: 0.3 }}
          className="rounded-3xl p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #2a1500, #1a0800, #2a1500)',
            border: '3px solid #FFD700',
            boxShadow: '0 0 120px rgba(255,215,0,0.5), inset 0 0 60px rgba(255,215,0,0.05)',
          }}>

          {/* Corner ornaments */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-2xl opacity-40`}>✦</div>
          ))}

          {/* Gold top line */}
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #FFD700)' }} />
            <span className="text-3xl">🏆</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
          </div>

          {/* Certificate header */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-xs font-black uppercase tracking-[0.4em] mb-4"
            style={{ color: 'rgba(255,215,0,0.6)' }}>
            NeuroQuest Academy — Certificate of Graduation
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-white text-lg mb-2">
            This certifies that
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: 'spring' }}
            className="font-black text-5xl mb-3"
            style={{
              color: '#FFD700',
              fontFamily: 'Georgia, serif',
              textShadow: '0 0 30px rgba(255,215,0,0.5)',
            }}>
            {studentName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="text-white text-lg mb-2">
            has earned the title of
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}>
            <p className="font-black text-3xl mb-1" style={{ color: '#FFD700', fontFamily: 'Georgia, serif' }}>
              🏆 Champion Wizard Warrior
            </p>
            <p className="text-orange-300 text-sm mb-6">
              Master of the IB Curriculum — Grades 1 through 12
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Quests Completed', value: completedQuests.length, emoji: '⚔️' },
              { label: 'Bosses Defeated',  value: bossesDefeated.length,  emoji: '🐉' },
              { label: 'Coins Earned',     value: totalCoins.toLocaleString(), emoji: '💰' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="rounded-2xl p-3"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
                <div className="text-xl mb-1">{emoji}</div>
                <p className="font-black text-white text-lg">{value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,215,0,0.6)' }}>{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Date and signature */}
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3))' }} />
            <p className="text-xs" style={{ color: 'rgba(255,215,0,0.5)' }}>{gradDate}</p>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,215,0,0.3), transparent)' }} />
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="text-sm italic"
            style={{ color: 'rgba(255,215,0,0.7)', fontFamily: 'Georgia, serif' }}>
            — Zara the Wizard Warrior, Headmistress of NeuroQuest Academy ✦
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000' }}>
            🏠 Return to Dashboard
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
