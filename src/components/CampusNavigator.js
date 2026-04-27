import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon, Navigation, Search, Info, 
  MapPin, Clock, Users, Zap, Layers, Compass, 
  ArrowRight, Wind, AlertTriangle, Siren, ShieldCheck,
  Eye, Droplets, Thermometer, Wifi, Activity, Maximize2,
  Calendar, Coffee, Landmark, HelpCircle, Footprints
} from 'lucide-react';

const CampusNavigator = ({ socket }) => {
  const [liveBlocks, setLiveBlocks] = useState([
    { id: 'A', name: 'Admin Block', type: 'academics', x: 120, y: 100, info: 'Management, Admissions, Registrar Office', rooms: 24, occupancy: 45, status: 'Normal', events: ['Admin Meeting - 2PM'] },
    { id: 'B', name: 'Engineering Wing', type: 'academics', x: 100, y: 350, info: 'CSE Dept, Advanced AI Lab, Robotics Lab', rooms: 86, occupancy: 92, status: 'Critical', events: ['AI Hackathon - Live'] },
    { id: 'C', name: 'Central Library', type: 'academics', x: 420, y: 180, info: 'Digital Archives, Reading Halls, Study Pods', rooms: 12, occupancy: 78, status: 'Busy', events: ['Book Fair - 10AM'] },
    { id: 'D', name: 'Sports Arena', type: 'sports', x: 350, y: 480, info: 'Olympic Pool, Indoor Courts, Fitness Center', rooms: 15, occupancy: 30, status: 'Normal', events: ['Basketball Finals - 5PM'] },
    { id: 'E', name: 'Global Food Court', type: 'social', x: 650, y: 420, info: 'Multicuisine Cafeteria, Student Lounge', rooms: 8, occupancy: 85, status: 'High Traffic', events: ['Live Music - 7PM'] },
    { id: 'F', name: 'Elite Hostels', type: 'social', x: 700, y: 120, info: 'Residential Quarters, Guest House', rooms: 240, occupancy: 60, status: 'Normal', events: ['Hostel Night - Sat'] },
    { id: 'G', name: 'Innovation Hub', type: 'academics', x: 300, y: 50, info: 'Startup Incubator, Hackathon Zone', rooms: 18, occupancy: 55, status: 'Normal', events: ['Pitch Deck Workshop'] },
  ]);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null); // null, checking, success
  const [userLocation, setUserLocation] = useState({ x: 450, y: 350 });
  const [navFrom, setNavFrom] = useState('');
  const [navTo, setNavTo] = useState('');
  const [isPathfinding, setIsPathfinding] = useState(false);

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setUserLocation({ x: block.x + 20, y: block.y + 20 });
  };

  const handleNavigate = () => {
    if (!navFrom || !navTo) return;
    setIsPathfinding(true);
    setTimeout(() => {
      setIsPathfinding(false);
      alert(`Path calculated from ${navFrom} to ${navTo}`);
    }, 1500);
  };

  const performCheckIn = () => {
    setCheckInStatus('checking');
    setTimeout(() => {
      setCheckInStatus('success');
      if (socket) socket.emit('CAMPUS_PULSE', {
        message: `Student verified at ${selectedBlock.name} via Geofence`,
        type: 'attendance'
      });
      setTimeout(() => setCheckInStatus(null), 3000);
    }, 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', height: '750px', color: 'white' }}>
      
      {/* MAIN MAP AREA */}
      <div style={{ 
        position: 'relative', 
        background: '#020617',
        borderRadius: '32px', 
        border: '1px solid rgba(255,255,255,0.08)', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s'
      }}>
        
        {/* Check-in Overlay */}
        <AnimatePresence>
          {checkInStatus && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.9)', zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}
            >
              {checkInStatus === 'checking' ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ width: '100px', height: '100px', border: '4px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%' }}
                  />
                  <h2 style={{ marginTop: '2rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Biometric Verification</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)' }}>Syncing with Block {selectedBlock?.id} Geofence...</p>
                </>
              ) : (
                <>
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '100px', height: '100px', background: '#10b981', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ShieldCheck size={60} color="white" />
                   </motion.div>
                   <h2 style={{ marginTop: '2rem', color: '#10b981' }}>Attendance Recorded</h2>
                   <p style={{ color: 'rgba(255,255,255,0.4)' }}>Location Authenticated at {selectedBlock?.name}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radar Effect background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '50%' }} />
        </div>

        {/* SVG Viewport */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
           <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 900 700">
             <defs>
               <filter id="glow">
                 <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
             
             {/* Buildings */}
             {liveBlocks.map(b => (
               <g key={b.id} onClick={() => handleBlockClick(b)} style={{ cursor: 'pointer' }}>
                 <motion.rect 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   x={b.x - 40} y={b.y - 40} width="80" height="80" rx="16"
                   fill={selectedBlock?.id === b.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.03)'}
                   stroke={selectedBlock?.id === b.id ? '#6366f1' : 'rgba(255,255,255,0.1)'}
                   strokeWidth="2"
                 />
                 <text x={b.x} y={b.y + 60} textAnchor="middle" fill="white" style={{ fontSize: '10px', fontWeight: 'bold', opacity: 0.7 }}>{b.name}</text>
                 <circle cx={b.x} cy={b.y} r="4" fill={b.status === 'Critical' ? '#ef4444' : '#10b981'} />
               </g>
             ))}

             {/* User Location Marker */}
             <motion.g animate={{ x: userLocation.x, y: userLocation.y }}>
                <circle r="15" fill="rgba(99, 102, 241, 0.2)" />
                <motion.circle 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  r="25" stroke="#6366f1" strokeWidth="1" fill="none"
                />
                <MapPin size={20} x={-10} y={-20} color="#6366f1" />
             </motion.g>
           </svg>
        </div>
      </div>

      {/* SIDEBAR UI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Navigation Control */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
           <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={18} color="#6366f1" /> SMART NAV
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <select value={navFrom} onChange={(e) => setNavFrom(e.target.value)} style={{ padding: '0.75rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}>
                 <option value="">Starting From...</option>
                 {liveBlocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={navTo} onChange={(e) => setNavTo(e.target.value)} style={{ padding: '0.75rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}>
                 <option value="">Destination...</option>
                 {liveBlocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

            <button 
              onClick={handleNavigate}
              disabled={isPathfinding}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem',
                marginTop: '0.5rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' 
              }}
            >
              {isPathfinding ? 'Optimizing Route...' : 'Start Navigation'}
            </button>
          </div>
        </div>

        {/* Selected Block Info */}
        <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' }}>
           <AnimatePresence mode="wait">
             {selectedBlock ? (
               <motion.div
                 key={selectedBlock.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
               >
                 <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>{selectedBlock.name}</h2>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Block {selectedBlock.id} • {selectedBlock.type}</span>
                      </div>
                      <div style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: selectedBlock.status === 'Critical' ? '#ef4444' : '#10b981', fontSize: '0.6rem', fontWeight: 'bold' }}>{selectedBlock.status}</div>
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Live Crowd</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: selectedBlock.occupancy > 80 ? '#ef4444' : '#10b981' }}>{selectedBlock.occupancy}%</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>WiFi Nodes</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>12 Active</div>
                    </div>
                 </div>

                 <div>
                    <h5 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> Active Events
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       {selectedBlock.events.map((e, i) => (
                         <div key={i} style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>{e}</div>
                       ))}
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                    <button style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>View Floor Directory</button>
                    <button style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Eye size={16} /> Virtual Tour (360°)
                    </button>
                 </div>
               </motion.div>
             ) : (
               <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.3 }}>
                 <Compass size={48} style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
                 <p style={{ fontSize: '0.85rem' }}>Select a Block to view<br/>Spatial Intelligence</p>
               </div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Stats Small */}
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
           <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Campus Status: OPTIMAL</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default CampusNavigator;
