'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import {
  getUserProfile, getRecentSessions, getEmotionLog,
  getWeeklyProgress, getSubjectMastery, getEmotionHeatmap,
  approveQuest, findStudentByEmail, addChildToParent,
  removeChildFromParent,
} from '@/lib/firestore';
import { getGameQuests } from '@/lib/questData';
import type { CurriculumSubject } from '@/types';
import type { UserProfile } from '@/types';
import { EMOTIONS } from '@/lib/constants';
import { RANK_PROGRESSION } from '@/store/progressStore';
import { getAvailableSubjectsForGrade, getQuestCountForGrade } from '@/lib/questData';
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

interface ChildData {
  profile: UserProfile;
  sessions: Session[];
  emotionLog: EmotionEntry[];
  weeklyData: { week: string; math?: number; science?: number; english?: number; 'social-skills'?: number }[];
  masteryData: { subject: string; value: number }[];
  heatmapData: { day: string; emotion: string; count: number }[];
}

const SUBJECT_COLORS: Record<string, string> = {
  math: '#8B5CF6',
  science: '#14B8A6',
  english: '#3B82F6',
  social: '#F97316',
  socialSkills: '#EC4899',
};

const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social: 'Social Studies',
  socialSkills: 'Social Skills',
};

const SUBJECT_EMOJIS: Record<string, string> = {
  math: '🔢', science: '🔬', english: '📖', social: '🌍', socialSkills: '💜',
};

type ActiveTab = 'overview' | 'quests' | 'progress' | 'emotions' | 'sessions' | 'unlock';

