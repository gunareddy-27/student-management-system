import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Timetable = () => {
  const [resolved, setResolved] = useState(false);
  const days = [
    { name: "Monday", roomPrefix: "A" },
    { name: "Tuesday", roomPrefix: "B" },
    { name: "Wednesday", roomPrefix: "C" },
    { name: "Thursday", roomPrefix: "D" },
    { name: "Friday", roomPrefix: "E" },
    { name: "Saturday", roomPrefix: "F" },
  ];

  return (
    <div className="timetable-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Smart Schedule Matrix 
          {!resolved ? <AlertCircle color="#ef4444" size={24} /> : <CheckCircle color="#10b981" size={24} />}
        </h3>
        {!resolved && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setResolved(true)}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Auto-Resolve Conflicts ✨
          </motion.button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {days.map((day, idx) => (
          <motion.div 
            key={day.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="card"
            style={{ padding: '0', overflow: 'hidden' }}
          >
            <div style={{ 
              background: 'linear-gradient(45deg, var(--primary), var(--accent))', 
              padding: '1rem', 
              color: 'white', 
              fontWeight: '700',
              textAlign: 'center'
            }}>
              {day.name}
            </div>
            <div style={{ padding: '1rem' }}>
              <table style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>09:00 - 10:20</td>
                    <td>{day.roomPrefix}101</td>
                    <td><span className="badge badge-success">Lecture</span></td>
                  </tr>
                  {!resolved && day.name === "Wednesday" && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                      <td>09:00 - 10:20</td>
                      <td>{day.roomPrefix}101</td>
                      <td><span className="badge" style={{ background: '#ef4444', color: 'white' }}>Conflict</span></td>
                    </motion.tr>
                  )}
                  {resolved && day.name === "Wednesday" && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <td>16:00 - 17:20</td>
                      <td>{day.roomPrefix}105</td>
                      <td><span className="badge badge-success">Rescheduled</span></td>
                    </motion.tr>
                  )}
                  <tr>
                    <td>10:20 - 11:30</td>
                    <td>{day.roomPrefix}102</td>
                    <td><span className="badge badge-warning">Lab</span></td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Short Break (11:30 - 11:40)
                    </td>
                  </tr>
                  <tr>
                    <td>11:40 - 12:50</td>
                    <td>{day.roomPrefix}103</td>
                    <td><span className="badge">Workshop</span></td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Lunch Break (12:50 - 13:50)
                    </td>
                  </tr>
                  <tr>
                    <td>13:50 - 14:50</td>
                    <td>{day.roomPrefix}104</td>
                    <td><span className="badge badge-success">Seminar</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;