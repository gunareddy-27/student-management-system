import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const LibraryManagement = () => {
  const [activeTab, setActiveTab] = useState('bookshelf');
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [issueModal, setIssueModal] = useState(null);
  const [viewBook, setViewBook] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [form, setForm] = useState({ 
    book_name: '', author: '', isbn: '', category: 'Engineering', 
    description: '', cover_image: '', location: 'Main Block' 
  });

  const baseUrl = 'http://localhost:8080';
  const isAdmin = (localStorage.getItem('role') || 'student') === 'admin';
  const userId = localStorage.getItem('userId'); 

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Pending';
    if (date.getTime() === 0) return 'Pending';
    return date.toLocaleDateString();
  };

  const categories = ['All', 'Engineering', 'Science', 'Mathematics', 'Literature', 'History', 'Technology', 'Biography'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, studentsRes, historyRes, resRes] = await Promise.all([
        axios.get(`${baseUrl}/library`),
        axios.get(`${baseUrl}/students`),
        axios.get(`${baseUrl}/library/history`),
        axios.get(`${baseUrl}/library/reservations`)
      ]);
      setBooks(booksRes.data);
      setStudents(studentsRes.data);
      setHistory(historyRes.data);
      setReservations(resRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/library`, form);
      setShowAddModal(false);
      setForm({ book_name: '', author: '', isbn: '', category: 'Engineering', description: '', cover_image: '', location: 'Main Block' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleIssue = async () => {
    if (!selectedStudent || !issueModal || !returnDate) return;
    
    // 🛡️ FRONTEND SECURITY CHECK
    const student = students.find(s => s.id == selectedStudent);
    if (student && student.id_card_status !== 'Valid') {
      alert(`⚠️ SECURITY ALERT: Student ${student.name} has an ${student.id_card_status} ID card. Library access is suspended for this card status.`);
      return;
    }

    try {
      await axios.put(`${baseUrl}/library/${issueModal.id}/issue`, { 
        student_id: selectedStudent,
        return_date: returnDate
      });
      setIssueModal(null);
      setSelectedStudent('');
      setReturnDate('');
      fetchData();
    } catch (e) { 
      if (e.response && e.response.status === 403) {
        alert(e.response.data.error);
      } else {
        console.error(e); 
      }
    }
  };

  const handleReturn = async (id) => {
    try {
      const res = await axios.put(`${baseUrl}/library/${id}/return`);
      if (res.data.fine > 0) {
        alert(`Book returned! A fine of ₹${res.data.fine} has been recorded.`);
      }
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleReserve = async (bookId) => {
    try {
      await axios.post(`${baseUrl}/library/reserve`, { book_id: bookId, student_id: userId || 1 });
      alert('Reservation requested successfully!');
      fetchData();
    } catch (e) { console.error(e); }
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = (b.book_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (b.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const stats = {
    total: books.length,
    available: books.filter(b => !b.student_id).length,
    issued: books.filter(b => b.student_id).length,
    overdue: books.filter(b => b.return_date && new Date(b.return_date) < new Date()).length
  };

  if (loading && books.length === 0) return <div className="loading-spinner">Initializing Library Systems...</div>;

  return (
    <div className="library-container" style={{ color: 'var(--text-main)' }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          height: '220px', 
          borderRadius: '24px', 
          marginBottom: '2rem', 
          background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("/library_header.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 2.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Infinite Library</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', fontSize: '1rem', marginTop: '0.5rem' }}>
          Explore thousands of resources, track your learnings, and manage academic knowledge with AI-driven insights.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Volume', value: stats.total, icon: '📚', color: '#6366f1' },
          { label: 'In Stock', value: stats.available, icon: '🛡️', color: '#10b981' },
          { label: 'Active Loans', value: stats.issued, icon: '📖', color: '#f59e0b' },
          { label: 'Overdue', value: stats.overdue, icon: '⚠️', color: '#ef4444' }
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              backdropFilter: 'blur(10px)',
              padding: '1.5rem', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
            <div style={{ fontSize: '2rem', background: `${s.color}20`, padding: '0.75rem', borderRadius: '16px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        {['bookshelf', 'my_loans', 'activity_logs', 'reservations'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-dim)',
              padding: '0.6rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              textTransform: 'capitalize'
            }}>
            {tab.replace('_', ' ')}
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add New Resource
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'bookshelf' && (
          <motion.div key="shelf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search & Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Search by title, author, or ISBN..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: '1rem'
                  }}
                />
                <span style={{ position: 'absolute', left: '1.2rem', top: '1.1rem', opacity: 0.5 }}>🔍</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    style={{ 
                      whiteSpace: 'nowrap',
                      padding: '0.5rem 1rem', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: selectedCategory === cat ? '#818cf8' : 'var(--text-dim)',
                      cursor: 'pointer'
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {filteredBooks.map((book, i) => (
                <motion.div 
                  key={book.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative'
                  }}>
                  <div style={{ height: '360px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={book.cover_image || `https://images.unsplash.com/photo-1543005167-96c31046777c?auto=format&fit=crop&q=80&w=400`} 
                      alt={book.book_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ 
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: book.student_id ? '#ef4444' : '#10b981',
                      color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px',
                      fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase'
                    }}>
                      {book.student_id ? 'Issued' : 'Available'}
                    </div>
                    <div style={{ 
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                      padding: '2rem 1.5rem 1rem 1.5rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 'bold', marginBottom: '0.3rem' }}>{book.category}</div>
                      <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', lineHeight: '1.2' }}>{book.book_name}</h3>
                      <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>by {book.author}</p>
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setViewBook(book)}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                      Details
                    </button>
                    {isAdmin && !book.student_id && (
                      <button 
                        onClick={() => setIssueModal(book)}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        Issue
                      </button>
                    )}
                    {isAdmin && book.student_id && (
                      <button 
                        onClick={() => handleReturn(book.id)}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        Return
                      </button>
                    )}
                    {!isAdmin && book.student_id && (
                      <button 
                        onClick={() => handleReserve(book.id)}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        Reserve
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'my_loans' && (
          <motion.div key="loans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1.2rem' }}>Book Title</th>
                    <th style={{ padding: '1.2rem' }}>Borrowed Date</th>
                    <th style={{ padding: '1.2rem' }}>Due Date</th>
                    <th style={{ padding: '1.2rem' }}>Status</th>
                    <th style={{ padding: '1.2rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.filter(b => b.student_id == (userId || 1)).map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>{b.book_name}</td>
                      <td style={{ padding: '1.2rem' }}>{formatDate(b.borrowed_date)}</td>
                      <td style={{ padding: '1.2rem', color: (b.return_date && new Date(b.return_date) < new Date()) ? '#ef4444' : 'white' }}>
                        {formatDate(b.return_date)}
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        <span style={{ 
                          padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold',
                          background: (b.return_date && new Date(b.return_date) < new Date()) ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color: (b.return_date && new Date(b.return_date) < new Date()) ? '#ef4444' : '#10b981'
                        }}>
                          {(b.return_date && new Date(b.return_date) < new Date()) ? 'OVERDUE' : 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        <button style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                          Extend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity_logs' && (
          <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((h, i) => (
                <div key={i} style={{ 
                  background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔄</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{h.student_name} {h.return_date ? 'returned' : 'is reading'} "{h.book_name}"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Borrowed: {formatDate(h.borrow_date)} | Returned: {h.return_date ? formatDate(h.return_date) : 'In Progress'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: h.fine_paid > 0 ? '#ef4444' : '#10b981' }}>
                      Fine: ₹{h.fine_paid || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{h.return_date ? 'TRANSACTION COMPLETE' : 'ACTIVE LOAN'}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reservations' && (
          <motion.div key="reservations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reservations.map((r, i) => (
                <div key={i} style={{ 
                  background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔖</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{r.student_name} reserved "{r.book_name}"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Requested on: {new Date(r.request_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold',
                      background: 'rgba(245,158,11,0.1)', color: '#f59e0b'
                    }}>
                      PENDING
                    </span>
                  </div>
                </div>
              ))}
              {reservations.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No active reservations.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Book Details Modal */}
      <AnimatePresence>
        {viewBook && (
          <div className="modal-backdrop" onClick={() => setViewBook(null)} style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', width: '900px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '40%', height: '600px' }}>
                <img src={viewBook.cover_image || `https://images.unsplash.com/photo-1543005167-96c31046777c?auto=format&fit=crop&q=80&w=400`} alt={viewBook.book_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: '60%', padding: '3rem', position: 'relative' }}>
                <button onClick={() => setViewBook(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>{viewBook.category}</div>
                <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{viewBook.book_name}</h2>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>By {viewBook.author} | ISBN: {viewBook.isbn}</div>
                
                <p style={{ lineHeight: '1.6', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>
                  {viewBook.description || "This comprehensive resource provides in-depth knowledge and analysis of the subject matter. Ideal for advanced students and researchers seeking academic excellence."}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Location</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{viewBook.location || 'Main Block, Floor 2'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Availability</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: viewBook.student_id ? '#ef4444' : '#10b981' }}>
                      {viewBook.student_id ? 'Currently Issued' : 'Available to Borrow'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {!viewBook.student_id ? (
                    <button 
                      onClick={() => { setIssueModal(viewBook); setViewBook(null); }}
                      style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                      Borrow This Book
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleReserve(viewBook.id)}
                      style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: '#f59e0b', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                      Place Reservation
                    </button>
                  )}
                  <button style={{ padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer' }}>🔖</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Issue Modal */}
      <AnimatePresence>
        {issueModal && (
          <div className="modal-backdrop" onClick={() => setIssueModal(null)} style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '24px', width: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Issue Resource</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Select Student</label>
                <select 
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id} disabled={s.id_card_status !== 'Valid'}>
                      {s.name} (ID: {s.id}) {s.id_card_status !== 'Valid' ? `[${s.id_card_status}]` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Expected Return Date</label>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleIssue} disabled={!selectedStudent || !returnDate}
                  style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', opacity: (selectedStudent && returnDate) ? 1 : 0.5 }}>
                  Confirm Issue
                </button>
                <button onClick={() => setIssueModal(null)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-backdrop" onClick={() => setShowAddModal(false)} style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', padding: '2.5rem', borderRadius: '32px', width: '600px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Add New Resource</h2>
              <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <input placeholder="Book Title" value={form.book_name} onChange={e => setForm({...form, book_name: e.target.value})} required style={formInputStyle} />
                <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required style={formInputStyle} />
                <input placeholder="ISBN Number" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} required style={formInputStyle} />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={formInputStyle}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Cover Image URL" value={form.cover_image} onChange={e => setForm({...form, cover_image: e.target.value})} style={{...formInputStyle, gridColumn: '1 / -1'}} />
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...formInputStyle, gridColumn: '1 / -1', height: '100px'}} />
                <button type="submit" style={{ gridColumn: '1 / -1', padding: '1.2rem', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
                  Catalog New Resource
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .loading-spinner {
          display: flex; justify-content: center; align-items: center; height: 300px; font-weight: bold; color: var(--primary);
        }
        select option { background: #1a1a1a; color: white; }
      `}</style>
    </div>
  );
};

const formInputStyle = {
  padding: '0.9rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
};

export default LibraryManagement;
