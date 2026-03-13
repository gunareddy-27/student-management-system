import React, { useState, useEffect } from 'react';

const CourseForm = ({ onSubmit, editingCourse }) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [attendance, setAttendance] = useState('');

  useEffect(() => {
    if (editingCourse) {
      setCourseName(editingCourse.courseName || '');
      setCourseCode(editingCourse.courseCode || '');
      setAttendance(editingCourse.attendance || '');
    }
  }, [editingCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ courseName, courseCode, attendance: parseFloat(attendance) });
    setCourseName('');
    setCourseCode('');
    setAttendance('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="input-group">
        <label className="input-label">Course Name</label>
        <input
          type="text"
          placeholder="e.g. Advanced Mathematics"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Course Code</label>
        <input
          type="text"
          placeholder="e.g. MATH301"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
      </div>
      <div className="input-group full-width">
        <label className="input-label">Attendance Threshold (%)</label>
        <input
          type="number"
          placeholder="0-100"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          min="0"
          max="100"
          step="0.1"
          required
        />
      </div>
      <div className="full-width">
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          {editingCourse ? '✨ Save Changes' : '📚 Create New Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;