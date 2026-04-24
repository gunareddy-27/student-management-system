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
import ChatBot from "./components/ChatBot";
import KanbanBoard from "./components/KanbanBoard";
import DocumentVault from "./components/DocumentVault";
import Gamification from "./components/Gamification";
import ResourceTracker from "./components/ResourceTracker";
import PeerTutorSOS from "./components/PeerTutorSOS";
import WellbeingCheck from "./components/WellbeingCheck";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import DarkModeToggle from "./components/DarkModeToggle";
import ProtectedRoute from "./ProtectedRoute";
import FeeManagement from "./components/FeeManagement";
import LibraryManagement from "./components/LibraryManagement";
import AttendanceTracker from "./components/AttendanceTracker";
import EnrollmentManager from "./components/EnrollmentManager";
import StudentProfile from "./components/StudentProfile";
import DashboardStats from "./components/DashboardStats";
import { Bell } from "lucide-react";
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

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('.card')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
      
      // Spotlight effect variables
      for (const card of document.querySelectorAll('.card')) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px',
          background: 'var(--primary)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999,
        }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, width: '40px', height: '40px',
          border: '1px solid var(--primary)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9998,
        }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)'
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("management");
  const [focusMode, setFocusMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
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
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosName, setSosName] = useState('');
  const [sosIssue, setSosIssue] = useState('');
  const [sosSending, setSosSending] = useState(false);
  const [sosAlerts, setSosAlerts] = useState([]);
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

    const broadcastObj = { text, imageUrl, videoUrl, isEmergency, id: Date.now() };
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

  // Poll SOS alerts for admin every 5 seconds
  useEffect(() => {
    if (!isAdmin) return;
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/sos`);
        setSosAlerts(res.data);
      } catch (e) { /* silent */ }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, baseUrl]);

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

  const handleCourseSubmit = async (course) => {
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

    try {
      if (course.id) {
        await axios.put(`${baseUrl}/courses/${course.id}`, course);
        showNotification(`Course ${course.courseCode} updated.`);
        addActivity('Modified', `Course ${course.courseCode}`);
      } else {
        await axios.post(`${baseUrl}/courses`, course);
        showNotification(`New course ${course.courseCode} registered.`);
        addActivity('Registered', `Course ${course.courseCode}`);
      }
      fetchCourses();
      setEditingCourse(null);
    } catch (err) {
      setError("Could not save course data.");
    }
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

  const handleSosSubmit = async () => {
    if (!sosName.trim() || !sosIssue.trim()) return;
    setSosSending(true);
    try {
      await axios.post(`${baseUrl}/sos`, {
        studentName: sosName,
        issue: sosIssue,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
      showNotification('🚨 SOS Alert sent! Email notification dispatched to security.');
      addActivity('EMERGENCY', `SOS by ${sosName}: ${sosIssue}`);
      setSosName('');
      setSosIssue('');
      setSosModalOpen(false);
    } catch (err) {
      setError('Failed to send SOS alert. Please try again or call security directly.');
    } finally {
      setSosSending(false);
    }
  };

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
      {/* Aurora Background Elements */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>
      
      <CustomCursor />

      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <ConfirmationModal
            message={`Are you sure you want to delete this ${deleteConfirmation.type}? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </AnimatePresence>

      {/* SOS MODAL */}
      <AnimatePresence>
        {sosModalOpen && (
          <div className="modal-backdrop" onClick={() => !sosSending && setSosModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '420px', border: '1px solid rgba(239, 68, 68, 0.4)' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'pulse-red 1.5s infinite' }}>🚨</div>
                <h3 style={{ color: '#ef4444', margin: 0, fontSize: '1.3rem' }}>Campus Emergency SOS</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  An emergency alert will be sent to campus security via email immediately.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ color: '#fca5a5' }}>Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={sosName}
                    onChange={(e) => setSosName(e.target.value)}
                    style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    disabled={sosSending}
                    autoFocus
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ color: '#fca5a5' }}>Describe the Emergency *</label>
                  <textarea
                    placeholder="What is happening? Be specific (e.g., medical emergency in Block C, fire in lab 204...)"
                    value={sosIssue}
                    onChange={(e) => setSosIssue(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--text-main)', fontSize: '0.9rem', resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    disabled={sosSending}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={handleSosSubmit}
                  disabled={sosSending || !sosName.trim() || !sosIssue.trim()}
                  className="danger"
                  style={{
                    opacity: (sosSending || !sosName.trim() || !sosIssue.trim()) ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  {sosSending ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⏳</motion.span> Sending Alert...</>
                  ) : (
                    '🚨 Send SOS Alert'
                  )}
                </button>
                <button
                  onClick={() => { setSosModalOpen(false); setSosName(''); setSosIssue(''); }}
                  className="secondary"
                  disabled={sosSending}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
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

      <AnimatePresence>
        {!focusMode && (
          <motion.header exit={{ y: -100, opacity: 0 }} className="nav-header">
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Student Hub</h1>
            <nav className="nav-links" style={{ alignItems: 'center' }}>
              <Link to="/student-management">Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Bell size={20} />
                  {activities.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--error)', width: '10px', height: '10px', borderRadius: '50%' }} />}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ position: 'absolute', top: '40px', right: 0, width: '300px', background: 'rgba(30, 27, 75, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    >
                      <h4 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Notifications</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {activities.slice(0, 5).map((act, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            {act.msg} <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{act.time}</div>
                          </div>
                        ))}
                        {activities.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No new notifications</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <WellbeingCheck />
              <button
                onClick={() => setSosModalOpen(true)}
                style={{ padding: '0.4rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                🚨 SOS Alert
              </button>
              <DarkModeToggle />
              <button
                onClick={() => setFocusMode(true)}
                style={{ padding: '0.4rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
              >
                Focus Mode 🎥
              </button>
              <Link to="/login" style={{ color: 'var(--error)' }}>Logout</Link>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {focusMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
            <button onClick={() => setFocusMode(false)} style={{ padding: '0.75rem 1.5rem', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>Exit Focus Mode ✖</button>
          </motion.div>
        )}
      </AnimatePresence>

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
              className={activeTab === "management" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("management")}
            >
              Management
            </button>
            <button
              className={activeTab === "workspace" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("workspace")}
            >
              Bento Workspace ✨
            </button>
            <button
              className={activeTab === "timetable" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("timetable")}
            >
              Smart Timetable
            </button>
            <button
              className={activeTab === "fees" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("fees")}
            >
              💰 Fees
            </button>
            <button
              className={activeTab === "library" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("library")}
            >
              📖 Library
            </button>
            <button
              className={activeTab === "attendance" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("attendance")}
            >
              📊 Attendance
            </button>
            <button
              className={activeTab === "enrollments" ? "primary" : "secondary"}
              style={{ width: 'auto' }}
              onClick={() => setActiveTab("enrollments")}
            >
              📝 Enrollments
            </button>
          </div>
        </div>

        {error && <div className="error-message" style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

        {/* Dashboard Overview Stats */}
        {isAdmin && <DashboardStats />}

        <AnimatePresence mode="wait">
          {activeTab === "timetable" && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Timetable />
            </motion.div>
          )}

          {activeTab === "workspace" && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ paddingBottom: '2rem' }}
            >
              {/* BENTO BOX GRID LAYOUT */}
              <div className="bento-grid">
                <motion.div layout className="card bento-hero" style={{ gridColumn: '1 / -1' }}>
                  <h3 className="section-title">Task Management (Kanban)</h3>
                  <KanbanBoard />
                </motion.div>
                
                <motion.div layout className="card bento-tall" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="section-title">Document Vault</h3>
                  <div style={{ flex: 1 }}><DocumentVault /></div>
                </motion.div>

                <motion.div layout className="card bento-square" style={{ gridColumn: 'span 1' }}>
                  <h3 className="section-title">Achievements & Progress</h3>
                  <Gamification />
                </motion.div>

                <motion.div layout className="card bento-wide" style={{ gridColumn: '1 / -1' }}>
                  <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                    Live Campus Resources
                  </h3>
                  <ResourceTracker />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "management" && (
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
                <h3 className="section-title">Institutional Intelligence Dashboard</h3>
                <div className="chart-container-large">
                  <AnalyticsChart />
                </div>
              </section>

              {isAdmin && (
                <section className="card" style={{
                  gridColumn: '1 / -1',
                  border: sosAlerts.filter(a => a.status === 'active').length > 0
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                  animation: sosAlerts.filter(a => a.status === 'active').length > 0
                    ? 'pulse-red 2s infinite' : 'none'
                }}>
                  <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    🚨 Live SOS Alerts
                    {sosAlerts.filter(a => a.status === 'active').length > 0 && (
                      <span style={{
                        background: '#ef4444', color: 'white', padding: '0.2rem 0.6rem',
                        borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
                        animation: 'pulse-red 1.5s infinite'
                      }}>
                        {sosAlerts.filter(a => a.status === 'active').length} ACTIVE
                      </span>
                    )}
                  </h3>
                  {sosAlerts.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No SOS alerts. Campus is safe.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                      {sosAlerts.map(alert => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{
                            padding: '1rem 1.25rem',
                            background: alert.status === 'active'
                              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'
                              : 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            borderLeft: alert.status === 'active' ? '4px solid #ef4444' : '4px solid #22c55e',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                              <span style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: alert.status === 'active' ? '#ef4444' : '#22c55e',
                                boxShadow: alert.status === 'active' ? '0 0 8px #ef4444' : 'none',
                                display: 'inline-block'
                              }} />
                              <strong style={{ color: 'white', fontSize: '0.95rem' }}>{alert.student_name}</strong>
                              <span style={{
                                fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 'bold',
                                background: alert.status === 'active' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                                color: alert.status === 'active' ? '#fca5a5' : '#86efac'
                              }}>
                                {alert.status === 'active' ? 'ACTIVE' : 'RESOLVED'}
                              </span>
                            </div>
                            <p style={{ margin: '0.25rem 0', color: '#fca5a5', fontSize: '0.9rem' }}>{alert.issue}</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{alert.alert_time}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                            {alert.status === 'active' && (
                              <button onClick={async () => {
                                await axios.put(`${baseUrl}/sos/${alert.id}/resolve`);
                                setSosAlerts(prev => prev.map(a => a.id === alert.id ? {...a, status: 'resolved'} : a));
                                showNotification('SOS alert resolved.');
                              }} style={{ padding: '0.4rem 0.8rem', background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: 'auto' }}>
                                Resolve
                              </button>
                            )}
                            <button onClick={async () => {
                              await axios.delete(`${baseUrl}/sos/${alert.id}`);
                              setSosAlerts(prev => prev.filter(a => a.id !== alert.id));
                              showNotification('SOS alert deleted.');
                            }} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: 'auto' }}>
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NEW FEATURE TABS */}
        <AnimatePresence mode="wait">
          {activeTab === "fees" && (
            <motion.div key="fees" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="card">
                <h3 className="section-title">💰 Fee Management</h3>
                <FeeManagement />
              </section>
            </motion.div>
          )}

          {activeTab === "library" && (
            <motion.div key="library" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="card">
                <h3 className="section-title">📖 Library Management</h3>
                <LibraryManagement />
              </section>
            </motion.div>
          )}

          {activeTab === "attendance" && (
            <motion.div key="attendance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="card">
                <h3 className="section-title">📊 Attendance Tracker</h3>
                <AttendanceTracker />
              </section>
            </motion.div>
          )}

          {activeTab === "enrollments" && (
            <motion.div key="enrollments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="card">
                <h3 className="section-title">📝 Enrollment Manager</h3>
                <EnrollmentManager />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ChatBot />
      {!isAdmin && <PeerTutorSOS />}

      {/* Student Profile Modal */}
      <AnimatePresence>
        {selectedStudentId && (
          <StudentProfile studentId={selectedStudentId} onClose={() => setSelectedStudentId(null)} />
        )}
      </AnimatePresence>
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