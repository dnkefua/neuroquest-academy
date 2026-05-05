'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, BookOpen, ClipboardList, 
  MessageSquare, Settings, ChevronLeft, ChevronRight, Bell, Zap, LogOut
} from 'lucide-react';
import styles from './teacher.module.css';

const navItems = [
  { id: 'overview', label: 'My Classes', icon: LayoutDashboard, path: '/teacher-dashboard' },
  { id: 'students', label: 'Students', icon: Users, path: '/teacher-dashboard/students' },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/teacher-dashboard/assignments' },
  { id: 'ai-tutor', label: 'AI Tutor', icon: MessageSquare, path: '/teacher-dashboard/ai-tutor' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/teacher-dashboard/settings' },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path || (path !== '/teacher-dashboard' && pathname.startsWith(path));

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          {!collapsed && <span className={styles.logoText}>NeuroTeach</span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={styles.navIcon} />
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              {isActive(item.path) && <motion.div className={styles.activeIndicator} layoutId="activeIndicator" />}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {navItems.find(item => isActive(item.path))?.label || 'Teacher Dashboard'}
            </h1>
          </div>
          
          <div className={styles.headerRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.badge}>2</span>
            </button>
            
            <div className={styles.teacherProfile}>
              <div className={styles.avatar}>SM</div>
              <div className={styles.teacherInfo}>
                <span className={styles.teacherName}>Sarah Mitchell</span>
                <span className={styles.teacherSubject}>Grade 8 Math</span>
              </div>
            </div>
            
            <button className={styles.iconBtn} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
