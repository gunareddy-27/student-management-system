import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Siren, Phone, MapPin, ShieldAlert, Heart, Flame, 
  MessageSquare, User, Activity, Bell, X, ShieldCheck,
  AlertTriangle, Navigation, Zap, Wifi
} from 'lucide-react';

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sosLevel, setSosLevel] = useState(null); // medical, security, fire, harassment
  const [status, setStatus] = useState('idle'); // idle, dispatching, active, resolved
  const [countdown, setCountdown] = useState(5);
  const [isSilent, setIsSilent] = useState(false);
  const [responderDistance, setResponderDistance] = useState(1.2);

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Help', icon: <Heart size={24}/>, color: '#ef4444', desc: 'Accident, injury, or health crisis.' },
    { id: 'security', name: 'Security Alert', icon: <ShieldAlert size={24}/>, color: '#3b82f6', desc: 'Suspicious activity or physical threat.' },
    { id: 'fire', name: 'Fire Emergency', icon: <Flame size={24}/>, color: '#f59e0b', desc: 'Fire, smoke, or chemical spill.' },
    { id: 'harassment', name: 'Harassment', icon: <User size={24}/>, color: '#ec4899', desc: 'Stalking, bullying, or unsafe environment.' }
  ];

  useEffect(() => {
    let timer;
    if (status === 'dispatching' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (status === 'dispatching' && countdown === 0) {
      setStatus('active');
    }
    return () => clearInterval(timer);
  }, [status, countdown]);

  useEffect(() => {
    let distTimer;
    if (status === 'active' && responderDistance > 0.1) {
      distTimer = setInterval(() => {
        setResponderDistance(d => Math.max(0.1, d - 0.1));
      }, 3000);
    }
    return () => clearInterval(distTimer);
  }, [status, responderDistance]);

  const triggerSOS = (type) => {
    setSosLevel(type);
    setStatus('dispatching');
    setCountdown(5);
  };

  const cancelSOS = () => {
    setStatus('idle');
    setSosLevel(null);
    setCountdown(5);
  };

  return (
    <>
      {/* Global FAB Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '70px', height: '70px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', color: 'white', border: 'none',
          boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4)', cursor: 'pointer', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 10000, border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        <Siren size={32} className="animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            
            {/* Pulsing Background when active */}
            {status === 'active' && (
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
              />
            )}

            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              style={{ width: '100%', maxWidth: '500px', background: '#0f172a', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', position: 'relative' }}
            >
              {/* Header */}
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldAlert color="#ef4444" /> CAMPUS <span style={{ color: '#ef4444' }}>SOS</span>
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', letterSpacing: '1px' }}>ENCRYPTED EMERGENCY PROTOCOL</div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24}/></button>
              </div>

              <div style={{ padding: '2.5rem' }}>
                {status === 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '0.95rem' }}>Select the type of emergency for immediate dispatch.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                       {emergencyTypes.map(type => (
                         <button 
                           key={type.id}
                           onClick={() => triggerSOS(type)}
                           style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
                         >
                           <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: `${type.color}20`, color: type.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{type.icon}</div>
                           <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{type.name}</div>
                         </button>
                       ))}
                    </div>
                    
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Silent Alert Mode</span>
                          <button onClick={() => setIsSilent(!isSilent)} style={{ width: '45px', height: '24px', borderRadius: '12px', background: isSilent ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', position: 'relative', cursor: 'pointer' }}>
                             <motion.div animate={{ left: isSilent ? '23px' : '3px' }} style={{ position: 'absolute', top: '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%' }} />
                          </button>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Silent mode alerts security without activating local alarms or sirens.</p>
                    </div>
                  </motion.div>
                )}

                {status === 'dispatching' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 2.5rem auto' }}>
                       <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                          <motion.circle 
                            cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="5"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * (5 - countdown) / 5) }}
                          />
                       </svg>
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: '900' }}>{countdown}</div>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sending Signal...</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Automatic dispatch in progress.</p>
                    <button onClick={cancelSOS} style={{ padding: '0.8rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer' }}>Abort SOS</button>
                  </div>
                )}

                {status === 'active' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', border: '1px solid #ef4444', textAlign: 'center', marginBottom: '2rem' }}>
                       <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>ALERT BROADCASTED</h3>
                       <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Your location (Engineering Wing, Room 302) is shared.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><User size={20}/></div>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Responder: Officer Singh</div>
                             <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>ETA: {responderDistance.toFixed(1)} mins</div>
                          </div>
                          <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}><Phone size={16}/></button>
                       </div>
                       
                       <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ShieldCheck size={20}/></div>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Safety Hub Notified</div>
                             <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Remote camera surveillance active.</div>
                          </div>
                       </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                       <button onClick={() => setStatus('resolved')} style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: '#10b981', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>I am Safe Now</button>
                       <button style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Audio Link</button>
                    </div>
                  </motion.div>
                )}

                {status === 'resolved' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                       <ShieldCheck size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SOS Resolved</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Security has been notified that you are safe. A post-incident report has been generated.</p>
                    <button onClick={cancelSOS} style={{ padding: '1rem 3rem', borderRadius: '16px', background: 'var(--primary)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Close Protocol</button>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                   <Wifi size={12} color="#10b981" /> ENCRYPTED CONNECTION
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                   <Zap size={12} color="#f59e0b" /> BATTERY: 88%
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
};

export default EmergencySOS;
