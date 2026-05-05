'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { School, AdminUser, Class, PlatformStats } from '@/types/admin';

interface AdminContextType {
  schools: School[];
  users: AdminUser[];
  stats: PlatformStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  createSchool: (data: Omit<School, 'id' | 'createdAt'>) => Promise<string>;
  updateSchool: (schoolId: string, data: Partial<School>) => Promise<void>;
  deleteSchool: (schoolId: string) => Promise<void>;
  inviteUser: (email: string, role: string, schoolId?: string) => Promise<void>;
  createClass: (data: Omit<Class, 'id' | 'createdAt'>) => Promise<string>;
  isDemoMode: boolean;
  setDemoMode: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Demo data
const DEMO_SCHOOLS: School[] = [
  { id: '1', name: 'GEMS Modern Academy', location: 'Dubai', country: 'UAE', plan: 'professional', status: 'active', studentCount: 342, teacherCount: 18, createdAt: '2024-09-01', adminEmail: 'admin@gems.com', settings: { allowRegistration: true, requireApproval: false, maxStudentsPerClass: 30 } },
  { id: '2', name: 'Jumeirah English Speaking School', location: 'Dubai', country: 'UAE', plan: 'professional', status: 'active', studentCount: 256, teacherCount: 14, createdAt: '2024-10-15', adminEmail: 'admin@jess.com', settings: { allowRegistration: true, requireApproval: true, maxStudentsPerClass: 25 } },
  { id: '3', name: 'Nord Anglia International School', location: 'Dubai', country: 'UAE', plan: 'enterprise', status: 'active', studentCount: 189, teacherCount: 12, createdAt: '2025-01-10', adminEmail: 'admin@nordanglia.com', settings: { allowRegistration: true, requireApproval: false, maxStudentsPerClass: 35 } },
];

const DEMO_USERS: AdminUser[] = [
  { uid: '1', name: 'Sarah Mitchell', email: 'sarah.m@gems.com', role: 'teacher', schoolId: '1', createdAt: '2024-09-01', status: 'active' },
  { uid: '2', name: 'Ahmed Hassan', email: 'ahmed.h@norma.com', role: 'teacher', schoolId: '3', createdAt: '2024-10-01', status: 'active' },
  { uid: '3', name: 'Admin User', email: 'admin@ndn.com', role: 'admin', createdAt: '2024-01-01', status: 'active' },
];

const DEMO_STATS: PlatformStats = {
  totalStudents: 2847,
  totalSchools: 24,
  totalTeachers: 48,
  avgCompletion: 78,
  aiSessions: 14280,
  activeToday: 13,
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.has('demo') || localStorage.getItem('admin_demo_mode') === 'true';
    setIsDemoMode(demo);
    
    if (demo) {
      setSchools(DEMO_SCHOOLS);
      setUsers(DEMO_USERS);
      setStats(DEMO_STATS);
      setLoading(false);
    } else {
      loadData();
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { getFirestore, collection, getDocs, query } = await import('firebase/firestore');
      const { getFirebaseApp } = await import('@/lib/firebase-init');
      
      const app = getFirebaseApp();
      const db = getFirestore(app);
      
      const [schoolsSnap, usersSnap, statsData] = await Promise.all([
        getDocs(collection(db, 'schools')),
        getDocs(query(collection(db, 'users'))),
        getStats(),
      ]);
      
      setSchools(schoolsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as School[]));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() }) as AdminUser[]));
      setStats(statsData);
    } catch (err) {
      console.warn('Firebase not available, using demo data:', err);
      setSchools(DEMO_SCHOOLS);
      setUsers(DEMO_USERS);
      setStats(DEMO_STATS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }

  async function getStats(): Promise<PlatformStats> {
    return DEMO_STATS; // Simplified - would fetch from Firebase
  }

  const refreshStats = useCallback(async () => {
    if (isDemoMode) {
      setStats(DEMO_STATS);
      return;
    }
    const newStats = await getStats();
    setStats(newStats);
  }, [isDemoMode]);

  const createSchool = useCallback(async (data: Omit<School, 'id' | 'createdAt'>) => {
    if (isDemoMode) {
      const newSchool = { ...data, id: `school-${Date.now()}`, createdAt: new Date().toISOString() };
      setSchools(prev => [...prev, newSchool as School]);
      return newSchool.id;
    }
    throw new Error('Firebase not implemented');
  }, [isDemoMode]);

  const updateSchool = useCallback(async (schoolId: string, data: Partial<School>) => {
    if (isDemoMode) {
      setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, ...data } : s));
      return;
    }
  }, [isDemoMode]);

  const deleteSchool = useCallback(async (schoolId: string) => {
    if (isDemoMode) {
      setSchools(prev => prev.filter(s => s.id !== schoolId));
      return;
    }
  }, [isDemoMode]);

  const inviteUser = useCallback(async (email: string, role: string, schoolId?: string) => {
    console.log('Inviting:', email, role, schoolId);
  }, []);

  const createClass = useCallback(async (data: Omit<Class, 'id' | 'createdAt'>) => {
    return `class-${Date.now()}`;
  }, []);

  const handleSetDemoMode = useCallback((value: boolean) => {
    setIsDemoMode(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_demo_mode', String(value));
    }
    if (value) {
      setSchools(DEMO_SCHOOLS);
      setUsers(DEMO_USERS);
      setStats(DEMO_STATS);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        schools,
        users,
        stats,
        loading,
        error,
        refreshStats,
        createSchool: handleCreateSchool as any,
        updateSchool: handleUpdateSchool as any,
        deleteSchool: handleDeleteSchool as any,
        inviteUser: handleInviteUser as any,
        createClass: handleCreateClass as any,
        isDemoMode,
        setDemoMode: handleSetDemoMode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
