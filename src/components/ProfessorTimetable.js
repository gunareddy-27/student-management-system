import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const professorsSchedule = {
  "Prof. Smith": [
    { day: "Monday", time: "09:00 - 10:20", room: "A101", course: "Math 101", type: "Lecture" },
    { day: "Monday", time: "13:50 - 14:50", room: "A104", course: "Math 101", type: "Seminar" },
    { day: "Wednesday", time: "10:20 - 11:30", room: "C102", course: "Math 101", type: "Lab" },
  ],
  "Prof. Johnson": [
    { day: "Tuesday", time: "09:00 - 10:20", room: "B101", course: "Physics 201", type: "Lecture" },
    { day: "Thursday", time: "14:50 - 15:50", room: "D105", course: "Physics 201", type: "Lecture" },
    { day: "Friday", time: "11:40 - 12:50", room: "E103", course: "Physics 201", type: "Workshop" },
  ],
  "Prof. Williams": [
    { day: "Monday", time: "08:00 - 09:30", room: "F201", course: "Chemistry 101", type: "Lecture" },
    { day: "Wednesday", time: "09:40 - 11:00", room: "F202", course: "Chemistry 101", type: "Lab" },
    { day: "Friday", time: "13:00 - 14:30", room: "F203", course: "Chemistry 101", type: "Seminar" },
  ],
  "Prof. Brown": [
    { day: "Tuesday", time: "10:30 - 12:00", room: "G101", course: "History 201", type: "Lecture" },
    { day: "Thursday", time: "12:10 - 13:40", room: "G102", course: "History 201", type: "Seminar" },
  ],
  "Prof. Davis": [
    { day: "Wednesday", time: "14:00 - 15:30", room: "H105", course: "English 101", type: "Lecture" },
    { day: "Friday", time: "09:00 - 10:30", room: "H106", course: "English 101", type: "Workshop" },
  ],
};

const salaryData = {
  "Prof. Smith": 6500,
  "Prof. Johnson": 7000,
  "Prof. Williams": 6200,
  "Prof. Brown": 5800,
  "Prof. Davis": 6000,
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ProfessorTimetable = ({ professorName }) => {
  const initialSchedule = professorsSchedule[professorName] || [];
  const [attendance, setAttendance] = useState({});
  const baseSalary = salaryData[professorName] || 0;
  
  const userRole = localStorage.getItem("role") || "student";
  const isAdmin = userRole === "admin";

  const toggleAttendance = (day, time) => {
    if (!isAdmin) return;
    const key = `${day}-${time}`;
    setAttendance((prev) => {
      const wasPresent = prev[key]?.attended;
      let reason = "";
      if (wasPresent) {
        reason = prompt("Enter absence reason:") || "Unspecified";
      }
      return {
        ...prev,
        [key]: { attended: !wasPresent, reason },
      };
    });
  };

  const totalClasses = initialSchedule.length;
  const attendedClasses = initialSchedule.filter(({ day, time }) => attendance[`${day}-${time}`]?.attended).length;
  const attendancePercent = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  const adjustedSalary = Math.round((attendancePercent / 100) * baseSalary);

  // Simulated hour calculation: assume each session is 1.5 hours
  const totalHours = totalClasses * 1.5;
  const auditedHours = attendedClasses * 1.5;

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ padding: '2rem', borderLeft: '4px solid var(--secondary)', background: 'rgba(6, 182, 212, 0.05)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Attendance Analytics</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.5rem 0' }}>{attendancePercent}%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified: {attendedClasses} session units</div>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.1 }}>📉</div>
          </div>
        </motion.div>
        
        {isAdmin && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card" 
              style={{ padding: '2rem', borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Projected Disbursement</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)', margin: '0.5rem 0' }}>${adjustedSalary.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cap: ${baseSalary.toLocaleString()}</div>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.1 }}>💵</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card" 
              style={{ padding: '2rem', borderLeft: '4px solid var(--accent)', background: 'rgba(139, 92, 246, 0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Audited Class Load</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.5rem 0' }}>{auditedHours}h</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weekly Goal: {totalHours}h</div>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.1 }}>⏱️</div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {daysOfWeek.map((day, dayIndex) => {
          const daySchedule = initialSchedule.filter((entry) => entry.day === day);
          if (daySchedule.length === 0) return null;

          return (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: '700' }}>{day}</h3>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--card-border), transparent)' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
                {daySchedule.map(({ time, room, course, type }, i) => {
                  const key = `${day}-${time}`;
                  const att = attendance[key] || { attended: false, reason: "" };
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="glass-card"
                      style={{ 
                        padding: '1.25rem',
                        background: att.attended ? 'rgba(255,255,255,0.03)' : 'rgba(239, 68, 68, 0.02)',
                        border: att.attended ? '1px solid var(--card-border)' : '1px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: att.attended ? 'var(--success)' : 'var(--error)' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px', color: 'var(--text-dim)' }}>{time}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--secondary)' }}>{room}</span>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{course}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Session Prototype: {type}</div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           {!att.attended && att.reason && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--error)', fontStyle: 'italic' }}>⚠ {att.reason}</div>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => toggleAttendance(day, time)}
                            className={att.attended ? "secondary" : "primary"}
                            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                          >
                            {att.attended ? "Roll Back" : "Authorize Presence"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const TimetableApp = () => {
  const [selectedProf, setSelectedProf] = useState(Object.keys(professorsSchedule)[0]);

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, var(--text-dim))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Faculty Matrix</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Schedules, attendance auditing, and automated payroll forecasting.</p>
        </div>
        
        <div style={{ minWidth: '300px' }}>
          <label className="input-label" style={{ marginBottom: '0.8rem', display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--secondary)' }}>Active Faculty</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(professorsSchedule).map((prof) => (
              <button
                key={prof}
                onClick={() => setSelectedProf(prof)}
                className={selectedProf === prof ? "primary" : "secondary"}
                style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              >
                {prof.replace('Prof. ', '')}
              </button>
            ))}
          </div>
        </div>
      </header>

      <ProfessorTimetable professorName={selectedProf} />
    </div>
  );
};

export default TimetableApp;
