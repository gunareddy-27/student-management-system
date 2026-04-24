import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, X } from 'lucide-react';

const PeerTutorSOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle'); // idle, seeking, matched

  const handleRequestHelp = () => {
    if (!subject || !description) return;
    setStatus('seeking');
    
    // Simulate finding a peer
    setTimeout(() => {
      setStatus('matched');
    }, 3000);
  };

  const closeSOS = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setSubject('');
      setDescription('');
    }, 300);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
        title="I'm Stuck! Request Peer Help"
      >
        <HelpCircle size={30} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'var(--surface)', padding: '2rem', borderRadius: '16px',
                width: '400px', maxWidth: '90%', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <button onClick={closeSOS} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, color: 'white' }}>
                <HelpCircle color="#8b5cf6" /> Live Peer Support
              </h2>
              
              {status === 'idle' && (
                <>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Stuck on a problem? Request immediate help from online peers excelling in this subject.
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Subject/Topic</label>
                    <input 
                      type="text" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)} 
                      placeholder="e.g. Data Structures, React Hooks..."
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Describe the issue</label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="I keep getting a NullReferenceException when..."
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '100px', resize: 'vertical' }}
                    />
                  </div>
                  
                  <button 
                    onClick={handleRequestHelp}
                    disabled={!subject || !description}
                    style={{ width: '100%', padding: '1rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (!subject || !description) ? 'not-allowed' : 'pointer', opacity: (!subject || !description) ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Send size={18} /> Request Match
                  </button>
                </>
              )}

              {status === 'seeking' && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '50px', height: '50px', border: '4px solid rgba(139, 92, 246, 0.3)', borderTopColor: '#8b5cf6', borderRadius: '50%', margin: '0 auto 1.5rem' }}
                  />
                  <h3 style={{ color: 'white' }}>Finding a Tutor...</h3>
                  <p style={{ color: 'var(--text-dim)' }}>Broadcasting to 14 online students who excel in {subject}.</p>
                </div>
              )}

              {status === 'matched' && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>✅</span>
                  </div>
                  <h3 style={{ color: 'white' }}>Match Found!</h3>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}><strong>Alex T.</strong> (A+ in {subject}) has accepted your request.</p>
                  <button 
                    onClick={closeSOS}
                    style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Join Live Session
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PeerTutorSOS;
