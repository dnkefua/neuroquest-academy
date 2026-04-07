'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateEmotion, logIntervention } from '@/lib/firestore';
import { useProgressStore } from '@/store/progressStore';
import { useDailyRewardStore } from '@/store/dailyRewardStore';
import type { UserProfile, EmotionKey } from '@/types';
import { EMOTIONS, SUBJECTS } from '@/lib/constants';
import { useTranslations } from '@/lib/translations';
import BrainBreakModal from '@/components/BrainBreakModal';
import WalletHUD from '@/components/ui/WalletHUD';
import StreakClaim from '@/components/StreakClaim';
import DailyRewardChest from '@/components/daily-reward/DailyRewardChest';
import { gameTTS } from '@/app/game/shared/tts';
import toast from 'react-hot-toast';

const XP_PER_LEVEL = 100;

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const [showRewardChest, setShowRewardChest] = useState(false);
  const [updatingEmotion, setUpdatingEmotion] = useState(false);

  const setCurrentGrade = useProgressStore(s => s.setCurrentGrade);
  const setUserName = useProgressStore(s => s.setUserName);
  const canClaimReward = useDailyRewardStore(s => s.canClaimToday());
  const t = useTranslations(profile?.language ?? 'EN');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      setProfile(p);
      if (p.grade && p.grade !== useProgressStore.getState().currentGrade) {
        setCurrentGrade(p.grade);
      }
      if (p.name) {
        setUserName(p.name);
        gameTTS.setUserName(p.name);
      }
      setLoading(false);

      const rewardStore = useDailyRewardStore.getState();
      if (rewardStore.canClaimToday()) {
        setTimeout(() => setShowRewardChest(true), 800);
      }
    });
    return () => unsub();
  }, [router, setCurrentGrade, setUserName]);

  async function handleEmotionChange(emotion: EmotionKey) {
    if (!profile || updatingEmotion) return;
    setUpdatingEmotion(true);
    try {
      await updateEmotion(profile.uid, emotion);
      setProfile({ ...profile, currentEmotion: emotion });
      if (emotion === 'frustrated' || emotion === 'anxious') {
        await logIntervention(profile.uid, emotion);
        setShowBrainBreak(true);
        toast.success('taking_brain_break' as any, { icon: '💜', duration: 3000 });
      } else if (emotion === 'happy') {
        toast.success("youre_on_fire" as any, { icon: '🎉', duration: 2000 });
      }
    } finally {
      setUpdatingEmotion(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <p className="font-nunito text-xl text-purple-600 font-bold">Loading your classroom...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const level = Math.floor(profile.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = profile.xp % XP_PER_LEVEL;
  const currentEmotion = EMOTIONS.find((e) => e.key === profile.currentEmotion) ?? EMOTIONS[0];
  const isRTL = profile.language === 'AR';

  return (
    <div className="min-h-screen pb-12 relative" dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />
      </div>

      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NeuroQuest" className="w-8 h-8 object-contain" />
            <span className="font-nunito font-black text-purple-700 text-lg">NeuroQuest</span>
          </div>
          <div className="flex items-center gap-3">
            <WalletHUD compact />
            <button onClick={() => router.push('/analytics')}
              className="text-sm text-purple-600 font-nunito font-bold bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-all">
              📊 Analytics
            </button>
            <button onClick={() => router.push('/social-hub')}
              className="text-sm text-blue-600 font-nunito font-bold bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all">
              👥 Social
            </button>
            <button onClick={() => router.push('/biosync')}
              className="text-sm text-teal-600 font-nunito font-bold bg-teal-50 px-3 py-1.5 rounded-xl hover:bg-teal-100 transition-all">
              🔗 Bio-Sync
            </button>
            <button onClick={() => router.push('/curriculum')}
              className="text-sm text-orange-600 font-nunito font-bold bg-orange-50 px-3 py-1.5 rounded-xl hover:bg-orange-100 transition-all">
              📖 Curriculum
            </button>
            {profile.role === 'parent' && (
              <button onClick={() => router.push('/parent')}
                className="text-sm text-purple-600 font-nunito font-bold bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-all">
                {t('parent_view')}
              </button>
            )}
            <button onClick={() => signOut(auth).then(() => router.push('/auth'))}
              className="text-sm text-gray-400 font-dmsans hover:text-gray-600">
              {t('sign_out')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card border-0 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #14B8A6 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
          <div className="relative">
            <h1 className="font-nunito text-2xl font-black text-white mb-1">
              {t('welcome_back_name')}, {profile.name}! 🌟
            </h1>
            <p className="text-purple-100 font-dmsans text-sm">
              {t('you_are_amazing')}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <StreakClaim />
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                <span>⭐</span>
                <span className="font-nunito font-bold text-white text-sm">{t('level')} {level}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                <span>{currentEmotion.emoji}</span>
                <span className="font-nunito font-bold text-white text-sm capitalize">{currentEmotion.label}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-purple-100 mb-1.5">
                <span>{xpInLevel} XP</span><span>{XP_PER_LEVEL} XP {t('to_level')} {level + 1}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 xp-bar">
                <motion.div className="h-3 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max((xpInLevel / XP_PER_LEVEL) * 100, 3)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="font-nunito text-lg font-bold text-gray-800 mb-3">
            {t('how_feeling_now')}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {EMOTIONS.map((e) => (
              <button key={e.key} onClick={() => handleEmotionChange(e.key)} disabled={updatingEmotion}
                className={`p-3 rounded-2xl border-2 text-center transition-all hover:scale-105 active:scale-95 ${
                  profile.currentEmotion === e.key ? `${e.bg} ${e.color}` : 'border-gray-100 hover:border-purple-200'
                }`}>
                <div className="text-3xl mb-1">{e.emoji}</div>
                <div className={`text-xs font-nunito font-bold ${profile.currentEmotion === e.key ? e.color : 'text-gray-500'}`}>{e.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => router.push('/skill-tree')}
          className={`w-full card border-0 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden relative`}
          style={{ background: 'linear-gradient(135deg, #1a0d3e 0%, #0c1040 100%)', border: '1.5px solid rgba(139,92,246,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-4xl">🗺️</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-white">Skill Tree</h3>
              <p className="text-sm font-dmsans mt-0.5" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Explore your quest map with dependencies and fog of war
              </p>
            </div>
            <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs font-black px-3 py-1.5 rounded-xl`}
              style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
              Explore
            </div>
          </div>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          onClick={() => router.push('/cognitive-baseline')}
          className={`w-full card border-0 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden relative`}
          style={{ background: 'linear-gradient(135deg, #0c1040 0%, #1a0d3e 100%)', border: '1.5px solid rgba(6,182,212,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-4xl">🧠</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-white">Cognitive Baseline</h3>
              <p className="text-sm font-dmsans mt-0.5" style={{ color: 'rgba(6,182,212,0.8)' }}>
                Discover your brain strengths in 10 minutes
              </p>
            </div>
            <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs font-black px-3 py-1.5 rounded-xl`}
              style={{ background: 'rgba(6,182,212,0.2)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.3)' }}>
              Assess
            </div>
          </div>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => setShowBrainBreak(true)}
          className="w-full card border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 transition-all active:scale-[0.99] text-center">
          <div className="text-4xl mb-2">🧘</div>
          <h3 className="font-nunito text-lg font-black text-teal-700">{t('brain_break')}</h3>
          <p className="text-sm text-teal-600 font-dmsans mt-1">{t('breathe_move_ground')}</p>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          onClick={() => router.push('/world-map')}
          className={`w-full card border-0 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden relative`}
          style={{ background: 'linear-gradient(135deg, #1a0d3e 0%, #0c1040 100%)', border: '1.5px solid rgba(139,92,246,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-4xl">🗺️</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-white">{t('world_map')}</h3>
              <p className="text-sm font-dmsans mt-0.5" style={{ color: 'rgba(139,92,246,0.8)' }}>
                {t('world_map_desc')}
              </p>
            </div>
            <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs font-black px-3 py-1.5 rounded-xl`}
              style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
              {t('explore')}
            </div>
          </div>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          onClick={() => router.push('/social-skills')}
          className={`w-full card border-0 bg-orange-50 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all card-3d`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤝</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-orange-700">{t('social_skills_game')}</h3>
              <p className="text-sm text-orange-600 font-dmsans mt-0.5">{t('social_skills_desc')}</p>
            </div>
          </div>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
          onClick={() => router.push('/calm-corner')}
          className={`w-full card border-0 bg-gradient-to-r from-teal-50 to-purple-50 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all card-3d`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🧘</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-teal-700">{t('calm_corner')}</h3>
              <p className="text-sm text-teal-600 font-dmsans mt-0.5">{t('calm_corner_desc')}</p>
            </div>
          </div>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          onClick={() => router.push('/game-market')}
          className={`w-full card border-0 ${isRTL ? 'text-right' : 'text-left'} hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden relative`}
          style={{ background: 'linear-gradient(135deg, #1a0d3e 0%, #2d1060 50%, #0d1b3e 100%)', border: '1.5px solid rgba(236,72,153,0.3)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-4xl">🏪</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-white">Game Market</h3>
              <p className="text-sm font-dmsans mt-0.5" style={{ color: 'rgba(236,72,153,0.8)' }}>
                Spend coins on fun educational games!
              </p>
            </div>
            <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs font-black px-3 py-1.5 rounded-xl`}
              style={{ background: 'rgba(236,72,153,0.2)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)' }}>
              Shop
            </div>
          </div>
        </motion.button>

        <div>
          <h2 className="font-nunito text-xl font-black text-gray-800 mb-4">{t('choose_your_realm')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBJECTS.map((subject, i) => {
              const BOSS_COLORS: Record<string, string> = {
                math: '#8B5CF6', science: '#14B8A6', english: '#3B82F6',
                'social-skills': '#F97316', 'emotional-regulation': '#EC4899',
              };
              const REALM_NAMES_MAP: Record<string, string> = {
                math: 'Crystal Caves', science: 'Volcano Lab', english: 'Sky Library',
                'social-skills': 'Town Square', 'emotional-regulation': 'Zen Temple',
              };
              const bossColor = BOSS_COLORS[subject.id] ?? '#8B5CF6';
              const realmName = REALM_NAMES_MAP[subject.id] ?? subject.label;
              return (
                <motion.button key={subject.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => {
                    if (subject.id === 'math') router.push('/game/math');
                    else if (subject.id === 'science') router.push('/game/science');
                    else router.push(`/lesson/${subject.id}`);
                  }}
                  className={`realm-card ${isRTL ? 'text-right' : 'text-left'} overflow-hidden rounded-3xl cursor-pointer`}
                  style={{
                    background: 'linear-gradient(135deg, #1a1040 0%, #0d1b3e 100%)',
                    border: `1.5px solid ${bossColor}44`,
                    boxShadow: `0 4px 24px ${bossColor}22`,
                    '--glow-color': bossColor,
                  } as React.CSSProperties}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: `${bossColor}22`, border: `1px solid ${bossColor}44` }}>
                          {subject.emoji}
                        </div>
                        <div>
                          <p className="font-nunito font-black text-white text-base">{realmName}</p>
                          <p className="text-xs font-dmsans" style={{ color: bossColor }}>{subject.label}</p>
                        </div>
                      </div>
                      <div className="text-xs font-nunito font-black px-2 py-1 rounded-lg"
                        style={{ background: `${bossColor}22`, color: bossColor }}>
                        {t('enter_realm')}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-dmsans leading-relaxed">{subject.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div className="h-full rounded-full w-0" style={{ background: bossColor }} />
                      </div>
                      <span className="text-xs text-gray-500 font-dmsans">{t('ib_quest')}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {showBrainBreak && <BrainBreakModal onClose={() => setShowBrainBreak(false)} />}
      <DailyRewardChest isOpen={showRewardChest} onClose={() => setShowRewardChest(false)} />

      <footer className="max-w-4xl mx-auto px-4 py-8 mt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            NeuroQuest Academy is a Supplementary Learning Adventure. Matriculation is through your accredited educational institution.
          </p>
          <p className="text-xs text-gray-400">
            Data processed in accordance with UAE Data Protection Law 2026 · Biometric data stored locally only
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NeuroQuest Nexus · Built for neurodiverse learners 🧠
          </p>
        </div>
      </footer>
    </div>
  );
}
