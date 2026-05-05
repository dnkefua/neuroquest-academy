'use client';

import { motion } from 'framer-motion';
import { 
  Users, School, TrendingUp, Clock, 
  Award, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styles from './admin.module.css';

// Demo data
const statsData = [
  { label: 'Total Students', value: '2,847', change: '+12%', positive: true, icon: Users },
  { label: 'Active Schools', value: '24', change: '+2', positive: true, icon: School },
  { label: 'Avg. Completion', value: '78%', change: '+5%', positive: true, icon: TrendingUp },
  { label: 'AI Tutor Sessions', value: '14.2K', change: '-3%', positive: false, icon: Clock },
];

const activityData = [
  { date: 'Mon', students: 420, quests: 890 },
  { date: 'Tue', students: 510, quests: 1020 },
  { date: 'Wed', students: 480, quests: 950 },
  { date: 'Thu', students: 550, quests: 1100 },
  { date: 'Fri', students: 620, quests: 1240 },
  { date: 'Sat', students: 380, quests: 760 },
  { date: 'Sun', students: 290, quests: 580 },
];

const subjectPerformance = [
  { subject: 'Math', mastery: 72 },
  { subject: 'Science', mastery: 68 },
  { subject: 'English', mastery: 81 },
  { subject: 'Arabic', mastery: 65 },
];

const recentActivity = [
  { id: 1, action: 'New student enrolled', target: 'GEMS Modern Academy', time: '5 min ago', type: 'enrollment' },
  { id: 2, action: 'Teacher assigned', target: 'Grade 8 Math class', time: '12 min ago', type: 'assignment' },
  { id: 3, action: 'AI content generated', target: 'Chemistry Quest #14', time: '25 min ago', type: 'content' },
  { id: 4, action: 'Alert: Low engagement', target: '3 students in JESS', time: '1 hour ago', type: 'alert' },
  { id: 5, action: 'Progress report sent', target: '24 parents', time: '2 hours ago', type: 'report' },
];

export default function AdminOverview() {
  return (
    <div>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`${styles.statCard} ${['purple', 'blue', 'green', 'orange'][i]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.statIcon}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
              {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stat.change} this week
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Activity Chart */}
        <motion.div 
          className={styles.chartContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={styles.chartTitle}>Weekly Learning Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="students" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
              <Area type="monotone" dataKey="quests" stroke="#10B981" strokeWidth={2} fillOpacity={0.3} fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Performance */}
        <motion.div 
          className={styles.chartContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={styles.chartTitle}>Mastery by Subject</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" fontSize={12} />
              <YAxis dataKey="subject" type="category" stroke="#94A3B8" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none' }}
                formatter={(value: number) => [`${value}%`, 'Mastery']}
              />
              <Bar dataKey="mastery" fill="url(#barGradient)" radius={[0, 8, 8, 0]} barSize={32} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Activity */}
        <motion.div 
          className={styles.tableContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Recent Activity</h3>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>View All</button>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {recentActivity.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '12px 0',
                borderBottom: '1px solid #F1F5F9'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: item.type === 'alert' ? '#FEE2E2' : '#EEF2FF',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: item.type === 'alert' ? '#DC2626' : '#6366F1'
                }}>
                  {item.type === 'alert' ? <AlertTriangle size={20} /> : <Award size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#1E293B' }}>{item.action}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{item.target}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.time}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className={styles.tableContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Quick Actions</h3>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ justifyContent: 'flex-start' }}>
              <School size={18} />
              Add New School
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
              <Users size={18} />
              Invite Teachers
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
              <TrendingUp size={18} />
              Generate Reports
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ justifyContent: 'flex-start' }}>
              <Award size={18} />
              Create Quest Template
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
