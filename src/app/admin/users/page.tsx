'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, UserPlus, Mail, GraduationCap, User, Shield } from 'lucide-react';
import styles from '../admin.module.css';

const usersData = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah.m@gems.com', role: 'teacher', school: 'GEMS Modern Academy', grade: '8', status: 'active', lastActive: '2 hours ago' },
  { id: '2', name: 'Ahmed Hassan', email: 'ahmed.h@norma.com', role: 'teacher', school: 'Nord Anglia', grade: '8', status: 'active', lastActive: '1 day ago' },
  { id: '3', name: 'Fatima Al-Rashid', email: 'fatima@ndn.com', role: 'admin', school: 'NDN Analytics', grade: '-', status: 'active', lastActive: '5 min ago' },
  { id: '4', name: 'Kai Chen', email: 'kai.c@student.com', role: 'student', school: 'GEMS Modern Academy', grade: '8', status: 'active', lastActive: '30 min ago' },
  { id: '5', name: 'Mariam Al-Sayed', email: 'mariam.a@student.com', role: 'student', school: 'JESS', grade: '7', status: 'inactive', lastActive: '3 days ago' },
  { id: '6', name: 'James Wilson', email: 'james.w@student.com', role: 'student', school: 'GEMS Wellington', grade: '8', status: 'active', lastActive: '1 hour ago' },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={16} />;
      case 'teacher': return <GraduationCap size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage teachers, students, and administrators</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowInviteModal(true)}>
            <Mail size={18} /> Invite Users
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid} style={{ marginBottom: '24px' }}>
        <div className={`${styles.statCard} ${styles.purple}`}><div className={styles.statValue}>847</div><div className={styles.statLabel}>Total Users</div></div>
        <div className={`${styles.statCard} ${styles.blue}`}><div className={styles.statValue}>48</div><div className={styles.statLabel}>Teachers</div></div>
        <div className={`${styles.statCard} ${styles.green}`}><div className={styles.statValue}>786</div><div className={styles.statLabel}>Students</div></div>
        <div className={`${styles.statCard} ${styles.orange}`}><div className={styles.statValue}>13</div><div className={styles.statLabel}>Active Now</div></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.formInput} style={{ paddingLeft: '48px' }} />
        </div>
        <select className={styles.formSelect} style={{ width: '160px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <select className={styles.formSelect} style={{ width: '160px' }}>
          <option>All Schools</option>
          <option>GEMS Modern Academy</option>
          <option>JESS</option>
          <option>Nord Anglia</option>
        </select>
      </div>

      {/* Users Table */}
      <motion.div className={styles.tableContainer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className={styles.tableHeader}><h3 className={styles.tableTitle}>Users</h3></div>
        <table className={styles.table}>
          <thead><tr><th>User</th><th>Role</th><th>School</th><th>Grade</th><th>Last Active</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: user.role === 'admin' ? '#FEE2E2' : user.role === 'teacher' ? '#EEF2FF' : '#F0FDF4', color: user.role === 'admin' ? '#DC2626' : user.role === 'teacher' ? '#6366F1' : '#10B981' }}>
                      {roleIcon(user.role)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: '#1E293B' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: user.role === 'admin' ? '#FEE2E2' : user.role === 'teacher' ? '#EEF2FF' : '#F0FDF4', color: user.role === 'admin' ? '#DC2626' : user.role === 'teacher' ? '#6366F1' : '#10B981', textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ color: '#64748B' }}>{user.school}</td>
                <td style={{ color: '#64748B' }}>{user.grade}</td>
                <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{user.lastActive}</td>
                <td><span className={`${styles.statusBadge} ${user.status === 'active' ? styles.active : styles.inactive}`}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.status === 'active' ? '#10B981' : '#EF4444' }} />{user.status}</span></td>
                <td><button className={`${styles.btn} ${styles.btnSecondary}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInviteModal(false)}>
          <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Invite Users</h2><button className={styles.modalClose} onClick={() => setShowInviteModal(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}><label className={styles.formLabel}>Email Addresses</label><textarea className={styles.formInput} rows={3} placeholder="Enter emails, one per line" style={{ resize: 'vertical' }} /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>Role</label><select className={styles.formSelect}><option>Teacher</option><option>Admin</option></select></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>School</label><select className={styles.formSelect}><option>GEMS Modern Academy</option><option>JESS</option></select></div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`}><Mail size={16} /> Send Invites</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
