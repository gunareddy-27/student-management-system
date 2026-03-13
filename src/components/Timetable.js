import React from 'react';
import { motion } from 'framer-motion';

const Timetable = () => {
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