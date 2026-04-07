import {
  doc, setDoc, getDoc, updateDoc, addDoc, collection,
  query, orderBy, limit, getDocs, where, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '@/types';

/* ── User Profile ── */

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: new Date().toISOString(),
    xp: 0, streak: 0, currentEmotion: 'happy',
    approvedQuestIds: [],
    pendingApprovals: [],
  }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function updateEmotion(uid: string, emotion: string) {
  await updateDoc(doc(db, 'users', uid), { currentEmotion: emotion });
  await addDoc(collection(db, 'users', uid, 'emotionLog'), {
    emotion, timestamp: new Date().toISOString(),
  });
}

export async function logIntervention(uid: string, emotion: string) {
  await addDoc(collection(db, 'users', uid, 'interventionLog'), {
    emotion, action: 'brain_break_triggered', timestamp: new Date().toISOString(),
  });
}

export async function updateXP(uid: string, xpGain: number, currentXP: number) {
  await updateDoc(doc(db, 'users', uid), { xp: currentXP + xpGain });
}

export async function updateStreak(uid: string, streak: number) {
  await updateDoc(doc(db, 'users', uid), {
    streak, lastActiveDate: new Date().toISOString().split('T')[0],
  });
}

/* ── Sessions ── */

export async function logLessonSession(uid: string, data: {
  subject: string; grade: number; correct: number; total: number; xpEarned: number;
}) {
  await addDoc(collection(db, 'users', uid, 'sessions'), {
    ...data, timestamp: new Date().toISOString(),
  });
}

export async function getRecentSessions(uid: string, limitN = 20) {
  const q = query(collection(db, 'users', uid, 'sessions'), orderBy('timestamp', 'desc'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ── Adaptive Difficulty ── */

export async function getSubjectDifficulty(uid: string, subject: string): Promise<'easy' | 'medium' | 'hard'> {
  try {
    const q = query(
      collection(db, 'users', uid, 'sessions'),
      where('subject', '==', subject),
      orderBy('timestamp', 'desc'),
      limit(3),
    );
    const snap = await getDocs(q);
    if (snap.size < 2) return 'medium';

    const scores = snap.docs.map((d) => {
      const data = d.data();
      return data.total > 0 ? (data.correct / data.total) * 100 : 0;
    });
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avg >= 80) return 'hard';
    if (avg >= 50) return 'medium';
    return 'easy';
  } catch {
    return 'medium';
  }
}

/* ── Subject Mastery ── */

export async function logSubjectMastery(uid: string, subject: string, ibTopicKey: string, scorePercent: number) {
  const ref = doc(db, 'users', uid, 'subjectMastery', subject);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};
  const prev = existing[ibTopicKey] ?? { attempts: 0, totalScore: 0 };

  await setDoc(ref, {
    ...existing,
    [ibTopicKey]: {
      lastScore: scorePercent,
      attempts: prev.attempts + 1,
      totalScore: prev.totalScore + scorePercent,
      avgScore: (prev.totalScore + scorePercent) / (prev.attempts + 1),
      lastDate: new Date().toISOString().split('T')[0],
    },
  }, { merge: true });
}

export async function getSubjectMastery(uid: string): Promise<{ subject: string; value: number }[]> {
  const subjects = ['math', 'science', 'english', 'social-skills', 'emotional-regulation'];
  const labels: Record<string, string> = {
    math: 'Math', science: 'Science', english: 'English',
    'social-skills': 'Social Skills', 'emotional-regulation': 'Emotional Reg.',
  };

  const results = await Promise.all(
    subjects.map(async (s) => {
      try {
        const snap = await getDoc(doc(db, 'users', uid, 'subjectMastery', s));
        if (!snap.exists()) return { subject: labels[s], value: 0 };
        const data = snap.data();
        const scores = Object.values(data).map((v: unknown) => (v as { avgScore?: number }).avgScore ?? 0);
        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        return { subject: labels[s], value: Math.round(avg) };
      } catch {
        return { subject: labels[s], value: 0 };
      }
    })
  );
  return results;
}

/* ── Emotion Log ── */

export async function getEmotionLog(uid: string) {
  const q = query(collection(db, 'users', uid, 'emotionLog'), orderBy('timestamp', 'desc'), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getEmotionHeatmap(uid: string): Promise<{ day: string; emotion: string; count: number }[]> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, 'users', uid, 'emotionLog'),
      where('timestamp', '>=', sevenDaysAgo.toISOString()),
      orderBy('timestamp', 'desc'),
    );
    const snap = await getDocs(q);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts: Record<string, Record<string, number>> = {};

    snap.docs.forEach((d) => {
      const data = d.data();
      const date = new Date(data.timestamp);
      const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      if (!counts[day]) counts[day] = {};
      counts[day][data.emotion] = (counts[day][data.emotion] ?? 0) + 1;
    });

    const result: { day: string; emotion: string; count: number }[] = [];
    days.forEach((day) => {
      ['happy', 'neutral', 'frustrated', 'anxious'].forEach((emotion) => {
        result.push({ day, emotion, count: counts[day]?.[emotion] ?? 0 });
      });
    });
    return result;
  } catch {
    return [];
  }
}

