import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Award, BookOpen, Clock, Zap, Fingerprint, QrCode, Wifi, Lock, Activity } from 'lucide-react';

const DigitalID = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36).substring(7));
  const [timeLeft, setTimeLeft] = useState(60);
  const [scanLogs, setScanLogs] = useState([
    { location: 'Main Gate', time: '08:45 AM', type: 'Entry' },
    { location: 'Central Library', time: '11:20 AM', type: 'Access' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRefreshKey(Math.random().toString(36).substring(7));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-20, 20]);
  const glareX = useTransform(mouseX, [-200, 200], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-200, 200], ["0%", "100%"]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const handleTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setScanLogs([{ location: 'Main Terminal', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'Verify' }, ...scanLogs.slice(0, 4)]);
    }, 800);
  };

  const [showLargeQR, setShowLargeQR] = useState(false);

  const QRSquare = ({ size = 100 }) => {
    const qrData = encodeURIComponent(`SECURE_ID:${student?.id}|TOKEN:${refreshKey}|VERIFIED`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&color=0f172a&bgcolor=ffffff`;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: `${size}px`, height: `${size}px`, background: 'white', borderRadius: '20px',
          padding: '12px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: size > 100 ? '0 0 50px rgba(99, 102, 241, 0.4)' : 'none',
          border: '4px solid rgba(255,255,255,0.1)'
        }}>
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: '#6366f1', zIndex: 5, boxShadow: '0 0 15px #6366f1' }}
          />
          <img src={qrUrl} alt="Student QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              initial={false}
              animate={{ width: `${(timeLeft / 60) * 100}%` }}
              style={{ height: '100%', background: timeLeft < 10 ? '#ef4444' : '#6366f1', boxShadow: `0 0 10px ${timeLeft < 10 ? '#ef4444' : '#6366f1'}` }}
            />
          </div>
          <span style={{ fontSize: '0.65rem', color: timeLeft < 10 ? '#ef4444' : 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontFamily: 'monospace' }}>{timeLeft}s</span>
        </div>
      </div>
    );
  };

  const idColor = student?.attendance > 85 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : (student?.attendance > 70 ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #f59e0b, #fbbf24)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', perspective: '1200px' }}>
      {/* Large QR Modal */}
      <AnimatePresence>
        {showLargeQR && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLargeQR(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(15px)' }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '4rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <QrCode size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>HOLOGRAPHIC ACCESS PASS</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Scan at any campus terminal for instant verification</p>
              </div>
              <QRSquare size={280} />
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ color: 'white', fontWeight: '900', fontSize: '1.4rem', marginBottom: '0.25rem' }}>{student?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontFamily: 'monospace' }}>#{student?.id} • {student?.email}</div>
              </div>
              <button 
                onClick={() => setShowLargeQR(false)}
                style={{ marginTop: '3rem', padding: '1rem 3rem', borderRadius: '20px', border: 'none', background: 'white', color: '#0f172a', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}
              >
                DISMISS PASS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ perspective: '1000px' }}>
        <motion.div
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            scale: isTapping ? 0.92 : 1,
            y: isTapping ? -15 : 0
          }}
          style={{
            width: '440px', height: '260px', cursor: 'pointer', position: 'relative',
            transformStyle: 'preserve-3d'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Holographic Glare */}
          <motion.div 
            style={{ 
              position: 'absolute', inset: 0, borderRadius: '32px', zIndex: 10, pointerEvents: 'none',
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              opacity: isFlipped ? 0 : 1
            }}
          />

          {/* FRONT SIDE */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(30px) saturate(150%)',
            borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(255,255,255,0.05)', overflow: 'hidden'
          }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>CORE-ID V.4</span>
               </div>
               <Wifi size={16} color="rgba(255,255,255,0.2)" />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
               <motion.div 
                 whileHover={{ scale: 1.1 }}
                 style={{ width: '90px', height: '90px', borderRadius: '24px', background: idColor, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
               >
                 <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>{student?.name?.charAt(0)}</span>
               </motion.div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <motion.h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>{student?.name}</motion.h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>UID-{student?.id}</span>
                    <div style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', fontSize: '0.6rem', color: 'white', fontWeight: 'bold' }}>UG-CSE</div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Clearance</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10b981' }}>LEVEL 4</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Expiry</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'white' }}>JUN 2027</div>
                  </div>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <Fingerprint size={32} color="rgba(255,255,255,0.1)" />
               </div>
            </div>

            {/* Micro-chip design */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '40px', height: '30px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '6px', opacity: 0.6, border: '1px solid rgba(255,255,255,0.2)' }}>
               <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            </div>

            {/* CampusCoins Display */}
            <div style={{ position: 'absolute', top: '5rem', right: '2rem', textAlign: 'right' }}>
               <div style={{ fontSize: '0.55rem', color: 'rgba(245, 158, 11, 0.6)', fontWeight: 'bold', textTransform: 'uppercase' }}>CampusCoins</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                 <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                 <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f59e0b', textShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}>{student?.campus_coins || 0}</span>
               </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(30px)',
            borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '2rem', display: 'flex', justifyContent: 'space-between',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)', rotateY: 180, overflow: 'hidden'
          }}>
             <div style={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '0.75rem', fontWeight: '900', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>VIRTUAL CREDENTIALS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <Lock size={14} color="#6366f1" />
                       <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{student?.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <MapPin size={14} color="#ec4899" />
                       <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>Resident - Block B</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>SIGNATURE HASH</div>
                   <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                     {refreshKey.toUpperCase()}-S83X-K92L-9921-X2
                   </div>
                </div>
             </div>
             
             <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <QRSquare size={120} />
                <div style={{ fontSize: '0.6rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', letterSpacing: '1px' }}>
                  RE-GEN ACTIVE
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Interactions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Zap size={20} color="#f59e0b" /> Command Center
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <motion.button 
              whileHover={{ scale: 1.02, background: 'rgba(99, 102, 241, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTap}
              disabled={isTapping}
              style={{ width: '100%', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'transparent', color: 'white', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              {isTapping ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Activity size={18} /></motion.div>
                  VERIFYING LINK...
                </>
              ) : (
                <>
                  <Fingerprint size={18} /> INITIALIZE NFC TAP
                </>
              )}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLargeQR(true)}
              style={{ width: '100%', padding: '1rem', borderRadius: '18px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <QrCode size={18} /> GENERATE PASS
            </motion.button>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Biometric Security</span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>ENABLED</span>
               </div>
               <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
               </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={20} color="#ec4899" /> Neural Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scanLogs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'white' }}>{log.location}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{log.time}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '8px', background: log.type === 'Verify' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)', color: log.type === 'Verify' ? '#818cf8' : 'white', fontSize: '0.65rem', fontWeight: '900', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {log.type.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalID;
