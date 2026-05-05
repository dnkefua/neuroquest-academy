'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStudent } from '@/contexts/StudentContext';
import { useProgressStore } from '@/store/progressStore';
import { EMOTIONS, SUBJECTS } from '@/lib/constants';
import { useTranslations } from '@/lib/translations';
import BrainBreakModal from '@/components/BrainBreakModal';
import DailyRewardChest from '@/components/daily-reward/DailyRewardChest';
import { gameTTS } from '@/app/game/shared/tts';
import toast from 'react-hot-toast';
import type { EmotionKey } from '@/types';
import { User, LogOut, ChevronRight, Sparkles } from 'lucide-react';

const XP_PER_LEVEL = 100;

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, error, updateEmotion, isDemoMode, setDemoMode } = useStudent();
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const [showRewardChest, setShowRewardChest] = useState(false);
  const [mounted, setMounted] = useState(false);

  const setCurrentGrade = useProgressStore(s => s.setCurrentGrade);
  const setUserName = useProgressStore(s => s.setUserName);
  const t = useTranslations(profile?.language ?? 'EN');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && profile) {
      if (profile.grade) setCurrentGrade(profile.grade);
      if (profile.name) {
        setUserName(profile.name);
        gameTTS.setUserName(profile.name);
      }
    }
  }, [mounted, profile, setCurrentGrade, setUserName]);

  useEffect(() => {
    if (mounted && profile && isDemoMode) {
      setTimeout(() => setShowRewardChest(true), 1000);
    }
  }, [mounted, isDemoMode]);

  async function handleEmotionChange(emotion: EmotionKey) {
    if (!profile) return;
    try {
      await updateEmotion(emotion);
      if (emotion === 'frustrated' || emotion === 'anxious') {
        setShowBrainBreak(true);
        toast.success('Taking a brain break!', { icon: '🧠' });
      } else if (emotion === 'happy') {
        toast.success('You\'re on fire!', { icon: '🎉' });
      }
    } catch (err) {
      console.error('Error updating emotion:', err);
    }
  }

  async function handleLogout() {
    if (isDemoMode) {
      setDemoMode(false);
      return;
    }
    try {
      const { signOut } = await import('firebase/auth');
      const { getFirebaseAuth } = await import('@/lib/firebase-init');
      await signOut(getFirebaseAuth());
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  // Loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>
        <motion.div className="text-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="text-6xl mb-4">🧠</div>
          <p className="font-nunito text-xl text-purple-600 font-bold">Loading your classroom...</p>
        </motion.div>
      </div>
    );
  }

  // Error state - show demo option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-nunito text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => setDemoMode(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
          >
            Continue in Demo Mode
          </button>
        </div>
      </div>
    );
  }

  // No profile - use demo
  const displayProfile = profile || {
    uid: 'demo',
    name: 'Explorer',
    email: '',
    role: 'student' as const,
    grade: 8,
    language: 'EN' as const,
    xp: 0,
    streak: 0,
    currentEmotion: 'happy' as EmotionKey,
    createdAt: '',
    approvedQuestIds: [],
    completedQuests: [],
    studentClass: 'math',
  };

  const level = Math.floor(displayProfile.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = displayProfile.xp % XP_PER_LEVEL;
  const currentEmotion = EMOTIONS.find((e) => e.key === displayProfile.currentEmotion) ?? EMOTIONS[0];
  const isRTL = displayProfile.language === 'AR';

  return (
    <div className="min-h-screen pb-12" dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }} />
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NeuroQuest" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="font-nunito font-black text-purple-700 text-lg">NeuroQuest</span>
            {isDemoMode && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">Demo</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-purple-50 rounded-full p-1">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.key}
                  onClick={() => handleEmotionChange(emotion.key)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                    currentEmotion.key === emotion.key ? 'scale-125 ring-2 ring-purple-400' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ background: emotion.bg }}
                  title={emotion.label}
                >
                  {emotion.emoji}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-purple-100 rounded-full">
              <LogOut size={18} className="text-purple-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 mb-8 shadow-lg border border-purple-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-nunito text-2xl font-black text-gray-800">
                Welcome back, {displayProfile.name}! 👋
              </h1>
              <p className="font-dmsans text-gray-500">Grade {displayProfile.grade} · {displayProfile.studentClass?.charAt(0).toUpperCase()}{displayProfile.studentClass?.slice(1)} Explorer</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <span className="text-2xl">🔥</span>
                <span className="font-nunito font-black text-purple-700">{displayProfile.streak}</span>
                <span className="text-xs text-purple-500">day streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-dmsans text-gray-600">Level {level}</span>
              <span className="text-sm font-dmsans text-gray-500">{xpInLevel}/{XP_PER_LEVEL} XP</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-purple-700">{displayProfile.xp}</div>
              <div className="text-xs text-purple-500 font-dmsans">Total XP</div>
            </div>
            <div className="bg-teal-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-teal-700">{displayProfile.completedQuests?.length || 0}</div>
              <div className="text-xs text-teal-500 font-dmsans">Quests Done</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-orange-700">{currentEmotion.emoji}</div>
              <div className="text-xs text-orange-500 font-dmsans">{currentEmotion.label}</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <button onClick={() => router.push('/skill-tree')} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🌳</div>
            <div className="font-nunito font-bold text-gray-800">Skill Tree</div>
            <div className="text-xs text-gray-500">Track progress</div>
          </button>
          <button onClick={() => router.push('/world-map')} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="font-nunito font-bold text-gray-800">World Map</div>
            <div className="text-xs text-gray-500">Explore realms</div>
          </button>
          <button onClick={() => router.push('/social-hub')} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-nunito font-bold text-gray-800">Social Hub</div>
            <div className="text-xs text-gray-500">Connect with friends</div>
          </button>
          <button onClick={() => router.push('/student/lesson-explorer')} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-nunito font-bold text-gray-800">Lessons</div>
            <div className="text-xs text-gray-500">AI-powered</div>
          </button>
        </motion.div>

        {/* Subject Realms */}
        <div>
          <h2 className="font-nunito text-xl font-black text-gray-800 mb-4">Choose Your Realm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBJECTS.slice(0, 4).map((subject, i) => {
              const BOSS_COLORS: Record<string, string> = {
                math: '#8B5CF6', science: '#14B8A6', english: '#3B82F6', 'social-skills': '#F97316',
              };
              const REALM_NAMES: Record<string, string> = {
                math: 'Crystal Caves', science: 'Volcano Lab', english: 'Sky Library', 'social-skills': 'Town Square',
              };
              const bossColor = BOSS_COLORS[subject.id] ?? '#8B5CF6';
              return (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => {
                    if (subject.id === 'math') router.push('/game/math');
                    else router.push(`/lesson/${subject.id}`);
                  }}
                  className="relative overflow-hidden rounded-3xl cursor-pointer text-left"
                  style={{
                    background: 'linear-gradient(135deg, #1a1040 0%, #0d1b3e 100%)',
                    border: `1.5px solid ${bossColor}44`,
                    boxShadow: `0 4px 24px ${bossColor}22`,
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: `${bossColor}22`, border: `1px solid ${bossColor}44` }}>
                          {subject.emoji}
                        </div>
                        <div>
                          <p className="font-nunito font-black text-white">{REALM_NAMES[subject.id] || subject.label}</p>
                          <p className="text-xs" style={{ color: bossColor }}>{subject.label}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-dmsans leading-relaxed">{subject.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </main>

      {/* Modals */}
      {showBrainBreak && <BrainBreakModal onClose={() => setShowBrainBreak(false)} />}
      <DailyRewardChest isOpen={showRewardChest} onClose={() => setShowRewardChest(false)} />

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            NeuroQuest Academy · AI-powered adaptive learning
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a href="/legal/privacy-policy" className="hover:text-purple-600">Privacy</a>
            <a href="/legal/terms-of-service" className="hover:text-purple-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
