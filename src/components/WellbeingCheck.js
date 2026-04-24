import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, Meh, Frown } from 'lucide-react';

const WellbeingCheck = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-trigger after a while (simulating long study session)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheck(true);
    }, 120000); // 2 minutes for demo purposes
    return () => clearTimeout(timer);
  }, []);

  const handleResponse = (mood) => {
    setSubmitted(true);
    
    // If mood is bad, we could trigger a special alert or offer resources
    if (mood === 'frown') {
      // e.g. prompt to talk to counselor
    }

    setTimeout(() => {
      setShowCheck(false);
      setSubmitted(false);
    }, 3000);
  };

  const buttonStyle = {
    flex: 1, padding: '1.5rem 0', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'
  };

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
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
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
                width: '400px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {!submitted ? (
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
                  
                  <button onClick={() => setShowCheck(false)} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Skip for now
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>✨</span>
                  </div>
                  <h2 style={{ color: 'white' }}>Thanks for sharing!</h2>
                  <p style={{ color: 'var(--text-dim)' }}>Remember to take a 5-minute break and hydrate. You're doing great!</p>
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
