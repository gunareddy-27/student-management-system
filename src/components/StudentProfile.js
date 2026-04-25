import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

const StudentProfile = ({ studentId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const baseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/students/${studentId}/profile`);
        setProfile(res.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    if (studentId) fetchProfile();
  }, [studentId]);

  if (!studentId) return null;

  if (loading) return (
    <div className="modal-backdrop">
      <div style={{ color: 'white' }}>Loading profile...</div>
    </div>
  );

  if (!profile) return null;

  const { student, enrollments, fees, books, attendance } = profile;
  const totalFee = fees.reduce((sum, f) => sum + Number(f.amount), 0);
  const paidFee = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + Number(f.amount), 0);
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attendancePct = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : student.attendance || 0;

  const sections = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'enrollments', label: '📚 Courses' },
    { id: 'fees', label: '💰 Fees' },
    { id: 'library', label: '📖 Library' },
    { id: 'attendance', label: '📋 Attendance' },
    { id: 'qrpass', label: '📇 QR Pass' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', padding: '0' }}
      >
        {/* Header */}
        <div style={{
          padding: '2rem 2rem 1.5rem', 
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ color: 'white', margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{student.name}</h2>
              <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.85rem' }}>{student.email}</p>
              <p style={{ color: 'var(--text-dim)', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>📞 {student.phone}</p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1.25rem' }}>
            {[
              { label: 'Attendance', value: `${attendancePct}%`, color: attendancePct >= 75 ? '#22c55e' : '#ef4444' },
              { label: 'Courses', value: enrollments.length, color: '#8b5cf6' },
              { label: 'Fee Paid', value: `₹${paidFee.toLocaleString()}`, color: '#22c55e' },
              { label: 'Books', value: books.length, color: '#3b82f6' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                flex: 1, padding: '0.75rem 0.5rem', background: 'transparent', border: 'none',
                borderBottom: activeSection === s.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeSection === s.id ? 'white' : 'var(--text-dim)',
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: activeSection === s.id ? '700' : '500'
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 2rem' }}>
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Student ID: #{student.id}</h4>
                <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.85rem' }}>
                  This student is enrolled in <strong style={{ color: 'white' }}>{enrollments.length} courses</strong>,
                  has <strong style={{ color: 'white' }}>{books.length} library books</strong> checked out,
                  and has paid <strong style={{ color: '#22c55e' }}>₹{paidFee.toLocaleString()}</strong> of <strong style={{ color: 'white' }}>₹{totalFee.toLocaleString()}</strong> total fees.
                </p>
              </div>
              {attendancePct < 75 && (
                <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  ⚠️ <strong style={{ color: '#fca5a5' }}>Low Attendance Warning:</strong>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '0.5rem' }}>This student is below the 75% attendance threshold.</span>
                </div>
              )}
            </div>
          )}

          {activeSection === 'enrollments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {enrollments.length === 0 ? <p style={{ color: 'var(--text-dim)' }}>No enrollments found.</p> : enrollments.map((e, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>{e.course_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{e.course_code} • {e.day_of_week} • {e.start_time}–{e.end_time}</div>
                  </div>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                    {e.class_type} • {e.room_number}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'fees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {fees.length === 0 ? <p style={{ color: 'var(--text-dim)' }}>No fee records.</p> : fees.map((f, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: f.status === 'Paid' ? '#22c55e' : '#ef4444', fontSize: '1rem' }}>₹{Number(f.amount).toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{f.payment_date ? new Date(f.payment_date).toLocaleDateString('en-IN') : 'No date'}</div>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold',
                    background: f.status === 'Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: f.status === 'Paid' ? '#22c55e' : '#ef4444'
                  }}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'library' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {books.length === 0 ? <p style={{ color: 'var(--text-dim)' }}>No books checked out.</p> : books.map((b, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>📖 {b.book_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    by {b.author} • ISBN: {b.isbn}
                    {b.return_date && <span style={{ marginLeft: '0.5rem', color: new Date(b.return_date) < new Date() ? '#ef4444' : 'var(--text-dim)' }}>
                      Due: {new Date(b.return_date).toLocaleDateString('en-IN')}
                    </span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {attendance.length === 0 ? <p style={{ color: 'var(--text-dim)' }}>No attendance records.</p> : attendance.slice(0, 30).map((a, i) => (
                <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{a.course_name} • {a.attendance_date ? new Date(a.attendance_date).toLocaleDateString('en-IN') : ''}</span>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold',
                    background: a.status === 'Present' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: a.status === 'Present' ? '#22c55e' : '#ef4444'
                  }}>{a.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'qrpass' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}
            >
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '4px solid #6366f1' }}>
                <QRCodeCanvas 
                  value={`STUDENT_ID:${student.id}|NAME:${student.name}|STATUS:VERIFIED`}
                  size={200}
                  level="H"
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>Verified Smart Passport</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', maxWidth: '300px' }}>
                  Scan this code at campus gates, libraries, or canteens for instant identity and payment verification.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
