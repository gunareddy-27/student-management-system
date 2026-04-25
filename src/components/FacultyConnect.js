import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Microscope, MessageSquare, Video, Clock, Star, Zap, BookOpen } from 'lucide-react';

const FacultyConnect = () => {
  const [selectedProf, setSelectedProf] = useState(null);

  const professors = [
    { id: 1, name: 'Dr. Sarah Johnson', Dept: 'AI & Data Science', status: 'Online', rating: 4.9, research: 'Neural Architectures', availability: '2:00 PM - 4:00 PM' },
    { id: 2, name: 'Prof. Michael Chen', Dept: 'Cybersecurity', status: 'In Meeting', rating: 4.8, research: 'Blockchain Security', availability: '4:30 PM - 5:30 PM' },
    { id: 3, name: 'Dr. Emily White', Dept: 'Software Eng', status: 'Online', rating: 5.0, research: 'Human-Computer Interaction', availability: 'Now' },
    { id: 4, name: 'Dr. Robert Brown', Dept: 'Cloud Computing', status: 'Away', rating: 4.7, research: 'Edge Computing', availability: 'Tomorrow' },
  ];

  const projects = [
    { title: 'Autonomous Drone Swarms', ledBy: 'Dr. Sarah Johnson', spots: 2, difficulty: 'High' },
    { title: 'Zero-Knowledge Auth', ledBy: 'Prof. Michael Chen', spots: 5, difficulty: 'Medium' },
  ];

  return (
    <div style={{ color: 'white' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users color="#ec4899" size={28} /> Faculty Connect & Research
        </h2>
        <p style={{ color: 'var(--text-dim)', margin: '0.5rem 0 0' }}>Collaborate with world-class faculty and join cutting-edge research.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>Faculty Intelligence Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {professors.map(prof => (
              <motion.div
                key={prof.id}
                whileHover={{ y: -8, background: 'rgba(255,255,255,0.04)', borderColor: '#ec4899' }}
                onClick={() => setSelectedProf(prof)}
                style={{ 
                  background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '2rem', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Decorative Background Glow */}
                <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '100px', height: '100px', background: prof.status === 'Online' ? '#10b981' : '#ec4899', filter: 'blur(60px)', opacity: 0.15 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: '900', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {prof.name.split(' ')[1][0]}
                    </div>
                    {prof.status === 'Online' && (
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', background: '#10b981', border: '3px solid #0f172a', borderRadius: '50%' }} />
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '900' }}>
                      <Star size={14} fill="#f59e0b" /> {prof.rating}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Mentorship Score
                    </div>
                  </div>
                </div>

                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', fontWeight: '800' }}>{prof.name}</h4>
                <div style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }} /> {prof.Dept}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    <Microscope size={16} color="#ec4899" /> <span>{prof.research}</span>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    <Clock size={16} color="#8b5cf6" /> <span>Available: {prof.availability}</span>
                  </div>
                </div>

                <motion.div 
                  whileHover={{ opacity: 1 }}
                  style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', opacity: 0, transition: '0.3s' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Zap size={16} />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(165deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '32px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontWeight: '800' }}>
              <Zap size={20} color="#f59e0b" /> Collaboration Lab
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map((proj, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.25rem', color: 'white' }}>{proj.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Principal Investigator: {proj.ledBy}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: 'bold' }}>{proj.spots} Vacancies</span>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: 'bold' }}>{proj.difficulty}</span>
                    </div>
                    <button style={{ padding: '0.4rem 1rem', borderRadius: '10px', border: 'none', background: 'white', color: '#0f172a', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer' }}>JOIN</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontWeight: '800' }}>
              <BookOpen size={20} color="#8b5cf6" /> Co-Author Matrix
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Anush G.', research: 'Quantum ML', match: '98%' },
                { name: 'Megha S.', research: 'Sustainable Cities', match: '85%' }
              ].map((p, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'white' }}>{p.name}</span>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '900' }}>{p.match} MATCH</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Focusing on: <span style={{ color: 'white' }}>{p.research}</span></div>
                  <button style={{ width: '100%', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.3)', background: 'transparent', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer', transition: '0.3s' }}>INITIATE COLLABORATION</button>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedProf && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ background: 'linear-gradient(145deg, #1e1b4b, #312e81)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '1.5rem' }}
              >
                <h4 style={{ margin: '0 0 1rem 0' }}>Connect with {selectedProf.name.split(' ')[1]}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <MessageSquare size={18} /> <span style={{ fontSize: '0.7rem' }}>Chat</span>
                  </button>
                  <button style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <Video size={18} /> <span style={{ fontSize: '0.7rem' }}>Meet</span>
                  </button>
                </div>
                <button onClick={() => setSelectedProf(null)} style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FacultyConnect;
