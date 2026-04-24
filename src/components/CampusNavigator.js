import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Navigation, Search, Info } from 'lucide-react';

const CampusNavigator = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);

  const blocks = [
    { id: 'A', name: 'Admin Block', top: '10%', left: '20%', info: 'Management & Admissions Office' },
    { id: 'B', name: 'Engineering Wing', top: '40%', left: '15%', info: 'Labs 101-305, CSE Dept' },
    { id: 'C', name: 'Library & Arts', top: '25%', left: '50%', info: 'Central Library, Seminar Halls' },
    { id: 'D', name: 'Sports Arena', top: '70%', left: '40%', info: 'Gym, Indoor Court, Pool' },
    { id: 'E', name: 'Mess & Canteen', top: '65%', left: '75%', info: 'Smart Cafeteria, Dining Hall' },
    { id: 'F', name: 'Hostel Blocks', top: '15%', left: '80%', info: 'Residential Quarters' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', height: '600px' }}>
      <div style={{ position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {/* Simplified 2.5D Map Visualization using CSS Grid/Shapes */}
        <div style={{ position: 'absolute', inset: 0, padding: '2rem' }}>
          {/* Decorative paths */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 800 600">
            <path d="M100 100 L400 150 L600 100 L700 400 L400 500 L100 400 Z" stroke="white" strokeWidth="2" fill="none" />
            <path d="M400 150 L400 500" stroke="white" strokeWidth="1" strokeDasharray="5,5" />
          </svg>

          {blocks.map((block) => (
            <motion.div
              key={block.id}
              onClick={() => setSelectedBlock(block)}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              style={{
                position: 'absolute',
                top: block.top,
                left: block.left,
                width: '120px',
                height: '80px',
                background: selectedBlock?.id === block.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(20deg) rotateY(-10deg)',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{block.id}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{block.name}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '10px', backdropFilter: 'blur(10px)', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation size={14} color="#10b981" /> 2.5D Campus Navigator Active
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
             <div style={{ position: 'relative', flex: 1 }}>
                <input type="text" placeholder="Search rooms, labs..." style={{ width: '100%', padding: '0.6rem 2.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }} />
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '0.8rem', opacity: 0.5 }} />
             </div>
          </div>

          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Block Intelligence</h4>
          {selectedBlock ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={selectedBlock.id}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedBlock.name}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>{selectedBlock.info}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'white' }}>42</div>
                  <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Rooms</div>
                </div>
                <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: '#10b981' }}>Active</div>
                  <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
               <Info size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
               <p style={{ fontSize: '0.8rem' }}>Select a block on the map to see real-time intelligence and floor plans.</p>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Quick Shortcuts</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {['Nearest Washroom', 'Principal\'s Office', 'Main Exit', 'Emergency Exit'].map(s => (
               <button key={s} style={{ textAlign: 'left', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', hover: { color: 'white' } }}>• {s}</button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampusNavigator;
