import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon, Navigation, Search, Info, 
  MapPin, Clock, Users, Zap, Layers, Compass, 
  ArrowRight, Wind, AlertTriangle, Siren, ShieldCheck
} from 'lucide-react';

const CampusNavigator = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [navFrom, setNavFrom] = useState('');
  const [navTo, setNavTo] = useState('');
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [mapCategory, setMapCategory] = useState('all'); // all, academics, social, sports
  const [timeOfDay, setTimeOfDay] = useState('Day');
  const [isAlerting, setIsAlerting] = useState(false);

  const blocks = [
    { id: 'A', name: 'Admin Block', type: 'academics', x: 120, y: 100, info: 'Management, Admissions, Registrar Office', rooms: 24, occupancy: 45 },
    { id: 'B', name: 'Engineering Wing', type: 'academics', x: 100, y: 350, info: 'CSE Dept, Advanced AI Lab, Robotics Lab', rooms: 86, occupancy: 92 },
    { id: 'C', name: 'Central Library', type: 'academics', x: 420, y: 180, info: 'Digital Archives, Reading Halls, Study Pods', rooms: 12, occupancy: 78 },
    { id: 'D', name: 'Sports Arena', type: 'sports', x: 350, y: 480, info: 'Olympic Pool, Indoor Courts, Fitness Center', rooms: 15, occupancy: 30 },
    { id: 'E', name: 'Global Food Court', type: 'social', x: 650, y: 420, info: 'Multicuisine Cafeteria, Student Lounge', rooms: 8, occupancy: 85 },
    { id: 'F', name: 'Elite Hostels', type: 'social', x: 700, y: 120, info: 'Residential Quarters, Guest House', rooms: 240, occupancy: 60 },
    { id: 'G', name: 'Innovation Hub', type: 'academics', x: 300, y: 50, info: 'Startup Incubator, Hackathon Zone', rooms: 18, occupancy: 55 },
  ];

  const handleNavigate = () => {
    if (!navFrom || !navTo) return;
    setIsPathfinding(true);
    setShowPath(false);
    setTimeout(() => {
      setIsPathfinding(false);
      setShowPath(true);
    }, 1500);
  };

  const toggleSOS = () => {
    setIsAlerting(!isAlerting);
  };

  const activePath = useMemo(() => {
    if (!showPath) return null;
    const start = blocks.find(b => b.id === navFrom);
    const end = blocks.find(b => b.id === navTo);
    if (!start || !end) return null;
    return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2 + 50} ${(start.y + end.y) / 2 - 50} ${end.x} ${end.y}`;
  }, [showPath, navFrom, navTo]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', height: '700px' }}>
      {/* MAP AREA */}
      <div style={{ 
        position: 'relative', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        borderRadius: '32px', 
        border: isAlerting ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.08)', 
        overflow: 'hidden', 
        boxShadow: isAlerting ? 'inset 0 0 50px rgba(239, 68, 68, 0.4)' : 'inset 0 0 100px rgba(0,0,0,0.5)',
        transition: 'all 0.3s'
      }}>
        
        {isAlerting && (
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', pointerEvents: 'none', zIndex: 100 }} 
          />
        )}

        {/* Map Header Overlay */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.4rem', borderRadius: '14px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['all', 'academics', 'social', 'sports'].map(cat => (
              <button 
                key={cat}
                onClick={() => setMapCategory(cat)}
                style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: mapCategory === cat ? 'var(--primary)' : 'transparent', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSOS}
              style={{ padding: '0.6rem 1.25rem', background: isAlerting ? '#ef4444' : 'rgba(239, 68, 68, 0.1)', color: isAlerting ? 'white' : '#ef4444', borderRadius: '14px', fontSize: '0.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', letterSpacing: '1px' }}
            >
              <Siren size={16} /> {isAlerting ? 'CANCEL SOS' : 'RED ALERT SOS'}
            </motion.button>

            <div style={{ padding: '0.5rem 1.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Wind size={14} /> LIVE AIR QUALITY: 24 AQI
            </div>
          </div>
        </div>

        {/* 2.5D SVG Map */}
        <div style={{ position: 'absolute', inset: 0, padding: '4rem' }}>
          <svg style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }} viewBox="0 0 800 600">
            {/* Background Mesh */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              </pattern>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Path visualization */}
            <AnimatePresence>
              {showPath && activePath && (
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  d={activePath}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  style={{ filter: 'drop-shadow(0 0 8px #6366f1)' }}
                />
              )}
            </AnimatePresence>

            {/* Block Markers */}
            {blocks.map((block) => (
              (mapCategory === 'all' || block.type === mapCategory) && (
                <g 
                  key={block.id} 
                  onClick={() => setSelectedBlock(block)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse Effect for high occupancy */}
                  {block.occupancy > 80 && (
                    <circle cx={block.x} cy={block.y} r="40" fill="rgba(239, 68, 68, 0.1)">
                      <animate attributeName="r" from="20" to="60" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Building Visual */}
                  <motion.rect 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    x={block.x - 40} y={block.y - 30}
                    width="80" height="60"
                    rx="12"
                    fill={selectedBlock?.id === block.id ? 'var(--primary)' : 'rgba(30, 41, 59, 0.9)'}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    style={{ transition: 'fill 0.3s' }}
                  />
                  <text x={block.x} y={block.y + 5} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" style={{ pointerEvents: 'none' }}>{block.id}</text>
                  <text x={block.x} y={block.y + 45} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" style={{ pointerEvents: 'none' }}>{block.name}</text>
                </g>
              )
            ))}
          </svg>
        </div>

        {/* Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} /> High Crowding
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} /> Selected Zone
          </div>
        </div>

        {/* Map Controls */}
        <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Layers size={18}/></button>
          <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Compass size={18}/></button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* NAVIGATION CARD */}
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={18} color="var(--primary)" /> Intelligent Routing
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={navFrom} 
                onChange={(e) => setNavFrom(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', appearance: 'none' }}
              >
                <option value="">Start Point...</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <MapPin size={14} style={{ position: 'absolute', right: '1rem', top: '0.9rem', opacity: 0.4 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}><ArrowRight size={16} color="rgba(255,255,255,0.2)" /></div>

            <div style={{ position: 'relative' }}>
              <select 
                value={navTo} 
                onChange={(e) => setNavTo(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', appearance: 'none' }}
              >
                <option value="">Destination...</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <Navigation size={14} style={{ position: 'absolute', right: '1rem', top: '0.9rem', opacity: 0.4 }} />
            </div>

            <button 
              onClick={handleNavigate}
              disabled={isPathfinding}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              {isPathfinding ? 'CALCULATING...' : 'GET DIRECTIONS'}
            </button>
          </div>
        </div>

        {/* BLOCK INTELLIGENCE CARD */}
        <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#f59e0b" /> Spatial Intelligence
          </h4>
          
          <AnimatePresence mode="wait">
            {selectedBlock ? (
              <motion.div 
                key={selectedBlock.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
              >
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white', marginBottom: '0.25rem' }}>{selectedBlock.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Zone {selectedBlock.id} • {selectedBlock.type}</div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>{selectedBlock.info}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Occupancy</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: selectedBlock.occupancy > 80 ? '#ef4444' : '#10b981' }}>{selectedBlock.occupancy}%</span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Capacity</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{selectedBlock.rooms} Rms</div>
                  </div>
                </div>

                {selectedBlock.occupancy > 80 && (
                  <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <span style={{ fontSize: '0.7rem', color: '#fca5a5', lineHeight: '1.4' }}>High traffic detected. We recommend visiting after 4 PM for reduced crowd.</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Explore Internal Floor Plan
                  </button>

                  {selectedBlock.id === 'F' && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <ShieldCheck size={16} /> Request Safe-Walk Escort
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-dim)' }}>
                <Compass size={48} style={{ marginBottom: '1.5rem', opacity: 0.1, animation: 'spin 10s linear infinite' }} />
                <p style={{ fontSize: '0.85rem', maxWidth: '200px' }}>Select a campus block to initialize spatial intelligence telemetry.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CampusNavigator;
