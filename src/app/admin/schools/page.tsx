'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Building2, MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

const schoolsData = [
  { id: '1', name: 'GEMS Modern Academy', location: 'Dubai', students: 342, teachers: 18, status: 'active', joined: '2024-09-01', plan: 'Professional' },
  { id: '2', name: 'Jumeirah English Speaking School', location: 'Dubai', students: 256, teachers: 14, status: 'active', joined: '2024-10-15', plan: 'Professional' },
  { id: '3', name: 'Nord Anglia International School', location: 'Dubai', students: 189, teachers: 12, status: 'active', joined: '2025-01-10', plan: 'Enterprise' },
  { id: '4', name: 'GEMS Wellington School', location: 'Abu Dhabi', students: 124, teachers: 8, status: 'pending', joined: '2025-03-20', plan: 'Starter' },
  { id: '5', name: 'American Academy for Girls', location: 'Sharjah', students: 98, teachers: 6, status: 'inactive', joined: '2024-06-01', plan: 'Starter' },
];

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredSchools = schoolsData.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage schools and their settings</p>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add School
        </button>
      </div>

      <div className={styles.statsGrid} style={{ marginBottom: '24px' }}>
        <div className={`${styles.statCard} ${styles.purple}`}><div className={styles.statValue}>24</div><div className={styles.statLabel}>Total Schools</div></div>
        <div className={`${styles.statCard} ${styles.green}`}><div className={styles.statValue}>21</div><div className={styles.statLabel}>Active</div></div>
        <div className={`${styles.statCard} ${styles.orange}`}><div className={styles.statValue}>3</div><div className={styles.statLabel}>Pending Setup</div></div>
        <div className={`${styles.statCard} ${styles.blue}`}><div className={styles.statValue}>2,847</div><div className={styles.statLabel}>Total Students</div></div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input type="text" placeholder="Search schools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.formInput} style={{ paddingLeft: '48px' }} />
        </div>
        <select className={styles.formSelect} style={{ width: '160px' }}><option>All Status</option><option>Active</option><option>Pending</option><option>Inactive</option></select>
        <select className={styles.formSelect} style={{ width: '160px' }}><option>All Plans</option><option>Starter</option><option>Professional</option><option>Enterprise</option></select>
      </div>

      <motion.div className={styles.tableContainer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className={styles.tableHeader}><h3 className={styles.tableTitle}>Schools</h3></div>
        <table className={styles.table}>
          <thead><tr><th>School</th><th>Location</th><th>Students</th><th>Teachers</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredSchools.map((school) => (
              <tr key={school.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: '#1E293B' }}>{school.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Joined {school.joined}</div>
                    </div>
                  </div>
                </td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}><MapPin size={14} />{school.location}</div></td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} color="#64748B" />{school.students}</div></td>
                <td>{school.teachers}</td>
                <td><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: school.plan === 'Enterprise' ? '#EEF2FF' : school.plan === 'Professional' ? '#F0FDF4' : '#FEF3C7', color: school.plan === 'Enterprise' ? '#6366F1' : school.plan === 'Professional' ? '#059669' : '#D97706' }}>{school.plan}</span></td>
                <td><span className={`${styles.statusBadge} ${styles[school.status]}`}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: school.status === 'active' ? '#10B981' : school.status === 'pending' ? '#EAB308' : '#EF4444' }} />{school.status.charAt(0).toUpperCase() + school.status.slice(1)}</span></td>
                <td><div style={{ display: 'flex', gap: '8px' }}><button className={styles.iconBtn}><Eye size={16} /></button><button className={styles.iconBtn}><Edit size={16} /></button><button className={styles.iconBtn} style={{ color: '#EF4444' }}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Add New School</h2><button className={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}><label className={styles.formLabel}>School Name</label><input type="text" className={styles.formInput} placeholder="Enter school name" /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Location</label><input type="text" className={styles.formInput} placeholder="City, UAE" /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Plan</label><select className={styles.formSelect}><option>Starter</option><option>Professional</option><option>Enterprise</option></select></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Contact Email</label><input type="email" className={styles.formInput} placeholder="admin@school.edu" /></div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>Add School</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