export default function ParentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [linkEmail, setLinkEmail] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [togglingQuestId, setTogglingQuestId] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);

  const loadChildData = useCallback(async (childUid: string): Promise<ChildData | null> => {
    const [cp, s, e, weekly, mastery, heatmap] = await Promise.all([
      getUserProfile(childUid),
      getRecentSessions(childUid),
      getEmotionLog(childUid),
      getWeeklyProgress(childUid),
      getSubjectMastery(childUid),
      getEmotionHeatmap(childUid),
    ]);
    if (!cp) return null;
    return {
      profile: cp,
      sessions: s as Session[],
      emotionLog: e as EmotionEntry[],
      weeklyData: weekly as ChildData['weeklyData'],
      masteryData: mastery,
      heatmapData: heatmap,
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      if (p.role !== 'parent') { router.replace('/dashboard'); return; }
      setProfile(p);

      // Load all children (multi-child support with backward compat)
      const childIds = p.childUids?.length ? p.childUids : (p.childUid ? [p.childUid] : []);
      const childDataList = await Promise.all(childIds.map(loadChildData));
      setChildren(childDataList.filter((c): c is ChildData => c !== null));
      setLoading(false);
    });
    return () => unsub();
  }, [router, loadChildData]);

  async function handleLinkByEmail() {
    if (!profile || !linkEmail.trim()) return;
    setLinking(true);
    setLinkError('');
    try {
      const student = await findStudentByEmail(linkEmail.trim());
      if (!student) {
        setLinkError('No student account found with that email.');
        return;
      }
      // Check not already linked
      const existingIds = children.map(c => c.profile.uid);
      if (existingIds.includes(student.uid)) {
        setLinkError(`${student.name} is already linked!`);
        return;
      }
      await addChildToParent(profile.uid, student.uid);
      const childData = await loadChildData(student.uid);
      if (childData) {
        setChildren(prev => [...prev, childData]);
        setSelectedChildIdx(children.length);
      }
      setLinkEmail('');
      setShowAddChild(false);
      setProfile(prev => prev ? { ...prev, childUids: [...(prev.childUids ?? []), student.uid] } : prev);
    } catch {
      setLinkError('Failed to link. Please try again.');
    } finally {
      setLinking(false);
    }
  }

  async function handleRemoveChild(childUid: string) {
    if (!profile) return;
    await removeChildFromParent(profile.uid, childUid);
    setChildren(prev => prev.filter(c => c.profile.uid !== childUid));
    setSelectedChildIdx(0);
  }

  async function handleToggleQuestApproval(questId: string) {
    const child = children[selectedChildIdx];
    if (!child || togglingQuestId) return;
    setTogglingQuestId(questId);
    try {
      const childApproved = child.profile.approvedQuestIds ?? [];
      if (childApproved.includes(questId)) {
        const { updateDoc, doc, arrayRemove } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        await updateDoc(doc(db, 'users', child.profile.uid), { approvedQuestIds: arrayRemove(questId) });
        setChildren(prev => prev.map((c, i) => i === selectedChildIdx
          ? { ...c, profile: { ...c.profile, approvedQuestIds: childApproved.filter(id => id !== questId) } }
          : c));
      } else {
        await approveQuest(child.profile.uid, questId);
        setChildren(prev => prev.map((c, i) => i === selectedChildIdx
          ? { ...c, profile: { ...c.profile, approvedQuestIds: [...childApproved, questId] } }
          : c));
      }
    } finally {
      setTogglingQuestId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">👨‍👩‍👧</div>
      </div>
    );
  }

  const child = children[selectedChildIdx] ?? null;
  const childProfile = child?.profile ?? null;
  const sessions = child?.sessions ?? [];
  const emotionLog = child?.emotionLog ?? [];
  const weeklyData = child?.weeklyData ?? [];
  const masteryData = child?.masteryData ?? [];
  const heatmapData = child?.heatmapData ?? [];
  const childCompletedQuests = childProfile?.completedQuests ?? [];
  const childApprovedQuests = childProfile?.approvedQuestIds ?? [];

  const chartData = sessions.slice(0, 7).reverse().map((s) => ({
    name: s.subject.replace(/-/g, ' ').slice(0, 8),
    score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    subject: s.subject,
    xp: s.xpEarned,
  }));

  // Check if child is currently active (within last 10 minutes)
  const isChildActive = childProfile?.lastActiveTimestamp
    ? (Date.now() - new Date(childProfile.lastActiveTimestamp).getTime()) < 10 * 60 * 1000
    : false;

  const TABS: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'quests', label: 'Quests', icon: '🗺️' },
    { key: 'unlock', label: 'Unlock Topics', icon: '🔓' },
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
          {children.length > 0 && (
            <button onClick={() => setShowAddChild(true)}
              className="ml-2 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-nunito font-bold hover:bg-purple-200 transition-all">
              + Add Child
            </button>
          )}
          <button onClick={() => router.push('/dashboard')}
            className="ml-auto text-sm text-gray-500 font-dmsans hover:text-gray-700 transition-colors">
            My Dashboard →
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {children.length === 0 ? (
          /* ── No Children Linked ── */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="font-nunito text-xl font-black text-gray-800 mb-2">Link Your Child&apos;s Account</h2>
            <p className="font-dmsans text-gray-500 text-sm mb-6">
              Enter your child&apos;s email address to view their progress and emotional wellbeing.
            </p>
            <input
              value={linkEmail}
              onChange={(e) => { setLinkEmail(e.target.value); setLinkError(''); }}
              placeholder="Child's email address..."
              type="email"
              className="input-field mb-3"
            />
            {linkError && <p className="text-red-500 text-xs font-dmsans mb-3">{linkError}</p>}
            <button
              onClick={handleLinkByEmail}
              disabled={linking || !linkEmail.trim()}
              className="w-full bg-purple-600 text-white font-nunito font-black py-3 rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50">
              {linking ? '⏳ Searching...' : '🔗 Link by Email'}
            </button>
          </motion.div>
        ) : (
          <>
            {/* ── Child Selector (multi-child) ── */}
            {children.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {children.map((c, i) => (
                  <button key={c.profile.uid}
                    onClick={() => setSelectedChildIdx(i)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-nunito font-bold text-sm whitespace-nowrap transition-all ${
                      selectedChildIdx === i
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-100'
                    }`}>
                    <span className="text-lg">{c.profile.currentEmotion === 'happy' ? '😊' : c.profile.currentEmotion === 'frustrated' ? '😤' : c.profile.currentEmotion === 'anxious' ? '😰' : '😐'}</span>
                    {c.profile.name}
                    <span className="text-xs opacity-70">Gr {c.profile.grade}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Add Child Modal ── */}
            <AnimatePresence>
              {showAddChild && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="card border-purple-200 border-2 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-nunito font-black text-gray-800">Add Another Child</h3>
                    <button onClick={() => { setShowAddChild(false); setLinkError(''); }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={linkEmail}
                      onChange={(e) => { setLinkEmail(e.target.value); setLinkError(''); }}
                      placeholder="Child's email address..."
                      type="email"
                      className="input-field flex-1"
                    />
                    <button onClick={handleLinkByEmail} disabled={linking || !linkEmail.trim()}
                      className="bg-purple-600 text-white font-nunito font-bold px-5 py-2 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all text-sm">
                      {linking ? '⏳' : '🔗 Link'}
                    </button>
                  </div>
                  {linkError && <p className="text-red-500 text-xs font-dmsans mt-2">{linkError}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Child Summary Hero ── */}
            {childProfile && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key={childProfile.uid}
                className="card border-0 overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #14B8A6 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-nunito text-2xl font-black text-white mb-1">
                        {childProfile.name}&apos;s Learning Journey 🌟
                      </h2>
                      <p className="text-purple-100 text-sm font-dmsans">
                        Grade {childProfile.grade} · {childProfile.language === 'AR' ? 'Arabic' : 'English'} · IB Curriculum
                      </p>
                    </div>
                    {children.length > 1 && (
                      <button onClick={() => handleRemoveChild(childProfile.uid)}
                        className="text-white/50 hover:text-white/80 text-xs font-dmsans transition-colors"
                        title="Unlink child">
                        Unlink
                      </button>
                    )}
                  </div>

                  {/* Live Activity Indicator */}
                  {isChildActive && childProfile.lastActiveSubject && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 border border-white/20">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                      </span>
                      <span className="font-nunito font-bold text-white text-sm">
                        Currently playing: {SUBJECT_LABELS[childProfile.lastActiveSubject] ?? childProfile.lastActiveSubject}
                      </span>
                      {childProfile.lastActiveQuest && (
                        <span className="text-purple-200 text-xs font-dmsans">
                          ({childProfile.lastActiveQuest})
                        </span>
                      )}
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-3">
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
                    {childProfile.pendingApprovals && childProfile.pendingApprovals.length > 0 && (
                      <div className="flex items-center gap-1.5 bg-red-500/30 rounded-xl px-3 py-1.5 border border-red-300/30">
                        <span>🔔</span>
                        <span className="font-nunito font-bold text-white text-sm">
                          {childProfile.pendingApprovals.length} pending
                        </span>
                      </div>
                    )}
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

            {/* ── Quests Tab ── */}
            {activeTab === 'quests' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-1">🗺️ Quest Completion by Grade</h3>
                  <p className="text-xs text-gray-500 font-dmsans mb-4">
                    {childProfile?.name}&apos;s progress through each grade level
                  </p>

                  <div className="space-y-3">
                    {RANK_PROGRESSION.map((rank) => {
                      const subjects = getAvailableSubjectsForGrade(rank.grade);
                      const totalQuests = subjects.reduce((sum, s) => sum + getQuestCountForGrade(rank.grade, s.id as 'math' | 'science' | 'english' | 'social' | 'socialSkills'), 0);
                      const completedInGrade = childCompletedQuests.filter(q => q.startsWith(`g${rank.grade}-`)).length;
                      const pct = totalQuests > 0 ? Math.round((completedInGrade / totalQuests) * 100) : 0;

                      return (
                        <div key={rank.grade} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{rank.emoji}</span>
                              <div>
                                <p className="font-nunito font-bold text-gray-800 text-sm">Grade {rank.grade}</p>
                                <p className="text-xs text-gray-500">{rank.rank}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-nunito font-black text-sm" style={{ color: rank.color }}>
                                {completedInGrade}/{totalQuests}
                              </p>
                              <p className="text-xs text-gray-500">{pct}% complete</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div className="h-2 rounded-full"
                              style={{ background: rank.bgGradient }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subject Breakdown */}
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">📚 Quests by Subject</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(['math', 'science', 'english', 'social', 'socialSkills'] as const).map((subject) => {
                      const completed = childCompletedQuests.filter(q => q.includes(`-${subject}-`) || q.includes(`-${subject}q`)).length;
                      const color = SUBJECT_COLORS[subject] ?? '#8B5CF6';
                      return (
                        <div key={subject} className="p-3 rounded-xl border text-center"
                          style={{ borderColor: `${color}40`, background: `${color}10` }}>
                          <div className="text-2xl mb-1">{SUBJECT_EMOJIS[subject]}</div>
                          <p className="font-nunito font-bold text-sm" style={{ color }}>
                            {SUBJECT_LABELS[subject] ?? subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{completed} quests</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Quest Completions */}
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-4">🏆 Recent Completions</h3>
                  {childCompletedQuests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {childCompletedQuests.slice(-10).reverse().map((questId) => {
                        const gradeMatch = questId.match(/g(\d+)/);
                        const grade = gradeMatch ? parseInt(gradeMatch[1]) : 1;
                        const rank = RANK_PROGRESSION.find(r => r.grade === grade);
                        return (
                          <div key={questId} className="px-3 py-1.5 rounded-full text-xs font-nunito font-bold"
                            style={{ background: rank?.color ? `${rank.color}20` : '#F3F4F6', color: rank?.color ?? '#6B7280' }}>
                            {rank?.emoji} {questId}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-dmsans text-sm text-center py-4">
                      No quests completed yet. Encourage {childProfile?.name} to start learning!
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Unlock Topics Tab ── */}
            {activeTab === 'unlock' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="card">
                  <h3 className="font-nunito text-lg font-black text-gray-800 mb-1">🔓 Unlock Topics for {childProfile?.name}</h3>
                  <p className="text-xs text-gray-500 font-dmsans mb-5">
                    By default, quests unlock sequentially. Toggle any quest below to give your child direct access — perfect for jumping ahead or revisiting a topic.
                  </p>

                  {/* Pending Approvals */}
                  {childProfile?.pendingApprovals && childProfile.pendingApprovals.length > 0 && (
                    <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <h4 className="font-nunito font-bold text-amber-800 text-sm mb-2">🔔 Pending Requests from {childProfile.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {childProfile.pendingApprovals.map(questId => (
                          <div key={questId} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-amber-200">
                            <span className="text-xs font-nunito font-bold text-gray-700">{questId}</span>
                            <button onClick={() => handleToggleQuestApproval(questId)}
                              className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-bold hover:bg-green-600">
                              Approve
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(['math', 'science', 'english', 'social', 'socialSkills'] as CurriculumSubject[]).map((subject) => {
                    const grade = childProfile?.grade ?? 6;
                    const quests = getGameQuests(grade, subject);
                    if (quests.length === 0) return null;
                    const subjectColor = SUBJECT_COLORS[subject] ?? '#8B5CF6';
                    return (
                      <div key={subject} className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{SUBJECT_EMOJIS[subject]}</span>
                          <span className="font-nunito font-black text-sm text-gray-800">{SUBJECT_LABELS[subject] ?? subject}</span>
                        </div>
                        <div className="space-y-2">
                          {quests.map((quest, idx) => {
                            const isCompleted = childCompletedQuests.includes(quest.id);
                            const isApproved = childApprovedQuests.includes(quest.id);
                            const isAutoUnlocked = idx === 0 || childCompletedQuests.includes(quests[idx - 1].id);
                            const isToggling = togglingQuestId === quest.id;
                            return (
                              <div key={quest.id}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                                style={{ borderColor: `${subjectColor}30`, background: isApproved ? `${subjectColor}08` : 'white' }}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base flex-shrink-0">{isCompleted ? '✅' : isApproved ? '🔓' : isAutoUnlocked ? '🔑' : '🔒'}</span>
                                  <div className="min-w-0">
                                    <p className="font-nunito font-bold text-gray-800 text-xs truncate">{quest.title}</p>
                                    <p className="text-[10px] text-gray-400 font-dmsans">
                                      {isCompleted ? 'Completed' : isApproved ? 'Parent unlocked' : isAutoUnlocked ? 'Naturally unlocked' : 'Locked'}
                                    </p>
                                  </div>
                                </div>
                                {!isCompleted && !isAutoUnlocked && (
                                  <button
                                    onClick={() => handleToggleQuestApproval(quest.id)}
                                    disabled={isToggling}
                                    className="flex-shrink-0 ml-2 px-3 py-1 rounded-lg text-xs font-nunito font-bold transition-all disabled:opacity-50"
                                    style={{
                                      background: isApproved ? `${subjectColor}20` : '#F3F4F6',
                                      color: isApproved ? subjectColor : '#6B7280',
                                      border: `1px solid ${isApproved ? subjectColor + '60' : '#E5E7EB'}`,
                                    }}>
                                    {isToggling ? '⏳' : isApproved ? 'Lock' : 'Unlock'}
                                  </button>
                                )}
                                {(isCompleted || isAutoUnlocked) && (
                                  <span className="flex-shrink-0 ml-2 text-xs text-gray-400 font-dmsans">
                                    {isCompleted ? 'Done' : 'Open'}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
