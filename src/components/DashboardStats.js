import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const baseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/stats`);
        setStats(res.data);
      } catch (e) { console.error(e); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' },
    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))' },
    { label: 'Enrollments', value: stats.totalEnrollments, icon: '📝', color: '#22c55e', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' },
    { label: 'Library Books', value: `${stats.issuedBooks}/${stats.totalBooks}`, icon: '📖', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' },
    { label: 'Fee Collected', value: `₹${Number(stats.feePaid).toLocaleString()}`, icon: '💰', color: '#22c55e', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' },
    { label: 'Fee Pending', value: `₹${Number(stats.feePending).toLocaleString()}`, icon: '⚠️', color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))' },
    { label: 'At-Risk Students', value: stats.atRiskStudents, icon: '🔴', color: stats.atRiskStudents > 0 ? '#ef4444' : '#22c55e', gradient: stats.atRiskStudents > 0 ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))' : 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' },
    { label: 'Active SOS', value: stats.activeAlerts, icon: '🚨', color: stats.activeAlerts > 0 ? '#ef4444' : '#22c55e', gradient: stats.activeAlerts > 0 ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))' : 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' },
    { label: 'Upcoming Returns', value: stats.upcomingReturns, icon: '📅', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' },
    { label: 'Overdue Books', value: stats.overdueReturns, icon: '⏰', color: stats.overdueReturns > 0 ? '#ef4444' : '#22c55e', gradient: stats.overdueReturns > 0 ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))' : 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' },
    { label: 'Placed Students', value: stats.placedStudents, icon: '🎓', color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' },
    { label: 'Active Drives', value: stats.activeDrives, icon: '🚀', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
          style={{
            padding: '1.25rem', borderRadius: '16px',
            background: card.gradient,
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'default', position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: card.color, lineHeight: 1 }}>{card.value}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem', fontWeight: '500' }}>{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
