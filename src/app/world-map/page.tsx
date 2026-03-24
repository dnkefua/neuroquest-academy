'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { useProgressStore, RANK_PROGRESSION } from '@/store/progressStore';
import { useEconomyStore } from '@/store/economyStore';
import { getAvailableSubjectsForGrade, getRouteForSubject, hasQuestsForGradeSubject } from '@/lib/questData';
import type { CurriculumSubject, GradeRank } from '@/types';
import WalletHUD from '@/components/ui/WalletHUD';

const PROGRAMME_LABELS = { PYP: 'Primary Years', MYP: 'Middle Years', DP: 'Diploma' };

export default function WorldMapPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('Explorer');
  const [selectedGrade, setSelectedGrade] = useState<GradeRank | null>(null);

  const { currentGrade, gradesCompleted, getGradeProgress } = useProgressStore();
  const walletCoins = useEconomyStore(s => s.walletCoins);

  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (p?.name) setUserName(p.name);
    });
    return () => unsub();
  }, [router]);

  if (!mounted) return <div style={{ background: '#0c0820', width: '100vw', height: '100vh' }} />;

  const isGradeUnlocked = (grade: number) => {
    if (grade === 1) return true;
    return gradesCompleted.includes(grade - 1) || grade <= currentGrade;
  };

  const pct = (grade: number) => getGradeProgress(grade, 2);

  function getGlowColor(pct: number, color: string) {
    if (pct === 100) return '#FFD700';
    if (pct >= 75)  return color;
    if (pct >= 50)  return color + '99';
    if (pct > 0)    return color + '55';
    return 'rgba(255,255,255,0.15)';
  }

  const rows = [
    { label: 'PYP — Primary Years Programme', grades: RANK_PROGRESSION.slice(0, 5),  programme: 'PYP' as const },
    { label: 'MYP — Middle Years Programme',  grades: RANK_PROGRESSION.slice(5, 10), programme: 'MYP' as const },
    { label: 'DP  — Diploma Programme',       grades: RANK_PROGRESSION.slice(10),    programme: 'DP'  as const },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0d3e 0%, #0c0820 50%, #0a1020 100%)' }}>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 120 }).map((_, i) => {
          const x = (i * 17.3 + 7) % 100;
          const y = (i * 13.7 + 11) % 100;
          const size = 1 + (i % 2);
          const delay = (i % 6) * 0.5;
          return (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: size, height: size, left: `${x}%`, top: `${y}%`,
                opacity: 0.15 + (i % 5) * 0.08,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out ${delay}s infinite` }} />
          );
        })}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md border-b border-white/10"
        style={{ background: 'rgba(10,8,32,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="text-purple-400 hover:text-purple-200 text-sm font-bold transition-colors">
              ← Dashboard
            </button>
            <div className="w-px h-5 bg-white/20" />
            <span className="text-2xl">🗺️</span>
            <span className="font-black text-white text-lg" style={{ fontFamily: 'Georgia, serif' }}>
              World Map
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="text-sm">
                {RANK_PROGRESSION.find(r => r.grade === currentGrade)?.emoji}
              </span>
              <span className="text-white text-xs font-bold">
                {RANK_PROGRESSION.find(r => r.grade === currentGrade)?.rank}
              </span>
            </div>
            <WalletHUD compact />
          </div>
        </div>
      </header>

      {/* Welcome banner */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 text-center">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-black text-3xl md:text-4xl text-white mb-2"
          style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 40px rgba(139,92,246,0.6)' }}>
          🌟 Welcome, {userName}!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-purple-300 text-sm">
          Your journey from Grade 1 to Champion Wizard Warrior awaits.
          Complete quests to unlock the next world! 🔓
        </motion.p>
      </div>

      {/* The 3 programme rows */}
      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-10">
        {rows.map((row, rowIdx) => (
          <motion.div key={row.programme}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIdx * 0.15 }}>

            {/* Programme header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{
                background: row.programme === 'PYP' ? 'linear-gradient(90deg, transparent, #22C55E44)' :
                            row.programme === 'MYP' ? 'linear-gradient(90deg, transparent, #8B5CF644)' :
                            'linear-gradient(90deg, transparent, #FFD70044)',
              }} />
              <div className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                style={{
                  background: row.programme === 'PYP' ? 'rgba(34,197,94,0.15)' :
                              row.programme === 'MYP' ? 'rgba(139,92,246,0.15)' :
                              'rgba(255,215,0,0.15)',
                  border: `1px solid ${row.programme === 'PYP' ? '#22C55E44' : row.programme === 'MYP' ? '#8B5CF644' : '#FFD70044'}`,
                  color: row.programme === 'PYP' ? '#22C55E' : row.programme === 'MYP' ? '#8B5CF6' : '#FFD700',
                }}>
                {row.label}
              </div>
              <div className="h-px flex-1" style={{
                background: row.programme === 'PYP' ? 'linear-gradient(90deg, #22C55E44, transparent)' :
                            row.programme === 'MYP' ? 'linear-gradient(90deg, #8B5CF644, transparent)' :
                            'linear-gradient(90deg, #FFD70044, transparent)',
              }} />
            </div>

            {/* Grade world cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {row.grades.map((gr, i) => {
                const unlocked = isGradeUnlocked(gr.grade);
                const progress  = pct(gr.grade);
                const completed = gradesCompleted.includes(gr.grade);
                const isCurrent = gr.grade === currentGrade;
                const glow = getGlowColor(progress, gr.color);

                return (
                  <motion.button key={gr.grade}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: rowIdx * 0.1 + i * 0.06, type: 'spring', damping: 18 }}
                    whileHover={unlocked ? { scale: 1.06, y: -4 } : {}}
                    whileTap={unlocked ? { scale: 0.97 } : {}}
                    onClick={() => unlocked && setSelectedGrade(gr)}
                    disabled={!unlocked}
                    className="relative rounded-2xl p-4 text-center transition-all"
                    style={{
                      background: unlocked ? gr.bgGradient : 'rgba(20,20,40,0.6)',
                      border: `2px solid ${glow}`,
                      boxShadow: unlocked ? `0 4px 20px ${glow}66` : 'none',
                      opacity: unlocked ? 1 : 0.45,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                    }}>

                    {/* Current grade pulse ring */}
                    {isCurrent && (
                      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{ boxShadow: [`0 0 0 0 ${gr.color}44`, `0 0 0 8px ${gr.color}00`] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                    )}

                    {/* Lock */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}

                    {/* Completion stamp */}
                    {completed && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: '#FFD700', color: '#000', boxShadow: '0 2px 8px rgba(255,215,0,0.5)' }}>
                        ✓
                      </div>
                    )}

                    {/* Current badge */}
                    {isCurrent && !completed && (
                      <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-xs font-black"
                        style={{ background: gr.color, color: '#000', fontSize: '9px' }}>
                        HERE
                      </div>
                    )}

                    <div className="text-4xl mb-2">{gr.emoji}</div>
                    <p className="font-black text-white text-xs leading-tight mb-1"
                      style={{ fontFamily: 'Georgia, serif' }}>
                      Grade {gr.grade}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: gr.color, fontSize: '10px' }}>
                      {gr.rank}
                    </p>

                    {/* Progress ring */}
                    {unlocked && (
                      <div className="mt-3">
                        <div className="w-full bg-black/30 rounded-full h-1.5">
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: rowIdx * 0.1 + i * 0.06 }}
                            style={{ background: progress === 100 ? '#FFD700' : gr.color }} />
                        </div>
                        <p className="text-xs mt-1 font-bold" style={{ color: gr.color, fontSize: '9px' }}>
                          {progress}% complete
                        </p>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/10">
          {[
            { color: '#FFD700', label: '✓ Completed' },
            { color: '#8B5CF6', label: '▶ In Progress' },
            { color: 'rgba(255,255,255,0.3)', label: '🔒 Locked' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color }}>
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Subject door modal */}
      <AnimatePresence>
        {selectedGrade && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedGrade(null)} />

            <motion.div
              className="relative w-full max-w-lg rounded-3xl overflow-hidden z-10"
              style={{
                background: selectedGrade.bgGradient,
                border: `2px solid ${selectedGrade.color}`,
                boxShadow: `0 0 80px ${selectedGrade.color}44`,
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}>

              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center"
                style={{ background: `linear-gradient(135deg, ${selectedGrade.color}22, transparent)` }}>
                <div className="text-6xl mb-3">{selectedGrade.emoji}</div>
                <h2 className="font-black text-white text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                  Grade {selectedGrade.grade}
                </h2>
                <p className="font-bold text-sm mt-1" style={{ color: selectedGrade.color }}>
                  {selectedGrade.rank}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {PROGRAMME_LABELS[selectedGrade.programme]}
                </p>
              </div>

              {/* Subject doors */}
              <div className="px-6 pb-6 space-y-2">
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">
                  Choose Your Quest Door
                </p>
                {getAvailableSubjectsForGrade(selectedGrade.grade).map((subj) => (
                  <motion.button key={subj.id}
                    whileHover={subj.hasQuests ? { x: 4, scale: 1.02 } : {}}
                    whileTap={subj.hasQuests ? { scale: 0.98 } : {}}
                    onClick={() => {
                      if (!subj.hasQuests) return;
                      router.push(getRouteForSubject(subj.id, selectedGrade.grade));
                      setSelectedGrade(null);
                    }}
                    disabled={!subj.hasQuests}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                    style={{
                      background: subj.hasQuests ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${subj.hasQuests ? selectedGrade.color + '44' : 'rgba(255,255,255,0.1)'}`,
                      opacity: subj.hasQuests ? 1 : 0.5,
                      cursor: subj.hasQuests ? 'pointer' : 'not-allowed',
                    }}>
                    <span className="text-2xl">{subj.emoji}</span>
                    <div className="flex-1">
                      <p className="font-black text-white text-sm">{subj.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: subj.hasQuests ? selectedGrade.color : 'rgba(255,255,255,0.3)' }}>
                        {subj.hasQuests ? `Grade ${selectedGrade.grade} Quest` : 'Coming Soon'}
                      </p>
                    </div>
                    {subj.hasQuests && (
                      <span className="text-gray-400 text-sm">→</span>
                    )}
                  </motion.button>
                ))}

                <button onClick={() => setSelectedGrade(null)}
                  className="w-full mt-3 py-3 rounded-2xl text-gray-400 text-sm font-bold hover:text-white transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  ✕ Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.8} }
      `}</style>
    </div>
  );
}
