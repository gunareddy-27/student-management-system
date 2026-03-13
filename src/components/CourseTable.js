import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseTable = ({ courses, onEdit, onDelete, onBulkDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const userRole = localStorage.getItem("role") || "student";
  const isAdmin = userRole === "admin";
  
  const rowsPerPage = 5;

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCourses.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredCourses = useMemo(() => {
    let data = courses.filter(
      (course) =>
        (course.courseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [courses, searchTerm, sortField, sortOrder]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCourses.slice(start, start + rowsPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredCourses));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "courses_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="table-wrapper">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search curriculum..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isAdmin && (
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onBulkDelete(selectedIds)}
                  className="danger"
                  style={{ width: 'auto', padding: '0.6rem 1.2rem' }}
                >
                  Delete ({selectedIds.length})
                </motion.button>
              )}
            </AnimatePresence>
          )}
          <button onClick={exportToJson} className="secondary" style={{ width: 'auto' }}>
            💾 JSON
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {isAdmin && (
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedCourses.length}
                    onChange={toggleSelectAll}
                    style={{ width: '18px', height: '18px', margin: 0 }}
                  />
                </th>
              )}
              <th onClick={() => handleSort('courseName')} style={{ cursor: 'pointer' }}>Course ↕</th>
              <th onClick={() => handleSort('courseCode')} style={{ cursor: 'pointer' }}>Code ↕</th>
              <th onClick={() => handleSort('attendance')} style={{ cursor: 'pointer' }}>Status ↕</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedCourses.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No courses found.
                  </td>
                </motion.tr>
              ) : (
                paginatedCourses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ background: selectedIds.includes(course.id) ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }}
                  >
                    {isAdmin && (
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(course.id)}
                          onChange={() => toggleSelect(course.id)}
                          style={{ width: '16px', height: '16px', margin: 0 }}
                        />
                      </td>
                    )}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course.courseName}</div>
                    </td>
                    <td>
                      <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--secondary)' }}>
                        {course.courseCode}
                      </code>
                    </td>
                    <td>
                      <span className={`badge ${course.attendance >= 90 ? 'badge-success' : 'badge-warning'}`}>
                        {course.attendance >= 90 ? 'ACTIVE' : 'PENDING'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => onEdit(course)} className="secondary" style={{ padding: '0.4rem', width: '32px', height: '32px' }}>✏️</button>
                          <button onClick={() => onDelete(course.id)} className="danger" style={{ padding: '0.4rem', width: '32px', height: '32px' }}>🗑️</button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="secondary" style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Prev</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{currentPage} / {totalPages}</div>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="secondary" style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Next</button>
        </div>
      )}
    </div>
  );
};

export default CourseTable;

