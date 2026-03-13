import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StudentForm = ({ onSubmit, editingStudent }) => {
  const [student, setStudent] = useState(editingStudent || { name: "", email: "", phone: "", attendance: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setStudent(editingStudent);
    } else {
      setStudent({ name: "", email: "", phone: "", attendance: "" });
    }
  }, [editingStudent]);

  useEffect(() => {
    // Only trigger saving indicator if student data is not empty
    if (!student.name && !student.email && !student.phone && !student.attendance) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 800);
    }, 1000); // 1 second debounce
    return () => clearTimeout(timer);
  }, [student]); // Dependency on the entire student object

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...student, attendance: parseFloat(student.attendance) });
    setStudent({ name: "", email: "", phone: "", attendance: "" }); // Clear form after submission
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prevStudent => ({
      ...prevStudent,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="input-group">
        <label className="input-label">Student Name</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. John Doe"
          value={student.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="e.g. john@example.com"
          value={student.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="+1 234 567 890"
          value={student.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Attendance (%)</label>
        <input
          type="number"
          name="attendance"
          placeholder="0-100"
          value={student.attendance}
          onChange={handleChange}
          min="0"
          max="100"
          step="0.1"
          required
        />
      </div>
      <div className="full-width" style={{ position: 'relative' }}>
        <button type="submit" className="primary" style={{ marginTop: '0.5rem' }}>
          {editingStudent ? '✨ Update Student Info' : '➕ Register Student'}
        </button>

        <AnimatePresence>
          {isSaving && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', bottom: '-1.5rem', left: '0', fontSize: '0.7rem', color: 'var(--success)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <div style={{ width: '4px', height: '4px', background: 'var(--success)', borderRadius: '50%' }} />
              Changes cached locally...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default StudentForm;