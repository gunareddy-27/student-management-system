import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const LibraryManagement = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [issueModal, setIssueModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [form, setForm] = useState({ book_name: '', author: '', isbn: '' });
  const [returnDate, setReturnDate] = useState('');
  const [notifications, setNotifications] = useState([]);
  const baseUrl = 'http://localhost:8080';
  const FINE_PER_DAY = 10; // ₹10 per day fine
  const isAdmin = (localStorage.getItem('role') || 'student') === 'admin';

  const fetchData = async () => {
    try {
      const [booksRes, studentsRes] = await Promise.all([
        axios.get(`${baseUrl}/library`),
        axios.get(`${baseUrl}/students`)
      ]);
      setBooks(booksRes.data);
      setStudents(studentsRes.data);
      
      // Calculate notifications
      const now = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);

      const alerts = booksRes.data.filter(b => b.student_id && b.return_date).map(b => {
        const dueDate = new Date(b.return_date);
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          const fine = Math.abs(diffDays) * FINE_PER_DAY;
          return { type: 'overdue', msg: `OVERDUE: "${b.book_name}" was due on ${dueDate.toLocaleDateString()}. Fine: ₹${fine}`, book: b };
        } else if (diffDays <= 3) {
          return { type: 'upcoming', msg: `UPCOMING: "${b.book_name}" is due in ${diffDays} day(s) (${dueDate.toLocaleDateString()}). Fine of ₹${FINE_PER_DAY}/day if delayed.`, book: b };
        }
        return null;
      }).filter(a => a !== null);
      
      setNotifications(alerts);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/library`, form);
      setForm({ book_name: '', author: '', isbn: '' });
      setShowForm(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleIssue = async () => {
    if (!selectedStudent || !issueModal || !returnDate) return;
    try {
      await axios.put(`${baseUrl}/library/${issueModal.id}/issue`, { 
        student_id: selectedStudent,
        return_date: returnDate
      });
      setIssueModal(null);
      setSelectedStudent('');
      setReturnDate('');
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`${baseUrl}/library/${id}/return`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`${baseUrl}/library/${id}`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const filtered = books.filter(b =>
    (b.book_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.isbn || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const available = books.filter(b => !b.student_id).length;
  const issued = books.filter(b => b.student_id).length;
  const overdue = books.filter(b => b.return_date && new Date(b.return_date) < new Date()).length;

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>Loading library...</p>;

  return (
    <div>
      {/* Notifications System */}
      {notifications.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'white', fontWeight: 'bold' }}>
            <span>🔔</span> Library Notifications
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map((n, i) => (
              <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  background: n.type === 'overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${n.type === 'overdue' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                  color: n.type === 'overdue' ? '#fca5a5' : '#fcd34d',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <span>{n.msg}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{n.type.toUpperCase()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Books', value: books.length, icon: '📚', color: '#8b5cf6' },
          { label: 'Available', value: available, icon: '✅', color: '#22c55e' },
          { label: 'Issued', value: issued, icon: '📖', color: '#3b82f6' },
          { label: 'Overdue', value: overdue, icon: '⏰', color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input type="text" placeholder="Search books, authors, ISBN..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }} />
          <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--text-muted)' }}>🔍</span>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', width: 'auto' }}>
            {showForm ? '✖ Close' : '➕ Add Book'}
          </button>
        )}
      </div>

      {/* Add Book Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <input type="text" placeholder="Book Name" value={form.book_name} onChange={e => setForm({ ...form, book_name: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
            <input type="text" placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
            <input type="text" placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
            <button type="submit" style={{ gridColumn: '1 / -1', padding: '0.6rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Add Book to Catalog
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Issue Modal */}
      <AnimatePresence>
        {issueModal && (
          <div className="modal-backdrop" onClick={() => setIssueModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>📖 Issue: {issueModal.book_name}</h3>
              <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
              </select>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Specify Return Date:</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#fcd34d' }}>
                  ⚠️ A fine of <strong>₹{FINE_PER_DAY}</strong> will be applied for each day of delay beyond the return date.
                </p>
              </div>

              <div className="modal-actions">
                <button onClick={handleIssue} disabled={!selectedStudent || !returnDate} className="primary"
                  style={{ opacity: (selectedStudent && returnDate) ? 1 : 0.5 }}>Issue Book</button>
                <button onClick={() => setIssueModal(null)} className="secondary">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Books Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((book, i) => (
          <motion.div key={book.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{
              padding: '1.25rem', borderRadius: '16px',
              background: book.student_id ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${book.student_id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', flexDirection: 'column', gap: '0.5rem'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, color: 'white', fontSize: '0.95rem', flex: 1 }}>{book.book_name}</h4>
              <span style={{
                padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 'bold', flexShrink: 0,
                background: book.student_id ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)',
                color: book.student_id ? '#60a5fa' : '#86efac'
              }}>
                {book.student_id ? 'ISSUED' : 'AVAILABLE'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>by {book.author}</p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>ISBN: {book.isbn}</p>
            {book.student_id && (
              <div style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginTop: '0.25rem' }}>
                <div>📌 Issued to: <strong style={{ color: 'white' }}>{book.student_name || 'Unknown'}</strong></div>
                {book.borrowed_date && <div>📅 Borrowed: {new Date(book.borrowed_date).toLocaleDateString('en-IN')}</div>}
                {book.return_date && (
                  <div style={{ color: new Date(book.return_date) < new Date() ? '#ef4444' : 'var(--text-dim)' }}>
                    ⏰ Due: {new Date(book.return_date).toLocaleDateString('en-IN')}
                    {new Date(book.return_date) < new Date() ? (
                      <span style={{ fontWeight: 'bold', marginLeft: '0.25rem' }}>
                        (OVERDUE! Fine: ₹{Math.ceil(Math.abs(new Date() - new Date(book.return_date)) / (1000 * 60 * 60 * 24)) * FINE_PER_DAY})
                      </span>
                    ) : ''}
                  </div>
                )}
              </div>
            )}
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {!book.student_id ? (
                  <button onClick={() => setIssueModal(book)}
                    style={{ flex: 1, padding: '0.4rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Issue
                  </button>
                ) : (
                  <button onClick={() => handleReturn(book.id)}
                    style={{ flex: 1, padding: '0.4rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Return
                  </button>
                )}
                <button onClick={() => handleDelete(book.id)}
                  style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', width: 'auto' }}>
                  🗑️
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No books found.</p>}
    </div>
  );
};

export default LibraryManagement;
