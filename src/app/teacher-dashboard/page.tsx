'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp, AlertTriangle, ChevronRight, BookOpen, Zap, Calendar } from 'lucide-react';
import { AnimatedTutor } from '@/components/explainer';
import styles from './teacher.module.css';

// Demo class data
const classesData = [
  { 
    id: '1', 
    name: '8A Mathematics', 
    subject: 'math',
    icon: '📐',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    studentCount: 28,
    activeStudents: 24,
    avgProgress: 72,
    needsAttention: 3,
    nextLesson: 'Linear Equations',
  },
  { 
    id: '2', 
    name: '8B Mathematics', 
    subject: 'math',
    icon: '📊',
    color: '#10B981',
    bgColor: '#ECFDF5',
    studentCount: 25,
    activeStudents: 22,
    avgProgress: 68,
    needsAttention: 2,
    nextLesson: 'Quadratic Functions',
  },
  { 
    id: '3', 
    name: '8A Science', 
    subject: 'science',
    icon: '🔬',
    color: '#F97316',
    bgColor: '#FFF7ED',
    studentCount: 30,
    activeStudents: 28,
    avgProgress: 75,
    needsAttention: 1,
    nextLesson: 'Chemical Reactions',
  },
];

const recentAlerts = [
  { id: 1, type: 'attention', student: 'Kai Chen', class: '8A Mathematics', message: 'Progress dropped 15% this week', time: '2 hours ago' },
  { id: 2, type: 'achievement', student: 'Mariam Al-Sayed', class: '8A Mathematics', message: 'Completed 10 quests with 90%+ accuracy', time: '4 hours ago' },
  { id: 3, type: 'emotion', student: 'James Wilson', class: '8B Mathematics', message: 'Showing frustrated patterns', time: '6 hours ago' },
];

export default function TeacherDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  return (
    <div>
      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Create Assignment
        </button>
        <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={() => setShowAIDemo(true)}>
          <Zap size={18} /> AI Lesson Generator
        </button>
        <button className={`${styles.actionBtn} ${styles.secondary}`}>
          <Calendar size={18} /> View Schedule
        </button>
      </div>

      {/* AI Demo Modal */}
      {showAIDemo && (
        <div className={styles.modalOverlay} onClick={() => setShowAIDemo(false)}>
          <motion.div 
            className={styles.modal}
            style={{ maxWidth: '900px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>AI Lesson Generator (Gemma4)</h2>
              <button className={styles.modalClose} onClick={() => setShowAIDemo(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <AnimatedTutor
                topic="Fractions"
                subject="math"
                grade={8}
                studentName="Your Class"
                onComplete={(lesson) => console.log('Lesson generated:', lesson)}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <motion.div 
          style={{ background: 'white', borderRadius: '16px', padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="#6366F1" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>83</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Students</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +5 this week
          </div>
        </motion.div>

        <motion.div 
          style={{ background: 'white', borderRadius: '16px', padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#ECFDF5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>12</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Active Lessons</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>3 classes</div>
        </motion.div>

        <motion.div 
          style={{ background: 'white', borderRadius: '16px', padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#FFF7ED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#F97316" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>71%</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Avg Progress</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +8% this week
          </div>
        </motion.div>

        <motion.div 
          style={{ background: 'white', borderRadius: '16px', padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>6</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Need Attention</div>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> 3 emotional alerts
          </div>
        </motion.div>
      </div>

      {/* Classes Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>My Classes</h2>
        <div className={styles.classGrid}>
          {classesData.map((cls, i) => (
            <motion.div 
              key={cls.id}
              className={styles.classCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => setSelectedClass(cls.id)}
            >
              <div className={styles.classHeader}>
                <div className={styles.classIcon} style={{ background: cls.bgColor }}>
                  {cls.icon}
                </div>
                <div className={styles.classInfo}>
                  <h3>{cls.name}</h3>
                  <span>Next: {cls.nextLesson}</span>
                </div>
              </div>
              <div className={styles.classStats}>
                <div className={styles.classStat}>
                  <div className={styles.classStatValue}>{cls.studentCount}</div>
                  <div className={styles.classStatLabel}>Students</div>
                </div>
                <div className={styles.classStat}>
                  <div className={styles.classStatValue}>{cls.activeStudents}</div>
                  <div className={styles.classStatLabel}>Active</div>
                </div>
                <div className={styles.classStat}>
                  <div className={styles.classStatValue}>{cls.avgProgress}%</div>
                  <div className={styles.classStatLabel}>Progress</div>
                </div>
              </div>
              {cls.needsAttention > 0 && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '8px 12px', 
                  background: '#FEF3C7', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertTriangle size={14} />
                  {cls.needsAttention} student(s) need attention
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div 
        style={{ marginTop: '32px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Recent Alerts</h2>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
          {recentAlerts.map((alert, i) => (
            <div 
              key={alert.id}
              style={{ 
                padding: '16px 24px', 
                borderBottom: i < recentAlerts.length - 1 ? '1px solid #F1F5F9' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: alert.type === 'attention' ? '#FEF3C7' : alert.type === 'achievement' ? '#ECFDF5' : '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {alert.type === 'attention' ? <AlertTriangle size={20} color="#F59E0B" /> : 
                 alert.type === 'achievement' ? <TrendingUp size={20} color="#10B981" /> :
                 <span style={{ fontSize: '1.2rem' }}>😔</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#1E293B' }}>{alert.student}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{alert.message}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{alert.time}</div>
              <button style={{ 
                padding: '8px 16px', 
                background: '#F1F5F9', 
                border: 'none', 
                borderRadius: '8px', 
                color: '#475569',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}>
                View
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Tutor Section */}
      <motion.div 
        className={styles.aiSection}
        style={{ marginTop: '32px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className={styles.aiHeader}>
          <div className={styles.aiIcon}>🤖</div>
          <div>
            <h3 className={styles.aiTitle}>AI Tutor Assistant</h3>
            <p className={styles.aiSubtitle}>Powered by Gemma4 - Generate personalized lessons and explanations</p>
          </div>
        </div>
        <div className={styles.aiFeatures}>
          <div className={styles.aiFeature}>
            <div className={styles.aiFeatureTitle}><Zap size={16} /> Lesson Generator</div>
            <p className={styles.aiFeatureDesc}>Create IB-aligned lessons with animated explanations in seconds</p>
          </div>
          <div className={styles.aiFeature}>
            <div className={styles.aiFeatureTitle}><BookOpen size={16} /> Smart Tutoring</div>
            <p className={styles.aiFeatureDesc}>AI explains concepts adapted to each student pace and learning style</p>
          </div>
          <div className={styles.aiFeature}>
            <div className={styles.aiFeatureTitle}><TrendingUp size={16} /> Progress Insights</div>
            <p className={styles.aiFeatureDesc}>Identify misconceptions and get AI recommendations for interventions</p>
          </div>
        </div>
      </motion.div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Assignment</h2>
              <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Assignment Title</label>
                <input type="text" className={styles.formInput} placeholder="e.g., Linear Equations Quiz" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Class</label>
                <select className={styles.formSelect}>
                  <option>8A Mathematics</option>
                  <option>8B Mathematics</option>
                  <option>8A Science</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Topic</label>
                <select className={styles.formSelect}>
                  <option>Algebraic Expressions</option>
                  <option>Linear Equations</option>
                  <option>Quadratic Functions</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Difficulty</label>
                <select className={styles.formSelect}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <input type="checkbox" style={{ marginRight: '8px' }} />
                  Use AI to generate questions
                </label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>Create Assignment</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
