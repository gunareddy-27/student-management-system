import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Award, BookOpen, Clock, Zap } from 'lucide-react';

const DigitalID = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [scanLogs, setScanLogs] = useState([
    { location: 'Main Gate', time: '08:45 AM', type: 'Entry' },
    { location: 'Central Library', time: '11:20 AM', type: 'Access' }
  ]);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setScanLogs([{ location: 'Dashboard Terminal', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'Verify' }, ...scanLogs.slice(0, 4)]);
    }, 1000);
  };

  const [showLargeQR, setShowLargeQR] = useState(false);

  const QRSquare = ({ size = 100 }) => {
    const qrData = encodeURIComponent(`Name: ${student?.name}\nID: ${student?.id}\nPhone: ${student?.phone}\nStatus: Verified Student`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}`;
    
    return (
      <div style={{
        width: `${size}px`, height: `${size}px`, background: 'white', borderRadius: '12px',
        padding: '8px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center',
        boxShadow: size > 100 ? '0 0 30px rgba(59, 130, 246, 0.3)' : 'none'
      }}>
        <motion.div 
          animate={{ y: [0, size - 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(59, 130, 246, 0.8)', zIndex: 5, boxShadow: '0 0 12px #3b82f6' }}
        />
        <img src={qrUrl} alt="Student QR" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };

  const studentStatus = student?.attendance > 85 ? 'In Lecture' : (student?.attendance > 70 ? 'In Library' : 'Active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
      {/* Large QR Modal */}
      <AnimatePresence>
        {showLargeQR && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLargeQR(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5, rotate: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
            >
              <h3 style={{ color: 'white', marginBottom: '2rem' }}>Verified Campus Access Pass</h3>
              <QRSquare size={250} />
              <div style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{student?.name}</div>
                <div>ID: #{student?.id}</div>
                <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 'bold' }}>SCAN READY</div>
              </div>
              <button 
                onClick={() => setShowLargeQR(false)}
                style={{ marginTop: '2rem', padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', background: 'white', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Close Pass
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
            scale: isTapping ? 0.95 : 1,
            y: isTapping ? -20 : 0
          }}
          style={{
            width: '400px', height: '240px', cursor: 'pointer', position: 'relative',
            transformStyle: 'preserve-3d', rotateX, rotateY
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* FRONT SIDE */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)',
            borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
          }}>
            {/* Security Ticker */}
            <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, height: '20px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <motion.div 
                animate={{ x: [0, -400] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ whiteSpace: 'nowrap', fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '2px' }}
              >
                SECURE ACCESS KEY: {student?.id || '0000'} - VERIFIED {new Date().toLocaleDateString()} - ENCRYPTED CAMPUS ID - DO NOT DUPLICATE - 
              </motion.div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{student?.name?.charAt(0)}</span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{student?.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>STUDENT ID: #{student?.id}</p>
                </div>
              </div>
              <Shield size={24} color="#60a5fa" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} /> {studentStatus}
                </span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.65rem', color: 'white', opacity: 0.8 }}>Mob: +91 {student?.phone || 'N/A'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Verified Entity</div>
                <div style={{ fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}>B.Tech CSE</div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(24px)',
            borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem', display: 'flex', justifyContent: 'space-between',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', rotateY: 180, overflow: 'hidden'
          }}>
             <div style={{ width: '60%' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Identity Credentials</h4>
                <div style={{ fontSize: '0.75rem', color: 'white', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>📞 Phone: +91 {student?.phone}</div>
                  <div style={{ marginBottom: '0.5rem' }}>📧 Email: {student?.email}</div>
                  <div>📍 Res: Hyderabad, IN</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2rem' }}>
                  This card is property of Malla Reddy University. If found, please return to Admin Block.
                </div>
             </div>
             <div style={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <QRSquare size={100} />
                <div style={{ fontSize: '0.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>SCAN FOR STUDENT<br/>FULL DATA VERIFICATION</div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* ID Interactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} color="#10b981" /> Card Actions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={handleTap}
              disabled={isTapping}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isTapping ? 'Verifying...' : 'Simulate NFC Tap'}
            </button>
            <button 
              onClick={() => setShowLargeQR(true)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--primary)', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              View Large Scannable QR
            </button>
            <button style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
              Add to Apple/Google Wallet
            </button>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="#8b5cf6" /> Recent Access Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scanLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'white' }}>{log.location}</span>
                <span style={{ color: 'var(--text-dim)' }}>{log.time} • <span style={{ color: '#10b981' }}>{log.type}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalID;
