import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon, Navigation, Search, Info, 
  MapPin, Clock, Users, Zap, Layers, Compass, 
  ArrowRight, Wind, AlertTriangle, Siren, ShieldCheck,
  Eye, Droplets, Thermometer, Wifi, Activity, Maximize2,
  Calendar, Coffee, Landmark, HelpCircle, Footprints
} from 'lucide-react';

const CampusNavigator = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [navFrom, setNavFrom] = useState('');
  const [navTo, setNavTo] = useState('');
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [mapCategory, setMapCategory] = useState('all'); 
  const [mapMode, setMapMode] = useState('standard'); // standard, heatmap, traffic
  const [activeLayers, setActiveLayers] = useState(['buildings']); // buildings, poi, events
  const [isAlerting, setIsAlerting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const blocks = [
    { id: 'A', name: 'Admin Block', type: 'academics', x: 120, y: 100, info: 'Management, Admissions, Registrar Office', rooms: 24, occupancy: 45, status: 'Normal', events: ['Admin Meeting - 2PM'] },
    { id: 'B', name: 'Engineering Wing', type: 'academics', x: 100, y: 350, info: 'CSE Dept, Advanced AI Lab, Robotics Lab', rooms: 86, occupancy: 92, status: 'Critical', events: ['AI Hackathon - Live'] },
    { id: 'C', name: 'Central Library', type: 'academics', x: 420, y: 180, info: 'Digital Archives, Reading Halls, Study Pods', rooms: 12, occupancy: 78, status: 'Busy', events: ['Book Fair - 10AM'] },
    { id: 'D', name: 'Sports Arena', type: 'sports', x: 350, y: 480, info: 'Olympic Pool, Indoor Courts, Fitness Center', rooms: 15, occupancy: 30, status: 'Normal', events: ['Basketball Finals - 5PM'] },
    { id: 'E', name: 'Global Food Court', type: 'social', x: 650, y: 420, info: 'Multicuisine Cafeteria, Student Lounge', rooms: 8, occupancy: 85, status: 'High Traffic', events: ['Live Music - 7PM'] },
    { id: 'F', name: 'Elite Hostels', type: 'social', x: 700, y: 120, info: 'Residential Quarters, Guest House', rooms: 240, occupancy: 60, status: 'Normal', events: ['Hostel Night - Sat'] },
    { id: 'G', name: 'Innovation Hub', type: 'academics', x: 300, y: 50, info: 'Startup Incubator, Hackathon Zone', rooms: 18, occupancy: 55, status: 'Normal', events: ['Pitch Deck Workshop'] },
  ];

  const pois = [
    { name: 'Main ATM', x: 150, y: 200, type: 'finance', icon: <Landmark size={12}/> },
    { name: 'Coffee Express', x: 450, y: 300, type: 'food', icon: <Coffee size={12}/> },
    { name: 'Health Center', x: 550, y: 100, type: 'medical', icon: <Activity size={12}/> },
    { name: 'Help Desk', x: 400, y: 400, type: 'info', icon: <HelpCircle size={12}/> },
  ];

  const handleNavigate = () => {
    if (!navFrom || !navTo) return;
    setIsPathfinding(true);
    setShowPath(false);
    setTimeout(() => {
      setIsPathfinding(false);
      setShowPath(true);
    }, 1200);
  };

  const toggleLayer = (layer) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const activePath = useMemo(() => {
    if (!showPath) return null;
    const start = blocks.find(b => b.id === navFrom);
    const end = blocks.find(b => b.id === navTo);
    if (!start || !end) return null;
    return `M ${start.x} ${start.y} C ${(start.x + end.x) / 2 + 100} ${start.y - 100}, ${(start.x + end.x) / 2 - 100} ${end.y + 100}, ${end.x} ${end.y}`;
  }, [showPath, navFrom, navTo]);

  const filteredBlocks = blocks.filter(b => 
    (mapCategory === 'all' || b.type === mapCategory) &&
    (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', height: '750px', color: 'white' }}>
      
      {/* MAIN MAP AREA */}
      <div style={{ 
        position: 'relative', 
        background: '#020617',
        borderRadius: '32px', 
        border: isAlerting ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.08)', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s'
      }}>
        
        {/* Radar Effect background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '50%' }} />
        </div>

        {/* Top Floating UI */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '0.5rem', borderRadius: '16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.4rem' }}>
              {['standard', 'heatmap', 'traffic'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setMapMode(mode)}
                  style={{ padding: '0.5rem 0.85rem', borderRadius: '10px', border: 'none', background: mapMode === mode ? 'var(--primary)' : 'transparent', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search Blocks, Labs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'white', fontSize: '0.8rem', width: '220px', backdropFilter: 'blur(12px)' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '0.75rem', opacity: 0.5 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={14} /> 28°C
            </div>
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={14} /> 5G LIVE
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAlerting(!isAlerting)}
              style={{ padding: '0.6rem 1.2rem', background: isAlerting ? '#ef4444' : 'rgba(239, 68, 68, 0.1)', color: isAlerting ? 'white' : '#ef4444', borderRadius: '16px', fontSize: '0.75rem', fontWeight: '900', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Siren size={16} /> {isAlerting ? 'CANCEL' : 'SOS'}
            </motion.button>
          </div>
        </div>

        {/* SVG Viewport */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' }}>
           <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 900 700">
             <defs>
               <filter id="glow">
                 <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
               <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                 <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
               </pattern>
             </defs>
             
             <rect width="100%" height="100%" fill="url(#dotPattern)" />

             {/* Dynamic Heatmap Layer */}
             {mapMode === 'heatmap' && blocks.map(b => (
               <motion.circle 
                 key={`heat-${b.id}`}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: b.occupancy / 100 * 0.4 }}
                 cx={b.x} cy={b.y} r={80 + b.occupancy}
                 fill={b.occupancy > 80 ? '#ef4444' : '#f59e0b'}
                 style={{ filter: 'blur(30px)' }}
               />
             ))}

             {/* Path Layer */}
             <AnimatePresence>
                {showPath && activePath && (
                  <g>
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      d={activePath}
                      fill="none"
                      stroke="rgba(99, 102, 241, 0.2)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      d={activePath}
                      fill="none"
                      stroke="url(#pathGradient)"
                      strokeWidth="3"
                      strokeDasharray="10 5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    >
                      <animate attributeName="stroke-dashoffset" from="150" to="0" dur="3s" repeatCount="indefinite" />
                    </motion.path>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </g>
                )}
             </AnimatePresence>

             {/* Buildings Layer */}
             {activeLayers.includes('buildings') && filteredBlocks.map(block => (
               <g key={block.id} onClick={() => setSelectedBlock(block)} style={{ cursor: 'pointer' }}>
                  {/* Building shadow */}
                  <rect x={block.x - 30} y={block.y - 10} width="60" height="40" rx="8" fill="rgba(0,0,0,0.5)" transform={`skewX(-15)`} />
                  
                  {/* Building main */}
                  <motion.rect 
                    whileHover={{ scale: 1.05, y: -5 }}
                    x={block.x - 35} y={block.y - 25}
                    width="70" height="50"
                    rx="12"
                    fill={selectedBlock?.id === block.id ? 'var(--primary)' : '#1e293b'}
                    stroke={block.status === 'Critical' ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                    strokeWidth="2"
                    style={{ transition: 'all 0.3s' }}
                  />
                  <text x={block.x} y={block.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="900">{block.id}</text>
                  
                  {/* Indicators */}
                  {block.occupancy > 80 && (
                    <circle cx={block.x + 35} cy={block.y - 25} r="6" fill="#ef4444">
                       <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
               </g>
             ))}

             {/* POI Layer */}
             {activeLayers.includes('poi') && pois.map((poi, idx) => (
               <g key={idx}>
                 <circle cx={poi.x} cy={poi.y} r="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
                 <foreignObject x={poi.x - 6} y={poi.y - 6} width="12" height="12">
                   <div style={{ color: 'rgba(255,255,255,0.6)' }}>{poi.icon}</div>
                 </foreignObject>
               </g>
             ))}
           </svg>
        </div>

        {/* Bottom Left: Layer Controls */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {['buildings', 'poi', 'events'].map(layer => (
            <button
              key={layer}
              onClick={() => toggleLayer(layer)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                background: activeLayers.includes(layer) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                color: activeLayers.includes(layer) ? 'var(--primary)' : 'white',
                fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize',
                backdropFilter: 'blur(10px)'
              }}
            >
              {layer} Layer
            </button>
          ))}
        </div>

        {/* Bottom Right: Scale & Stats */}
        <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', textAlign: 'right' }}>
           <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', letterSpacing: '1px' }}>VIRTUAL CAMPUS TWIN V2.4</div>
           <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Maximize2 size={16}/></button>
              <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Compass size={16}/></button>
           </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: INTELLIGENCE PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Navigation / Routing */}
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Navigation size={18} color="#6366f1" /> Neural Pathfinding
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
               <select 
                 value={navFrom} 
                 onChange={(e) => setNavFrom(e.target.value)}
                 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', outline: 'none' }}
               >
                 <option value="" style={{ background: '#020617' }}>Starting Location...</option>
                 {blocks.map(b => <option key={b.id} value={b.id} style={{ background: '#020617' }}>{b.name}</option>)}
               </select>
               <MapPin size={14} style={{ position: 'absolute', right: '1rem', top: '0.9rem', opacity: 0.3 }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}><Footprints size={16} opacity={0.2} /></div>

            <div style={{ position: 'relative' }}>
               <select 
                 value={navTo} 
                 onChange={(e) => setNavTo(e.target.value)}
                 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', outline: 'none' }}
               >
                 <option value="" style={{ background: '#020617' }}>Final Destination...</option>
                 {blocks.map(b => <option key={b.id} value={b.id} style={{ background: '#020617' }}>{b.name}</option>)}
               </select>
               <Compass size={14} style={{ position: 'absolute', right: '1rem', top: '0.9rem', opacity: 0.3 }} />
            </div>

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