/* ── Weekly Progress ── */

export async function getWeeklyProgress(uid: string) {
  try {
    const q = query(collection(db, 'users', uid, 'sessions'), orderBy('timestamp', 'desc'), limit(28));
    const snap = await getDocs(q);

    const weeks: Record<string, Record<string, number[]>> = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      const date = new Date(data.timestamp);
      const weekNum = Math.ceil(date.getDate() / 7);
      const weekKey = `W${weekNum} ${date.toLocaleString('default', { month: 'short' })}`;
      if (!weeks[weekKey]) weeks[weekKey] = {};
      if (!weeks[weekKey][data.subject]) weeks[weekKey][data.subject] = [];
      const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      weeks[weekKey][data.subject].push(pct);
    });

    return Object.entries(weeks).slice(0, 4).reverse().map(([week, subjects]) => {
      const point: Record<string, unknown> = { week };
      Object.entries(subjects).forEach(([subj, scores]) => {
        point[subj] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      });
      return point;
    });
  } catch {
    return [];
  }
}

/* ── Social Skills ── */

export async function logSocialSkillScore(uid: string, score: number, total: number) {
  await addDoc(collection(db, 'users', uid, 'sessions'), {
    subject: 'social-skills', correct: score, total,
    xpEarned: score * 10, timestamp: new Date().toISOString(),
  });
}

/* ── Parent ── */

export async function linkChildToParent(parentUid: string, childUid: string) {
  await updateDoc(doc(db, 'users', parentUid), { childUid });
}

// Multi-child: add child by UID to childUids array
export async function addChildToParent(parentUid: string, childUid: string) {
  await updateDoc(doc(db, 'users', parentUid), {
    childUids: arrayUnion(childUid),
    // Also keep childUid for backward compat (first child)
    childUid: childUid,
  });
}

// Multi-child: remove child
export async function removeChildFromParent(parentUid: string, childUid: string) {
  await updateDoc(doc(db, 'users', parentUid), {
    childUids: arrayRemove(childUid),
  });
}

// Find student by email (for parent linking)
export async function findStudentByEmail(email: string): Promise<UserProfile | null> {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email.trim().toLowerCase()),
    where('role', '==', 'student'),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as UserProfile;
}

/* ── Activity Tracking ── */

export async function updateActiveQuest(uid: string, questId: string, subject: string) {
  await updateDoc(doc(db, 'users', uid), {
    lastActiveQuest: questId,
    lastActiveSubject: subject,
    lastActiveTimestamp: new Date().toISOString(),
  });
}

export async function clearActiveQuest(uid: string) {
  await updateDoc(doc(db, 'users', uid), {
    lastActiveQuest: '',
    lastActiveSubject: '',
    lastActiveTimestamp: '',
  });
}

/* ── Class & Quest Approval System ── */

// Request approval for a quest (student side)
export async function requestQuestApproval(uid: string, questId: string) {
  await updateDoc(doc(db, 'users', uid), {
    pendingApprovals: arrayUnion(questId),
  });
}

// Approve a quest (parent side) — also removes from pending
export async function approveQuest(childUid: string, questId: string) {
  const updates: Record<string, unknown> = {
    approvedQuestIds: arrayUnion(questId),
    pendingApprovals: arrayRemove(questId),
  };
  await updateDoc(doc(db, 'users', childUid), updates);
}

// Remove pending approval request
export async function dismissApprovalRequest(childUid: string, questId: string) {
  await updateDoc(doc(db, 'users', childUid), {
    pendingApprovals: arrayRemove(questId),
  });
}

// Get pending approvals for a child
export async function getPendingApprovals(uid: string): Promise<string[]> {
  const profile = await getUserProfile(uid);
  return profile?.pendingApprovals ?? [];
}

// Check if a quest is approved
export async function isQuestApproved(uid: string, questId: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.approvedQuestIds?.includes(questId) ?? false;
}
