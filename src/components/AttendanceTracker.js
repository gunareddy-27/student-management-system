import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AttendanceTracker = () => {
  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [atRisk, setAtRisk] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('analytics');
  const [form, setForm] = useState({ student_id: '', course_id: '', attendance_date: new Date().toISOString().split('T')[0], status: 'Present' });
  const baseUrl = 'http://localhost:8080';
  const isAdmin = (localStorage.getItem('role') || 'student') === 'admin';

  const fetchData = async () => {
    try {
      const [recRes, anaRes, riskRes, stuRes, couRes] = await Promise.all([
        axios.get(`${baseUrl}/attendance`),
        axios.get(`${baseUrl}/attendance/analytics`),
        axios.get(`${baseUrl}/attendance/at-risk`),
        axios.get(`${baseUrl}/students`),
        axios.get(`${baseUrl}/courses`)
      ]);
      setRecords(recRes.data);
      setAnalytics(anaRes.data);
      setAtRisk(riskRes.data);
      setStudents(stuRes.data);
      setCourses(couRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleMark = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/attendance`, form);
      setForm({ ...form, student_id: '', course_id: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>Loading attendance data...</p>;

  return (
    <div>
      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['analytics', 'at-risk', 'records'].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', width: 'auto',
              background: view === v ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: view === v ? 'white' : 'var(--text-dim)',
              border: view === v ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>
            {v === 'analytics' ? '📊 Analytics' : v === 'at-risk' ? '⚠️ At-Risk' : '📋 Records'}
          </button>
        ))}
      </div>

      {/* Mark Attendance Form */}
      {isAdmin && (
        <form onSubmit={handleMark} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>Student</label>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
              <option value="">Select</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>Course</label>
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
              <option value="">Select</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>Date</label>
            <input type="date" value={form.attendance_date} onChange={e => setForm({ ...form, attendance_date: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', width: 'auto' }}>
            ✓ Mark
          </button>
        </form>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {analytics.map((s, i) => {
            const pct = s.attendance_percentage || 0;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{
                  padding: '1rem 1.25rem', borderRadius: '12px',
                  background: pct < 75 ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${pct < 75 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `conic-gradient(${pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'} ${pct * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', color: 'white' }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#22c55e' }}>✓ {s.present_count || 0}</span>
                  <span style={{ color: '#ef4444' }}>✗ {s.absent_count || 0}</span>
                  <span style={{ color: 'var(--text-dim)' }}>Total: {s.total_classes || 0}</span>
                </div>
              </motion.div>
            );
          })}
          {analytics.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No attendance data yet. Start marking attendance above.</p>}
        </div>
      )}

      {/* At-Risk View */}
      {view === 'at-risk' && (
        <div>
          {atRisk.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: 'white' }}>All students are safe!</h3>
              <p>No students currently below 75% attendance threshold.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {atRisk.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{
                    padding: '1rem 1.25rem', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.02))',
                    border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#fca5a5', fontSize: '0.95rem' }}>⚠️ {s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.email} • {s.phone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>{s.attendance}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Overall Attendance</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Records View */}
      {view === 'records' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.4rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 1rem' }}>Student</th>
                <th style={{ padding: '0.5rem 1rem' }}>Course</th>
                <th style={{ padding: '0.5rem 1rem' }}>Date</th>
                <th style={{ padding: '0.5rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 50).map((r, i) => (
                <tr key={r.id || i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '0.6rem 1rem', fontWeight: '600' }}>{r.student_name || 'N/A'}</td>
                  <td style={{ padding: '0.6rem 1rem', color: 'var(--text-dim)' }}>{r.course_name || 'N/A'}</td>
                  <td style={{ padding: '0.6rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    {r.attendance_date ? new Date(r.attendance_date).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '0.6rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
                      background: r.status === 'Present' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: r.status === 'Present' ? '#22c55e' : '#ef4444'
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No attendance records yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
