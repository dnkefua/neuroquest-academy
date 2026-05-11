// Admin/Teacher User Types

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AdminUser {
  id?: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  grade?: number;
  createdAt: string;
  lastActiveAt?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface School {
  id: string;
  name: string;
  location: string;
  country: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'pending';
  studentCount: number;
  teacherCount: number;
  createdAt: string;
  adminEmail: string;
  settings: {
    allowRegistration: boolean;
    requireApproval: boolean;
    maxStudentsPerClass: number;
  };
}

export interface Teacher extends AdminUser {
  role: 'teacher';
  schoolId: string;
  grade: number;
  assignedClassIds: string[];
  subjects: string[];
}

export interface Class {
  id: string;
  schoolId: string;
  teacherId: string;
  name: string;
  grade: number;
  subject: string;
  studentIds: string[];
  createdAt: string;
  settings: {
    language: 'EN' | 'AR';
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

export interface Student extends AdminUser {
  role: 'student';
  schoolId: string;
  classId: string;
  grade: number;
  parentId?: string;
  xp: number;
  streak: number;
  currentEmotion: 'happy' | 'neutral' | 'frustrated' | 'anxious';
  completedQuests: string[];
  lastActiveAt?: string;
}

// Analytics Types
export interface PlatformStats {
  totalStudents: number;
  totalSchools: number;
  totalTeachers: number;
  avgCompletion: number;
  aiSessions: number;
  activeToday: number;
}

export interface SchoolStats {
  schoolId: string;
  studentCount: number;
  activeStudents: number;
  avgMastery: number;
  weeklyGrowth: number;
}

export interface ClassStats {
  classId: string;
  studentCount: number;
  avgProgress: number;
  topPerformers: string[];
  needsAttention: string[];
}
