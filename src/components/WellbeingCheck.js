import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, Meh, Frown } from 'lucide-react';

const WellbeingCheck = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState(null);
  const [stressReason, setStressReason] = useState(null);

  // Auto-trigger after a while (simulating long study session)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheck(true);
    }, 120000); // 2 minutes for demo purposes
    return () => clearTimeout(timer);
  }, []);

  const handleResponse = (selectedMood) => {
    setMood(selectedMood);
    if (selectedMood !== 'frown') {
      completeCheckin();
    }
  };

  const handleStressReason = (reason) => {
    setStressReason(reason);
    completeCheckin();
  };

  const completeCheckin = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowCheck(false);
      setSubmitted(false);
      setMood(null);
      setStressReason(null);
    }, 4000);
  };

  const buttonStyle = {
    flex: 1, padding: '1.5rem 0', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'
  };

  const stressOptions = [
    { id: 'exams', label: 'Upcoming Exams', icon: '📝' },
    { id: 'assignments', label: 'Heavy Workload', icon: '💻' },
    { id: 'personal', label: 'Personal Issues', icon: '🏠' },
    { id: 'health', label: 'Physical Health', icon: '🍎' }
  ];

  return (
    <>
      <button 
        onClick={() => setShowCheck(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ec4899',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(236, 72, 153, 0.3)',
        }}
      >
        <Heart size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Well-being</span>
      </button>

      <AnimatePresence>
        {showCheck && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9000
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: 'linear-gradient(145deg, #1e1b4b, #312e81)',
                padding: '2.5rem',
                borderRadius: '24px',
                width: '450px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {!submitted ? (
                <>
                  {!mood ? (
                    <>
                      <div style={{ width: '60px', height: '60px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem', color: '#ec4899' }}>
                        <Heart size={30} />
                      </div>
                      <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Time for a quick check-in!</h2>
                      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>You've been active for a while. How are you feeling right now?</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleResponse('smile')} style={{ ...buttonStyle, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                          <Smile size={32} />
                          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Great</div>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleResponse('meh')} style={{ ...buttonStyle, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
                          <Meh size={32} />
                          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Okay</div>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleResponse('frown')} style={{ ...buttonStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                          <Frown size={32} />
                          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Stressed</div>
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>We're here for you.</h2>
                      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>What's weighing on your mind today?</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {stressOptions.map(opt => (
                          <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                            onClick={() => handleStressReason(opt.id)}
                            style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                          >
                            <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                            <span style={{ fontSize: '0.8rem' }}>{opt.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <button onClick={() => setShowCheck(false)} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Skip for now
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: mood === 'smile' ? '#10b981' : (mood === 'meh' ? '#f59e0b' : '#6366f1'), display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{mood === 'smile' ? '🎉' : (mood === 'meh' ? '🍵' : '🧘')}</span>
                  </div>
                  <h2 style={{ color: 'white' }}>{mood === 'smile' ? 'Keep it up!' : (mood === 'meh' ? 'Take a breather' : 'You got this')}</h2>
                  <p style={{ color: 'var(--text-dim)', lineHeight: '1.5' }}>
                    {stressReason === 'exams' && "Try the Pomodoro technique: 25 mins study, 5 mins rest. It helps with focus!"}
                    {stressReason === 'assignments' && "Break your tasks into tiny chunks. One small step at a time is still progress."}
                    {stressReason === 'personal' && "It's okay to talk to someone. Our campus counselors are available 24/7."}
                    {stressReason === 'health' && "Maybe a quick walk or drinking some water would help? Take care of yourself."}
                    {!stressReason && "Remember to take a 5-minute break. You're doing great!"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WellbeingCheck;
