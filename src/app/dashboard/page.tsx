'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateEmotion, logIntervention } from '@/lib/firestore';
import { useProgressStore } from '@/store/progressStore';
import type { UserProfile, EmotionKey } from '@/types';
import { EMOTIONS, SUBJECTS } from '@/lib/constants';
import BrainBreakModal from '@/components/BrainBreakModal';
import WalletHUD from '@/components/ui/WalletHUD';
import StreakClaim from '@/components/StreakClaim';
import { gameTTS } from '@/app/game/shared/tts';
import toast from 'react-hot-toast';

const XP_PER_LEVEL = 100;

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const [updatingEmotion, setUpdatingEmotion] = useState(false);

  const setCurrentGrade = useProgressStore(s => s.setCurrentGrade);
  const setUserName = useProgressStore(s => s.setUserName);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      setProfile(p);
      // Sync user's grade and name from profile to progress store
      if (p.grade && p.grade !== useProgressStore.getState().currentGrade) {
        setCurrentGrade(p.grade);
      }
      if (p.name) {
        setUserName(p.name);
        gameTTS.setUserName(p.name);
      }
      setLoading(false);
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
        toast('Taking a Brain Break will help! 🧠', { icon: '💜', duration: 3000 });
      } else if (emotion === 'happy') {
        toast("You're on fire! Keep going 🔥", { icon: '🎉', duration: 2000 });
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

      {/* Floating background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NeuroQuest" className="w-8 h-8 object-contain" />
            <span className="font-nunito font-black text-purple-700 text-lg">NeuroQuest</span>
          </div>
          <div className="flex items-center gap-3">
            <WalletHUD compact />
            {profile.role === 'parent' && (
              <button onClick={() => router.push('/parent')}
                className="text-sm text-purple-600 font-nunito font-bold bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-all">
                👨‍👩‍👧 Parent View
              </button>
            )}
            <button onClick={() => signOut(auth).then(() => router.push('/auth'))}
              className="text-sm text-gray-400 font-dmsans hover:text-gray-600">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Hero greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card border-0 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #14B8A6 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
          <div className="relative">
            <h1 className="font-nunito text-2xl font-black text-white mb-1">
              {isRTL ? `مرحباً بعودتك، ${profile.name}! 🌟` : `Welcome back, ${profile.name}! 🌟`}
            </h1>
            <p className="text-purple-100 font-dmsans text-sm">
              {isRTL ? 'أنت رائع — استمر في الاستكشاف! 🚀' : "Your classroom is ready — let's learn something amazing today! 🚀"}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <StreakClaim />
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                <span>⭐</span>
                <span className="font-nunito font-bold text-white text-sm">Level {level}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                <span>{currentEmotion.emoji}</span>
                <span className="font-nunito font-bold text-white text-sm capitalize">{currentEmotion.label}</span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-purple-100 mb-1.5">
                <span>{xpInLevel} XP</span><span>{XP_PER_LEVEL} XP to Level {level + 1}</span>
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

        {/* Emotion widget */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="font-nunito text-lg font-bold text-gray-800 mb-3">
            {isRTL ? 'كيف تشعر الآن؟ 💭' : 'How are you feeling right now? 💭'}
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

        {/* Brain Break */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => setShowBrainBreak(true)}
          className="w-full card border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 transition-all active:scale-[0.99] text-center">
          <div className="text-4xl mb-2">🧘</div>
          <h3 className="font-nunito text-lg font-black text-teal-700">Take a Brain Break!</h3>
          <p className="text-sm text-teal-600 font-dmsans mt-1">Breathe · Move · Ground — reset your mind ✨</p>
        </motion.button>

        {/* World Map — main navigation hub */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          onClick={() => router.push('/world-map')}
          className="w-full card border-0 text-left hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1a0d3e 0%, #0c1040 100%)', border: '1.5px solid rgba(139,92,246,0.4)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="relative flex items-center gap-4">
            <div className="text-4xl">🗺️</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-white">World Map</h3>
              <p className="text-sm font-dmsans mt-0.5" style={{ color: 'rgba(139,92,246,0.8)' }}>
                Grades 1–12 · All subjects · Coin economy 💰
              </p>
            </div>
            <div className="ml-auto text-xs font-black px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
              ⚔️ Explore
            </div>
          </div>
        </motion.button>

        {/* Social Skills shortcut */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => router.push('/social-skills')}
          className="w-full card border-0 bg-orange-50 text-left hover:scale-[1.01] active:scale-[0.99] transition-all card-3d">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤝</div>
            <div>
              <h3 className="font-nunito text-lg font-black text-orange-700">Social Skills Mini-Game</h3>
              <p className="text-sm text-orange-600 font-dmsans mt-0.5">AI-powered social scenarios — earn XP! 🎮</p>
            </div>
          </div>
        </motion.button>

        {/* Realm Portals */}
        <div>
          <h2 className="font-nunito text-xl font-black text-gray-800 mb-4">🗺️ Choose Your Realm</h2>
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
                  className="realm-card text-left overflow-hidden rounded-3xl cursor-pointer"
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
                        ⚔️ Enter
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-dmsans leading-relaxed">{subject.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div className="h-full rounded-full w-0" style={{ background: bossColor }} />
                      </div>
                      <span className="text-xs text-gray-500 font-dmsans">IB Quest</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {showBrainBreak && <BrainBreakModal onClose={() => setShowBrainBreak(false)} />}
    </div>
  );
}
