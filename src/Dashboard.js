import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SystemStats from "./components/SystemStats";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user") || "User";
  const userRole = localStorage.getItem("role") || "student";
  const isAdmin = userRole === "admin";
  const [tickerMsg, setTickerMsg] = useState("System online. Checking for peer updates...");

  const peerActivities = [
    "Prof. Smith modified Math 101 syllabus",
    "Admin added 5 new students to Physics 201",
    "Automated backup completed successfully",
    "Security audit: 0 vulnerabilities found",
    "New enrollment window opened for Semester 2"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = localStorage.getItem("broadcast_msg");
      let broadcastText = "";
      try {
        const obj = JSON.parse(raw);
        broadcastText = obj ? obj.text : "";
      } catch {
        broadcastText = raw;
      }

      if (broadcastText && Math.random() > 0.3) {
        setTickerMsg(`🔴 ADMIN BROADCAST: ${broadcastText}`);
      } else {
        setTickerMsg(peerActivities[Math.floor(Math.random() * peerActivities.length)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    document.title = "Dashboard | Student Hub";
  }, []);

  return (
    <div className="auth-page" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1440px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2.5rem' }}>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ maxWidth: 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
             <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{isAdmin ? "Management Console" : "Student Terminal"}</h1>
              <p style={{ fontSize: '1.1rem' }}>{isAdmin ? "Operator" : "Student"}: <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>{userEmail.split('@')[0]}</span></p>
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }} />
              LIVE DATASTREAM
            </div>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="auth-button"
              onClick={() => navigate("/student-management")}
              style={{ padding: '1.8rem', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)' }}
            >
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '1.5rem' }}>📊</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{isAdmin ? "Student Core" : "Class Registry"}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{isAdmin ? "Manage 124 active enrollment records" : "View enrolled classmates and attendance"}</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="auth-button"
              onClick={() => navigate("/professor-timetable")}
              style={{ padding: '1.8rem', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)' }}
            >
               <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '1.5rem' }}>🗓️</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{isAdmin ? "Schedule Matrix" : "Academic Calendar"}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{isAdmin ? "Sync and audit faculty class timings" : "Check professor availability and room locations"}</div>
              </div>
            </motion.button>

            <button
              onClick={handleLogout}
              className="danger"
              style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)' }}
            >
              System Logout
            </button>
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card"
            style={{ padding: '1rem 1.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.2rem' }}>🔔</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerMsg}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)' }}
                >
                  {tickerMsg}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '0' }}
          >
            <SystemStats />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
            style={{ padding: '1.5rem' }}
          >
            <h4 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-main)', background: 'none', WebkitTextFillColor: 'currentColor' }}>Active Signal Base</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Server Delta', status: 'Operational', color: 'var(--success)' },
                { name: 'Crypto Bridge', status: 'Encrypted', color: 'var(--secondary)' },
                { name: 'Auth Gateway', status: 'Secure', color: 'var(--primary)' }
              ].map((sig, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{sig.name}</span>
                  <span style={{ fontSize: '0.7rem', color: sig.color, fontWeight: 'bold' }}>{sig.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
