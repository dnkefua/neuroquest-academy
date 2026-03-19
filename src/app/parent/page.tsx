'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import {
  getUserProfile, getRecentSessions, getEmotionLog,
  getWeeklyProgress, getSubjectMastery, getEmotionHeatmap,
} from '@/lib/firestore';
import type { UserProfile } from '@/types';
import { EMOTIONS } from '@/lib/constants';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import WeeklyProgressChart from '@/components/dashboard/WeeklyProgressChart';
import SubjectRadarChart from '@/components/dashboard/SubjectRadarChart';
import EmotionHeatmap from '@/components/dashboard/EmotionHeatmap';

interface Session {
  id: string;
  subject: string;
  correct: number;
  total: number;
  xpEarned: number;
  timestamp: string;
}

interface EmotionEntry {
  id: string;
  emotion: string;
  timestamp: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  math: '#8B5CF6',
  science: '#14B8A6',
  english: '#3B82F6',
  'social-skills': '#F97316',
  'emotional-regulation': '#EC4899',
};

type ActiveTab = 'overview' | 'progress' | 'emotions' | 'sessions';

export default function ParentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [childProfile, setChildProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [emotionLog, setEmotionLog] = useState<EmotionEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ week: string; math?: number; science?: number; english?: number; 'social-skills'?: number }[]>([]);
  const [masteryData, setMasteryData] = useState<{ subject: string; value: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ day: string; emotion: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkUid, setLinkUid] = useState('');
  const [linking, setLinking] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      if (p.role !== 'parent') { router.replace('/dashboard'); return; }
      setProfile(p);
      if (p.childUid) await loadChildData(p.childUid);
      setLoading(false);
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadChildData(childUid: string) {
    const [cp, s, e, weekly, mastery, heatmap] = await Promise.all([
      getUserProfile(childUid),
      getRecentSessions(childUid),
      getEmotionLog(childUid),
      getWeeklyProgress(childUid),
      getSubjectMastery(childUid),
      getEmotionHeatmap(childUid),
    ]);
    setChildProfile(cp);
    setSessions(s as Session[]);
    setEmotionLog(e as EmotionEntry[]);
    setWeeklyData(weekly as { week: string; math?: number; science?: number; english?: number; 'social-skills'?: number }[]);
    setMasteryData(mastery);
    setHeatmapData(heatmap);
  }

  async function handleLink() {
    if (!profile || !linkUid.trim()) return;
    setLinking(true);
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'users', profile.uid), { childUid: linkUid.trim() });
      setProfile({ ...profile, childUid: linkUid.trim() } as UserProfile);
      await loadChildData(linkUid.trim());
    } catch {
      alert('Child account not found. Please check the UID.');
    } finally {
      setLinking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">👨‍👩‍👧</div>
      </div>
    );
  }

  const chartData = sessions.slice(0, 7).reverse().map((s) => ({
    name: s.subject.replace(/-/g, ' ').slice(0, 8),
    score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    subject: s.subject,
    xp: s.xpEarned,
  }));

  const TABS: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'progress', label: 'Progress', icon: '📈' },
    { key: 'emotions', label: 'Emotions', icon: '💭' },
    { key: 'sessions', label: 'Sessions', icon: '📋' },
  ];

  return (
    <div className="min-h-screen pb-12"
      style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EEF9F8 50%, #FFF7ED 100%)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">👨‍👩‍👧</span>
          <span className="font-nunito font-black text-gray-800">Parent Dashboard</span>
          <button onClick={() => router.push('/dashboard')}
            className="ml-auto text-sm text-gray-500 font-dmsans hover:text-gray-700 transition-colors">
            My Dashboard →
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!profile?.childUid ? (
          /* ── Link Child Account ── */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="font-nunito text-xl font-black text-gray-800 mb-2">Link Your Child&apos;s Account</h2>
            <p className="font-dmsans text-gray-500 text-sm mb-6">
              Enter your child&apos;s User ID to view their progress and emotional wellbeing.
            </p>
            <input
              value={linkUid}
              onChange={(e) => setLinkUid(e.target.value)}
              placeholder="Child's User ID..."
              className="input-field mb-4"
            />
            <button
              onClick={handleLink}
              disabled={linking || !linkUid.trim()}
              className="w-full bg-purple-600 text-white font-nunito font-black py-3 rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50">
              {linking ? '⏳ Linking...' : '🔗 Link Account'}
            </button>
          </motion.div>
        ) : (
          <>
            {/* ── Child Summary Hero ── */}
            {childProfile && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="card border-0 overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #14B8A6 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                <div className="relative">
                  <h2 className="font-nunito text-2xl font-black text-white mb-1">
                    {childProfile.name}&apos;s Learning Journey 🌟
                  </h2>
                  <p className="text-purple-100 text-sm font-dmsans">
                    Grade {childProfile.grade} · {childProfile.language === 'AR' ? 'Arabic' : 'English'} · IB Curriculum
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                      <span>⭐</span>
                      <span className="font-nunito font-bold text-white text-sm">{childProfile.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                      <span>🔥</span>
                      <span className="font-nunito font-bold text-white text-sm">{childProfile.streak} day streak</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                      <span>{EMOTIONS.find(e => e.key === childProfile.currentEmotion)?.emoji ?? '😊'}</span>
                      <span className="font-nunito font-bold text-white text-sm capitalize">
                        {childProfile.currentEmotion ?? 'happy'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
                      <span>📚</span>
                      <span className="font-nunito font-bold text-white text-sm">{sessions.length} sessions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Tab Navigation ── */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-nunito font-bold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}>
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Quick stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: '📚', label: 'Sessions', value: sessions.length, color: 'text-purple-700' },
                    { icon: '✅', label: 'Avg Score', value: sessions.length > 0 ? `${Math.round(sessions.reduce((a, s) => a + (s.total > 0 ? (s.correct / s.total) * 100 : 0), 0) / sessions.length)}%` : '—', color: 'text-teal-700' },
                    { icon: '⭐', label: 'Total XP', value: sessions.reduce((a, s) => a + (s.xpEarned ?? 0), 0), color: 'text-yellow-700' },
                    { icon: '🔥', label: 'Streak', value: `${childProfile?.streak ?? 0}d`, color: 'text-orange-700' },
                  ].map((stat) => (
                    <div key={stat.label} className="card text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className={`font-nunito font-black text-xl ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-gray-500 font-dmsans">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent scores bar chart */}
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">📊 Recent Lesson Scores</h3>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'DM Sans' }} unit="%" />
                        <Tooltip
                          formatter={(val) => [`${val}%`, 'Score']}
                          contentStyle={{ borderRadius: '12px', fontFamily: 'DM Sans', fontSize: 12 }}
                        />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={SUBJECT_COLORS[entry.subject] ?? '#8B5CF6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 font-dmsans text-sm text-center py-8">
                      No sessions yet. Encourage {childProfile?.name} to start a lesson!
                    </p>
                  )}
                </div>

                {/* Subject mastery radar */}
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">🎯 Subject Mastery</h3>
                  <SubjectRadarChart data={masteryData} />
                </div>
              </motion.div>
            )}

            {/* ── Progress Tab ── */}
            {activeTab === 'progress' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-1">📈 Weekly Progress</h3>
                  <p className="text-xs text-gray-500 font-dmsans mb-4">Average score per subject over the past 4 weeks</p>
                  <WeeklyProgressChart data={weeklyData} />
                </div>

                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">🎯 Subject Mastery Breakdown</h3>
                  <div className="space-y-3">
                    {masteryData.map((m) => (
                      <div key={m.subject}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-nunito font-bold text-gray-700">{m.subject}</span>
                          <span className="text-sm font-nunito font-bold text-purple-600">{m.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${m.value}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }} />
                        </div>
                      </div>
                    ))}
                    {masteryData.every(m => m.value === 0) && (
                      <p className="text-gray-400 font-dmsans text-sm text-center py-4">
                        Mastery data will appear after {childProfile?.name} completes lessons.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Emotions Tab ── */}
            {activeTab === 'emotions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-1">🌡️ Emotion Heatmap</h3>
                  <p className="text-xs text-gray-500 font-dmsans mb-4">How {childProfile?.name} has been feeling this week</p>
                  <EmotionHeatmap data={heatmapData} />
                </div>

                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">💭 Emotion Log (Last 10)</h3>
                  {emotionLog.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {emotionLog.map((entry) => {
                        const em = EMOTIONS.find((e) => e.key === entry.emotion);
                        return (
                          <div key={entry.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-dmsans ${em?.bg ?? 'bg-gray-50'}`}>
                            <span>{em?.emoji}</span>
                            <span className={em?.color}>{em?.label}</span>
                            <span className="text-gray-400">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-dmsans text-sm text-center py-4">
                      No emotion entries yet.
                    </p>
                  )}
                </div>

                {/* Wellbeing tip */}
                <div className="card bg-teal-50 border-teal-100">
                  <h3 className="font-nunito font-black text-teal-800 mb-2">💡 Wellbeing Tip</h3>
                  <p className="text-sm text-teal-700 font-dmsans leading-relaxed">
                    When your child feels frustrated or anxious, NeuroQuest automatically offers a Brain Break —
                    breathing exercises, movement, and grounding techniques designed for neurodiverse learners.
                    Regular short breaks improve focus and learning retention by up to 40%.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Sessions Tab ── */}
            {activeTab === 'sessions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">📋 All Sessions</h3>
                  {sessions.length > 0 ? (
                    <div className="space-y-2">
                      {sessions.map((s) => {
                        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                        const color = SUBJECT_COLORS[s.subject] ?? '#8B5CF6';
                        return (
                          <div key={s.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                              <div>
                                <p className="font-nunito font-bold text-gray-800 capitalize text-sm">
                                  {s.subject.replace(/-/g, ' ')}
                                </p>
                                <p className="text-xs text-gray-500 font-dmsans">
                                  {new Date(s.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-nunito font-black text-sm ${pct >= 70 ? 'text-teal-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                                {pct}%
                              </p>
                              <p className="text-xs text-gray-500 font-dmsans">{s.correct}/{s.total} · +{s.xpEarned}XP</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-dmsans text-sm text-center py-8">
                      No sessions recorded yet. Encourage {childProfile?.name} to start learning!
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
