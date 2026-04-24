import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EnrollmentManager = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: '', course_id: '', day_of_week: 'MONDAY', start_time: '09:00', end_time: '10:00', room_number: '', class_type: 'Lecture' });
  const baseUrl = 'http://localhost:8080';
  const isAdmin = (localStorage.getItem('role') || 'student') === 'admin';

  const fetchData = async () => {
    try {
      const [enRes, stuRes, couRes] = await Promise.all([
        axios.get(`${baseUrl}/enrollments`),
        axios.get(`${baseUrl}/students`),
        axios.get(`${baseUrl}/courses`)
      ]);
      setEnrollments(enRes.data);
      setStudents(stuRes.data);
      setCourses(couRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/enrollments`, form);
      setForm({ student_id: '', course_id: '', day_of_week: 'MONDAY', start_time: '09:00', end_time: '10:00', room_number: '', class_type: 'Lecture' });
      setShowForm(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this enrollment?')) return;
    try {
      await axios.delete(`${baseUrl}/enrollments/${id}`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  // Group enrollments by student
  const grouped = enrollments.reduce((acc, e) => {
    const key = e.student_name || `Student #${e.student_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const inputStyle = { padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', width: '100%' };

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>Loading enrollments...</p>;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Enrollments', value: enrollments.length, color: '#8b5cf6' },
          { label: 'Students Enrolled', value: Object.keys(grouped).length, color: '#3b82f6' },
          { label: 'Courses Offered', value: courses.length, color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', flex: 1, minWidth: '150px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Enrollment */}
      {isAdmin && (
        <button onClick={() => setShowForm(!showForm)}
          style={{ marginBottom: '1rem', padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
          {showForm ? '✖ Close' : '➕ New Enrollment'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required style={inputStyle}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} required style={inputStyle}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>)}
          </select>
          <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} style={inputStyle}>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} style={inputStyle} />
          <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Room Number" value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} style={inputStyle} />
          <select value={form.class_type} onChange={e => setForm({ ...form, class_type: e.target.value })} style={inputStyle}>
            <option value="Lecture">Lecture</option>
            <option value="Lab">Lab</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Seminar">Seminar</option>
          </select>
          <button type="submit" style={{ gridColumn: 'span 2', padding: '0.6rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Enroll Student
          </button>
        </form>
      )}

      {/* Grouped Enrollments */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No enrollments found.</p>
      ) : (
        Object.entries(grouped).map(([studentName, enrs], idx) => (
          <motion.div key={studentName} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            style={{
              marginBottom: '1rem', padding: '1.25rem', borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'
            }}>
            <h4 style={{ color: 'white', margin: '0 0 0.75rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👤 {studentName}
              <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                {enrs.length} courses
              </span>
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {enrs.map(e => (
                <div key={e.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: '600', color: 'white', fontSize: '0.85rem' }}>{e.course_name}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({e.course_code})</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                      {e.day_of_week} • {e.start_time}–{e.end_time} • Room {e.room_number} • {e.class_type}
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(e.id)}
                      style={{ padding: '0.3rem 0.5rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', width: 'auto' }}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default EnrollmentManager;
