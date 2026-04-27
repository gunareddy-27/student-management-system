import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, Meh, Frown, EyeOff, Wind, Coffee, Zap, Timer, X } from 'lucide-react';

const WellbeingCheck = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState(null);
  const [stressReason, setStressReason] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 mins

  // Auto-trigger check-in
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFocusMode) setShowCheck(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, [isFocusMode]);

  // Focus Timer Logic
  useEffect(() => {
    let interval = null;
    if (isFocusMode && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev - 1);
      }, 1000);
    } else if (focusTime === 0) {
      setIsFocusMode(false);
      setFocusTime(25 * 60);
      alert("Focus Session Complete! Time for a break.");
    }
    return () => clearInterval(interval);
  }, [isFocusMode, focusTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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

  const stressOptions = [
    { id: 'exams', label: 'Upcoming Exams', icon: '📝' },
    { id: 'assignments', label: 'Heavy Workload', icon: '💻' },
    { id: 'personal', label: 'Personal Issues', icon: '🏠' },
    { id: 'health', label: 'Physical Health', icon: '🍎' }
  ];

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      
      {/* Focus Mode Toggle */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsFocusMode(true)}
        style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#6366f1',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '12px',
        }}
      >
        <EyeOff size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Focus Mode</span>
      </motion.button>

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
          borderRadius: '12px',
          border: '1px solid rgba(236, 72, 153, 0.3)',
        }}
      >
        <Heart size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Check-in</span>
      </button>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(5, 5, 20, 0.98)',
              zIndex: 10000,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <motion.div 
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }}
            />
            
            <div style={{ position: 'relative', textAlign: 'center' }}>
               <h1 style={{ color: 'white', fontSize: '10rem', fontWeight: '900', margin: 0, opacity: 0.8, letterSpacing: '-5px' }}>
                 {formatTime(focusTime)}
               </h1>
               <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '-20px' }}>
                 Distraction Free Zone
               </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
               {[
                 { icon: <Wind size={20} />, label: "White Noise" },
                 { icon: <Coffee size={20} />, label: "Take Break" },
                 { icon: <Timer size={20} />, label: "Reset" }
               ].map((ctrl, i) => (
                 <button key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem', borderRadius: '16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {ctrl.icon} {ctrl.label}
                 </button>
               ))}
            </div>

            <button 
              onClick={() => setIsFocusMode(false)}
              style={{ position: 'absolute', top: '3rem', right: '3rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              <X size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                padding: '3rem',
                borderRadius: '32px',
                width: '500px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {!submitted ? (
                <>
                  {!mood ? (
                    <>
                      <div style={{ width: '80px', height: '80px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem', color: '#ec4899' }}>
                        <Heart size={40} />
                      </div>
                      <h2 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '900' }}>Well-being Sync</h2>
                      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem' }}>Your digital pulse check. How are we doing?</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
                        <motion.button whileHover={{ y: -5 }} onClick={() => handleResponse('smile')} style={{ flex: 1, padding: '2rem 0', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', cursor: 'pointer' }}>
                          <Smile size={48} />
                        </motion.button>
                        <motion.button whileHover={{ y: -5 }} onClick={() => handleResponse('meh')} style={{ flex: 1, padding: '2rem 0', borderRadius: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', cursor: 'pointer' }}>
                          <Meh size={48} />
                        </motion.button>
                        <motion.button whileHover={{ y: -5 }} onClick={() => handleResponse('frown')} style={{ flex: 1, padding: '2rem 0', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer' }}>
                          <Frown size={48} />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h2 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '900' }}>Deep Breath...</h2>
                      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem' }}>Identifying stressors can help in management.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {stressOptions.map(opt => (
                          <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                            onClick={() => handleStressReason(opt.id)}
                            style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}
                          >
                            <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{opt.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <button onClick={() => setShowCheck(false)} style={{ marginTop: '3rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontWeight: 'bold' }}>
                    Snooze Check-in
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '40px', background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem' }}>
                    <span style={{ fontSize: '3rem' }}>{mood === 'smile' ? '🌟' : (mood === 'meh' ? '☕' : '🧘')}</span>
                  </div>
                  <h2 style={{ color: 'white', fontWeight: '900' }}>{mood === 'smile' ? 'Vibrant!' : (mood === 'meh' ? 'Stay Centered' : 'Zen Space')}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                    {stressReason === 'exams' && "The neural pathways respond well to intervals. Try 50/10 split today."}
                    {stressReason === 'assignments' && "Focus on the smallest atomic task first. Momentum is your friend."}
                    {stressReason === 'personal' && "Balance is key. Campus wellness hubs are open for anonymous chat."}
                    {stressReason === 'health' && "Hydration is the simplest performance booster. Grab a glass of water!"}
                    {!stressReason && "Synchronized. You're operating at peak mental efficiency."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WellbeingCheck;
