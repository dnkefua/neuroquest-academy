'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile, EmotionKey } from '@/types';

interface StudentContextType {
  user: { uid: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateEmotion: (emotion: EmotionKey) => Promise<void>;
  logSession: (data: { subject: string; correct: number; total: number; xpEarned: number }) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDemoMode: boolean;
  setDemoMode: (value: boolean) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Demo profile for testing
const demoProfile: UserProfile = {
  uid: 'demo-student-001',
  name: 'Demo Student',
  email: 'demo@neuroquest.app',
  role: 'student',
  grade: 8,
  language: 'EN',
  xp: 2450,
  streak: 7,
  currentEmotion: 'happy',
  createdAt: new Date().toISOString(),
  studentClass: 'math',
  approvedQuestIds: ['g8-math-1', 'g8-math-2', 'g8-science-1'],
  completedQuests: ['g8-math-1', 'g8-math-2'],
};

export function StudentProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize on mount
  useEffect(() => {
    // Check for demo mode from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const isDemo = urlParams.has('demo') || localStorage.getItem('student_demo_mode') === 'true';
    setIsDemoMode(isDemo);

    if (isDemo) {
      // Demo mode: use mock data
      setUser({ uid: 'demo-student-001' });
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    // Try to initialize Firebase auth
    const initFirebase = async () => {
      try {
        const { onAuthStateChanged, getAuth } = await import('firebase/auth');
        const { getFirebaseApp } = await import('@/lib/firebase-init');
        
        const app = getFirebaseApp();
        const auth = getAuth(app);
        
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({ uid: firebaseUser.uid });
            // Fetch profile from Firestore
            loadProfile(firebaseUser.uid);
          } else {
            // No user logged in - redirect to auth or use demo
            setUser(null);
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Firebase not available, using demo mode:', err);
        setUser({ uid: 'demo-user' });
        setProfile(demoProfile);
        setIsDemoMode(true);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const loadProfile = async (uid: string) => {
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const { getFirebaseApp } = await import('@/lib/firebase-init');
      
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const profileDoc = await getDoc(doc(db, 'users', uid));
      
      if (profileDoc.exists()) {
        setProfile(profileDoc.data() as UserProfile);
      } else {
        // Create new profile
        const newProfile = { ...demoProfile, uid };
        setProfile(newProfile);
      }
      setLoading(false);
    } catch (err) {
      console.warn('Could not load profile, using demo:', err);
      setProfile(demoProfile);
      setIsDemoMode(true);
      setLoading(false);
    }
  };

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (isDemoMode) {
      setProfile(prev => prev ? { ...prev, ...data } : null);
      return;
    }
    // Update in Firestore
    try {
      const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
      const { getFirebaseApp } = await import('@/lib/firebase-init');
      const app = getFirebaseApp();
      const db = getFirestore(app);
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), data);
        setProfile(prev => prev ? { ...prev, ...data } : null);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  }, [user, isDemoMode]);

  const updateEmotion = useCallback(async (emotion: EmotionKey) => {
    if (isDemoMode) {
      setProfile(prev => prev ? { ...prev, currentEmotion: emotion } : null);
      return;
    }
    try {
      const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
      const { getFirebaseApp } = await import('@/lib/firebase-init');
      const app = getFirebaseApp();
      const db = getFirestore(app);
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { currentEmotion: emotion });
        setProfile(prev => prev ? { ...prev, currentEmotion: emotion } : null);
      }
    } catch (err) {
      console.error('Error updating emotion:', err);
    }
  }, [user, isDemoMode]);

  const logSession = useCallback(async (data: { subject: string; correct: number; total: number; xpEarned: number }) => {
    if (isDemoMode) {
      setProfile(prev => prev ? { ...prev, xp: (prev.xp || 0) + data.xpEarned } : null);
      return;
    }
    // Log session to Firestore
    try {
      const { getFirestore, doc, updateDoc, addDoc, collection } = await import('firebase/firestore');
      const { getFirebaseApp } = await import('@/lib/firebase-init');
      const app = getFirebaseApp();
      const db = getFirestore(app);
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'sessions'), {
          ...data,
          timestamp: new Date().toISOString(),
        });
        const newXP = (profile?.xp || 0) + data.xpEarned;
        await updateDoc(doc(db, 'users', user.uid), { xp: newXP });
        setProfile(prev => prev ? { ...prev, xp: newXP } : null);
      }
    } catch (err) {
      console.error('Error logging session:', err);
    }
  }, [user, profile, isDemoMode]);

  const refreshProfile = useCallback(async () => {
    if (user && !isDemoMode) {
      loadProfile(user.uid);
    }
  }, [user, isDemoMode]);

  const setDemoMode = useCallback((value: boolean) => {
    setIsDemoMode(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('student_demo_mode', String(value));
      if (value) {
        setUser({ uid: 'demo-user' });
        setProfile(demoProfile);
      }
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        updateProfile,
        updateEmotion,
        logSession,
        refreshProfile,
        isDemoMode,
        setDemoMode,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
