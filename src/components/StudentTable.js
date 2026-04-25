import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

const StudentTable = ({ students, onEdit, onDelete, onBulkDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);
  
  const userRole = localStorage.getItem("role") || "student";
  const isAdmin = userRole === "admin";
  
  const rowsPerPage = 5;

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map(s => s.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredStudents = useMemo(() => {
    let data = students.filter(
      (s) =>
        (s.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (s.email || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    data = data.filter((student) => {
      const attendance = student.attendance ?? -1;
      switch (attendanceFilter) {
        case 'high': return attendance >= 90;
        case 'medium': return attendance >= 70 && attendance < 90;
        case 'low': return attendance >= 0 && attendance < 70;
        default: return true;
      }
    });

    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === 'attendance') {
          return sortOrder === 'asc'
            ? (a.attendance || 0) - (b.attendance || 0)
            : (b.attendance || 0) - (a.attendance || 0);
        } else {
          return sortOrder === 'asc'
            ? (a[sortField] || '').localeCompare(b[sortField] || '')
            : (b[sortField] || '').localeCompare(a[sortField] || '');
        }
      });
    }

    return data;
  }, [students, searchTerm, sortField, sortOrder, attendanceFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  return (
    <div className="table-wrapper">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Global search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}
        />

        <select 
          value={attendanceFilter} 
          onChange={(e) => setAttendanceFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Attendance</option>
          <option value="high">Distinction (90%+)</option>
          <option value="medium">Standard (70-89%)</option>
          <option value="low">At Risk (&lt;70%)</option>
        </select>

        {isAdmin && (
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => onBulkDelete(selectedIds)}
                className="danger"
                style={{ width: 'auto', padding: '0.6rem 1.2rem' }}
              >
                🗑️ Delete ({selectedIds.length})
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {isAdmin && (
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedStudents.length}
                    onChange={toggleSelectAll}
                    style={{ width: '18px', height: '18px', margin: 0 }}
                  />
                </th>
              )}
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID ↕</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name ↕</th>
              <th onClick={() => handleSort('attendance')} style={{ cursor: 'pointer' }}>Progress ↕</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedStudents.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No student records matching your filter.
                  </td>
                </motion.tr>
              ) : (
                paginatedStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ background: selectedIds.includes(student.id) ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }}
                  >
                    {isAdmin && (
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleSelect(student.id)}
                          style={{ width: '16px', height: '16px', margin: 0 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    <td>{student.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{student.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{student.email}</div>
                        </div>
                        {isAdmin && (student.attendance || 0) < 70 && (
                          <div style={{ padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', border: '1px solid rgba(239, 68, 68, 0.2)' }}>🚨 ACTION REQD</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.attendance || 0}%` }}
                            style={{ height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{student.attendance}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }} className="secondary" style={{ padding: '0.4rem', width: '32px', height: '32px' }}>👁️</button>
                        {isAdmin && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); onEdit(student); }} className="secondary" style={{ padding: '0.4rem', width: '32px', height: '32px' }}>✏️</button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(student.id); }} className="danger" style={{ padding: '0.4rem', width: '32px', height: '32px' }}>🗑️</button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {viewingStudent && (
          <div className="modal-backdrop" onClick={() => setViewingStudent(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card"
              style={{ maxWidth: '600px', padding: '2.5rem', textAlign: 'left' }}
              onClick={e => e.stopPropagation()}
            >
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Student Profile</h2>
                <button onClick={() => setViewingStudent(null)} className="secondary" style={{ width: 'auto', padding: '0.5rem' }}>✕</button>
              </header>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '24px', 
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold'
                  }}>
                    {(viewingStudent.name || 'S').charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, background: 'none', WebkitTextFillColor: 'white' }}>{viewingStudent.name}</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Full-time Student</p>
                    <p style={{ color: 'var(--primary)', fontWeight: '600' }}>ID: #STU-{viewingStudent.id}</p>
                  </div>
                </div>

                <div style={{ 
                  background: 'white', padding: '10px', borderRadius: '12px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  <QRCodeCanvas 
                    value={`STUDENT_ID:${viewingStudent.id}|NAME:${viewingStudent.name}`} 
                    size={120}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "https://mru.edu.in/wp-content/uploads/2021/04/logo.png",
                      x: undefined,
                      y: undefined,
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                  <span style={{ fontSize: '0.6rem', color: '#1e293b', fontWeight: 'bold' }}>SCAN PASSPORT</span>
                </div>
              </div>

              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Email Address</div>
                  <div style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{viewingStudent.email}</div>
                </div>
                <div className="card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Phone Number</div>
                  <div style={{ fontSize: '0.9rem' }}>{viewingStudent.phone || 'N/A'}</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600' }}>Academic Progress</span>
                  <span style={{ color: 'var(--success)' }}>On Track</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', height: '10px', borderRadius: '5px', margin: '1rem 0', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${viewingStudent.attendance}%` }}
                    style={{ height: '100%', background: 'var(--success)' }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem' }}>Current attendance is at <strong>{viewingStudent.attendance}%</strong>, which exceeds the minimum requirement.</p>
              </div>

              <button onClick={() => setViewingStudent(null)} className="auth-button">Close Review</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Prev</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>Page {currentPage} / {totalPages}</div>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Next</button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;

