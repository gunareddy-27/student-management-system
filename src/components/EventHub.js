import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Zap, Clock, Star } from 'lucide-react';

const EventHub = ({ enrolledCourses = [] }) => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Hackathon 2026', type: 'Fest', date: '2026-05-15', time: '09:00 AM', location: 'Main Auditorium', attendees: 450, rsvp: false, tags: ['CSE', 'Coding'] },
    { id: 2, title: 'AI Ethics Workshop', type: 'Seminar', date: '2026-04-30', time: '11:00 AM', location: 'Seminar Hall B', attendees: 120, rsvp: true, tags: ['AI', 'Philosophy'] },
    { id: 3, title: 'Annual Cultural Night', type: 'Fest', date: '2026-05-20', time: '06:00 PM', location: 'Open Grounds', attendees: 2000, rsvp: false, tags: ['Music', 'Dance'] },
    { id: 4, title: 'Quantum Computing Intro', type: 'Workshop', date: '2026-05-02', time: '02:00 PM', location: 'Lab 404', attendees: 45, rsvp: false, tags: ['Physics', 'Advanced'] },
    { id: 5, title: 'Career in Fintech', type: 'Seminar', date: '2026-04-28', time: '04:00 PM', location: 'Block C - 102', attendees: 85, rsvp: false, tags: ['Business', 'Math'] },
  ]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Countdown logic for the nearest major event (Hackathon)
  useEffect(() => {
    const targetDate = new Date('2026-05-15T09:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleRSVP = (id) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, rsvp: !ev.rsvp, attendees: ev.rsvp ? ev.attendees - 1 : ev.attendees + 1 } : ev
    ));
  };

  // AI-powered event suggestions logic
  const suggestedEvents = events.filter(ev => {
    // Check if event tags match enrolled course names
    const courseMatch = enrolledCourses.some(c => 
      ev.tags.some(tag => c.course_name?.toLowerCase().includes(tag.toLowerCase()) || c.course_code?.toLowerCase().includes(tag.toLowerCase()))
    );
    return courseMatch || ev.type === 'Fest'; // Fests are always suggested
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Featured Event Countdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
            borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', background: '#f59e0b', color: 'black', fontWeight: '900', borderRadius: '0 0 0 20px', fontSize: '0.7rem' }}>FEATURED EVENT</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>Campus Mega Hackathon 2026</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Join the largest coding battle of the year. Build, Innovate, Conquer.</p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs },
              ].map((t, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', minWidth: '70px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{String(t.val).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Events List */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'white' }}>
            <Calendar size={20} color="#8b5cf6" /> Upcoming Schedule
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((ev, i) => (
              <motion.div 
                key={ev.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: '50px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 'bold' }}>MAY</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{ev.date.split('-')[2]}</div>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>{ev.title}</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {ev.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {ev.location}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: '600' }}>{ev.attendees}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Attending</div>
                  </div>
                  <button 
                    onClick={() => toggleRSVP(ev.id)}
                    style={{ 
                      padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', 
                      background: ev.rsvp ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary)',
                      color: ev.rsvp ? '#34d399' : 'white', cursor: 'pointer', fontWeight: 'bold',
                      fontSize: '0.8rem', minWidth: '100px'
                    }}
                  >
                    {ev.rsvp ? '✓ Going' : 'RSVP Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ background: 'rgba(139, 92, 246, 0.05)', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8b5cf6', fontWeight: 'bold' }}>
            <Zap size={18} /> AI Personal Discovery
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Based on your enrollment in <strong>{enrolledCourses.length} courses</strong>, we recommend:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {suggestedEvents.slice(0, 3).map(ev => (
              <div key={ev.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 'bold', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Recommended</div>
                <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold', marginBottom: '0.4rem' }}>{ev.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {ev.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <Star size={16} color="#f59e0b" /> Your Activity
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Events Attended</span>
            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>12</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pending RSVPs</span>
            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{events.filter(e => !e.rsvp).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHub;
