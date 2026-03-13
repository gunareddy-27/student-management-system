import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ThemeProvider from "./context/ThemeContext";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import CourseForm from "./components/CourseForm";
import CourseTable from "./components/CourseTable";
import AnalyticsChart from "./components/AnalyticsChart";
import Timetable from "./components/Timetable";
import ProfessorTimetable from "./components/ProfessorTimetable";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import DarkModeToggle from "./components/DarkModeToggle";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

// A simple Modal component for delete confirmation
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-backdrop">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="modal-content"
    >
      <h3 style={{ color: 'white' }}>Are you sure?</h3>
      <p style={{ margin: '1rem 0' }}>{message}</p>
      <div className="modal-actions">
        <button onClick={onConfirm} className="danger">Confirm</button>
        <button onClick={onCancel} className="secondary">Cancel</button>
      </div>
    </motion.div>
  </div>
);

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showTimetable, setShowTimetable] = useState(false);
  const baseUrl = "http://localhost:8080";
  
  const userRole = localStorage.getItem("role") || "student";
  const isAdmin = userRole === "admin";

  // --- NEW FEATURES STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    id: null,
    type: null,
  });
  const [activities, setActivities] = useState([]);
  const [broadcast, setBroadcast] = useState(() => {
    const raw = localStorage.getItem("broadcast_msg");
    try { return JSON.parse(raw); } catch { return raw; }
  });

  useEffect(() => {
    const checkBroadcast = () => {
      const raw = localStorage.getItem("broadcast_msg");
      try { setBroadcast(JSON.parse(raw)); } catch { setBroadcast(raw); }
    };
    const interval = setInterval(checkBroadcast, 5000);
    return () => clearInterval(interval);
  }, []);

  const addActivity = (action, target) => {
    const newActivity = { 
      id: Date.now(), 
      msg: `${action} ${target}`, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: action.toLowerCase()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 10));
  };

  const handleBroadcast = () => {
    const isEmergency = window.confirm("Is this an EMERGENCY broadcast? (Will be highlighted in Red)");
    const text = prompt("Enter announcement text:");
    if (!text) return;
    
    const imageUrl = prompt("Enter Image URL (optional):") || "";
    const videoUrl = prompt("Enter Video URL (optional):") || "";
    
    const broadcastObj = { text, imageUrl, videoUrl, isEmergency };
    localStorage.setItem("broadcast_msg", JSON.stringify(broadcastObj));
    setBroadcast(broadcastObj);
    showNotification(isEmergency ? "EMERGENCY BROADCAST LIVE!" : "Rich broadcast updated!");
    addActivity(isEmergency ? 'EMERGENCY' : 'Broadcasted', text);
  };

  const handleClearBroadcast = () => {
    localStorage.removeItem("broadcast_msg");
    setBroadcast(null);
    showNotification("Broadcast cleared.");
  };

  const handleExportStudents = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "students_master_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Master student records exported.");
  };

  // --- ENHANCED DATA FETCHING ---
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/students`);
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students. The server might be down.");
      console.error(err);
    }
  }, [baseUrl]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/courses`);
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses. The server might be down.");
      console.error(err);
    }
  }, [baseUrl]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchStudents(), fetchCourses()]);
      setLoading(false);
    };
    fetchAllData();
  }, [fetchStudents, fetchCourses]);
  
  // Flash notification message for 3 seconds
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // --- ENHANCED CRUD HANDLERS ---
  const handleStudentSubmit = async (student) => {
    try {
      if (editingStudent) {
        await axios.put(`${baseUrl}/students/${editingStudent.id}`, student);
        showNotification("Student updated successfully!");
      } else {
        await axios.post(`${baseUrl}/students`, student);
        showNotification("Student added successfully!");
      }
      fetchStudents();
      setEditingStudent(null);
      addActivity(editingStudent ? 'Updated' : 'Created', `student ${student.name}`);
    } catch (err) {
      setError("Could not save student data.");
    }
  };

  const handleCourseSubmit = (course) => {
    // 🛡️ RESOURCE CONFLICT CHECKER
    const hasConflict = courses.find(c => 
      c.id !== course.id && 
      c.courseCode === course.courseCode && 
      c.attendance >= 90 // Active courses only
    );

    if (hasConflict && !course.id) {
      if (!window.confirm(`⚠️ CONFLICT DETECTED: A course with code ${course.courseCode} is already active. Proceed with duplicate entry?`)) {
        return;
      }
    }

    if (course.id) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
      showNotification(`Course ${course.courseCode} updated.`);
      addActivity('Modified', `Course ${course.courseCode}`);
    } else {
      const newCourse = { ...course, id: Date.now() };
      setCourses([...courses, newCourse]);
      showNotification(`New course ${course.courseCode} registered.`);
      addActivity('Registered', `Course ${course.courseCode}`);
    }
    setEditingCourse(null);
  };

  // --- DELETE CONFIRMATION LOGIC ---
  const handleDeleteClick = (id, type) => {
    setDeleteConfirmation({ isOpen: true, id, type });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, id: null, type: null });
  };

  const handleConfirmDelete = async () => {
    const { id, type } = deleteConfirmation;
    try {
      if (type === 'student') {
        await axios.delete(`${baseUrl}/students/${id}`);
        fetchStudents();
        showNotification("Student deleted.");
      } else if (type === 'course') {
        await axios.delete(`${baseUrl}/courses/${id}`);
        fetchCourses();
        showNotification("Course deleted.");
      }
    } catch (err) {
      setError(`Failed to delete ${type}.`);
    } finally {
      handleCancelDelete();
    }
  };

  const handleBulkDelete = async (ids, type) => {
    try {
      if (type === 'student') {
        await Promise.all(ids.map(id => axios.delete(`${baseUrl}/students/${id}`)));
        fetchStudents();
        showNotification(`${ids.length} students removed.`);
        addActivity('Bulk deleted', `${ids.length} students`);
      } else {
        await Promise.all(ids.map(id => axios.delete(`${baseUrl}/courses/${id}`)));
        fetchCourses();
        showNotification(`${ids.length} courses removed.`);
        addActivity('Bulk deleted', `${ids.length} courses`);
      }
    } catch (err) {
      setError(`Bulk delete failed.`);
    }
  };

  // --- SEARCH/FILTERING LOGIC ---
  const filteredStudents = useMemo(() =>
    students.filter(student =>
      (student.name || '').toLowerCase().includes(studentSearchTerm.toLowerCase())
    ), [students, studentSearchTerm]
  );

  const filteredCourses = useMemo(() =>
    courses.filter(course =>
      (course.name || '').toLowerCase().includes(courseSearchTerm.toLowerCase())
    ), [courses, courseSearchTerm]
  );
  
  if (loading) return (
    <div className="auth-page">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 40, height: 40, border: '4px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%' }}
      />
    </div>
  );

  return (
    <div className="app-dashboard">
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <ConfirmationModal
            message={`Are you sure you want to delete this ${deleteConfirmation.type}? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="notification"
          >
            <span>✨</span> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="nav-header">
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Student Hub</h1>
        <nav className="nav-links">
          <Link to="/student-management">Students</Link>
          <Link to="/professor-timetable">Timetable</Link>
          <DarkModeToggle />
          <Link to="/login" style={{ color: 'var(--error)' }}>Logout</Link>
        </nav>
      </header>

      <AnimatePresence>
        {broadcast && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              background: broadcast.isEmergency 
                ? 'linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(0, 0, 0, 0.4))' 
                : 'linear-gradient(to bottom, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9))',
              border: broadcast.isEmergency ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '3rem',
              backdropFilter: 'blur(20px)',
              boxShadow: broadcast.isEmergency ? '0 0 30px rgba(239, 68, 68, 0.2)' : '0 20px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              animation: broadcast.isEmergency ? 'pulse-red 2s infinite' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ 
                padding: '0.45rem 1rem', 
                background: broadcast.isEmergency ? '#ef4444' : 'var(--primary)', 
                borderRadius: '30px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                letterSpacing: '1px' 
              }}>
                {broadcast.isEmergency ? "🚨 EMERGENCY ALERT" : "📢 OFFICIAL ANNOUNCEMENT"}
              </div>
              {isAdmin && (
                <button onClick={handleClearBroadcast} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Cease Broadcast</button>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: (broadcast.imageUrl || broadcast.videoUrl) ? '1fr 1.2fr' : '1fr', gap: '2.5rem', alignItems: 'center' }}>
               <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2', color: 'white', marginBottom: '1rem' }}>{broadcast.text || broadcast}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Sent by University Administration • {new Date().toLocaleDateString()}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {broadcast.imageUrl && (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={broadcast.imageUrl} 
                    alt="Broadcast Media" 
                    style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                  />
                )}
                {broadcast.videoUrl && (
                  <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {broadcast.videoUrl.includes('youtube.com') || broadcast.videoUrl.includes('youtu.be') ? (
                       <iframe 
                        width="100%" 
                        height="250" 
                        src={`https://www.youtube.com/embed/${broadcast.videoUrl.split('v=')[1]?.split('&')[0] || broadcast.videoUrl.split('/').pop()}`}
                        title="Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video controls style={{ width: '100%' }}>
                        <source src={broadcast.videoUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0, color: 'white' }}>{isAdmin ? "Administrative Command Center" : "Dashboard Overview"}</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isAdmin && (
              <>
                <button className="primary" style={{ width: 'auto' }} onClick={handleBroadcast}>📢 Broadcast</button>
                <button className="secondary" style={{ width: 'auto' }} onClick={handleExportStudents}>📦 Export Master</button>
              </>
            )}
            <button 
              className="secondary" 
              style={{ width: 'auto' }}
              onClick={() => setShowTimetable(!showTimetable)}
            >
              {showTimetable ? "Back to Management" : "Quick Timetable"}
            </button>
          </div>
        </div>
        
        {error && <div className="error-message" style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

        <AnimatePresence mode="wait">
          {showTimetable ? (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Timetable />
            </motion.div>
          ) : (
            <motion.div
              key="management"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="dashboard-grid"
            >
              <section className="card">
                <h3 className="section-title">Enrolled Students</h3>
                {isAdmin && <StudentForm onSubmit={handleStudentSubmit} editingStudent={editingStudent} />}
                <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearchTerm}
                    onChange={e => setStudentSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--text-muted)' }}>🔍</span>
                </div>
                <div className="table-container">
                  <StudentTable 
                    students={filteredStudents} 
                    onEdit={setEditingStudent} 
                    onDelete={(id) => handleDeleteClick(id, 'student')}
                    onBulkDelete={(ids) => handleBulkDelete(ids, 'student')}
                  />
                </div>
              </section>

              <section className="card">
                <h3 className="section-title">Session Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {activities.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>No recent activity in this session.</p>
                  ) : (
                    activities.map(act => (
                      <div key={act.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.75rem', 
                        background: act.type === 'broadcasted' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)', 
                        borderRadius: '8px',
                        borderLeft: act.type === 'broadcasted' ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <span style={{ fontSize: '0.85rem' }}>{act.msg}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{act.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 className="section-title">Curriculum Overview</h3>
                {isAdmin && <CourseForm onSubmit={handleCourseSubmit} editingCourse={editingCourse} />}
                <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearchTerm}
                    onChange={e => setCourseSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--text-muted)' }}>🔍</span>
                </div>
                <div className="table-container">
                  <CourseTable 
                    courses={filteredCourses} 
                    onEdit={setEditingCourse} 
                    onDelete={(id) => handleDeleteClick(id, 'course')}
                    onBulkDelete={(ids) => handleBulkDelete(ids, 'course')}
                  />
                </div>
              </section>

              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 className="section-title">Statistics & Analytics</h3>
                <div className="chart-container-large">
                  <AnalyticsChart studentsCount={students.length} coursesCount={courses.length} />
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-management"
            element={
              <ProtectedRoute>
                <StudentManagement />
              </ProtectedRoute>
            }
          />

          {/* New route for professor timetable */}
          <Route
            path="/professor-timetable"
            element={
              <ProtectedRoute>
                {/* For more flexibility, professorName could come from URL params */}
                <ProfessorTimetable professorName="Prof. Smith" />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;