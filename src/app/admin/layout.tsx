'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, School, Users, BarChart3, Settings, 
  ChevronLeft, ChevronRight, LogOut, Bell, Shield, Zap
} from 'lucide-react';
import styles from './admin.module.css';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'schools', label: 'Schools', icon: School, path: '/admin/schools' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [aiHealth, setAiHealth] = useState<{ provider: string; latency: number } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.has('demo') || localStorage.getItem('admin_demo_mode') === 'true';
    setIsDemoMode(demo);
    setLoading(false);
    
    if (!demo) {
      checkAIAvailability();
    }
  }, []);

  async function checkAIAvailability() {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setAiHealth({ provider: data.aiProvider || 'gemini', latency: data.aiLatency || 0 });
      }
    } catch {
      setAiHealth(null);
    }
  }

  const isActive = (path: string) => 
    pathname === path || (path !== '/admin' && pathname.startsWith(path));

  const handleSetDemoMode = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem('admin_demo_mode', String(newMode));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div className="text-4xl animate-bounce">🧠</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <Shield className={styles.logoIcon} />
          {!collapsed && <span className={styles.logoText}>NeuroAdmin</span>}
        </div>

        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <div className={styles.demoBadge}>
            <Zap size={14} />
            {!collapsed && <span>Demo Mode</span>}
          </div>
        )}

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

        {/* AI Status */}
        {!collapsed && aiHealth && (
          <div className={styles.aiStatus}>
            <div className={styles.aiIndicator}>
              <Zap size={14} className={styles.aiOnline} />
              <span>Gemma4 ({aiHealth.latency}ms)</span>
            </div>
          </div>
        )}

        <div className={styles.sidebarFooter}>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
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
              {navItems.find(item => isActive(item.path))?.label || 'Admin'}
            </h1>
          </div>
          
          <div className={styles.headerRight}>
            <button 
              className={`${styles.demoToggle} ${isDemoMode ? styles.demoActive : ''}`}
              onClick={handleSetDemoMode}
            >
              <Zap size={16} />
              {isDemoMode ? 'Demo' : 'Live'}
            </button>
            
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>
            
            <div className={styles.adminProfile}>
              <div className={styles.avatar}>A</div>
              <div className={styles.adminInfo}>
                <span className={styles.adminName}>Admin User</span>
                <span className={styles.adminRole}>Super Admin</span>
              </div>
            </div>
            
            <button className={styles.iconBtn}>
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
