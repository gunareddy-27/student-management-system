import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SystemStats = () => {
  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(62);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 20);
      setMemory(Math.floor(Math.random() * 10) + 55);
      setUptime(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
      <h4 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8, color: 'var(--text-main)', background: 'none', WebkitTextFillColor: 'currentColor' }}>System Health Hub</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <span>Compute Load</span>
            <span style={{ color: cpu > 60 ? 'var(--error)' : 'var(--success)' }}>{cpu}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${cpu}%` }}
              style={{ height: '100%', background: 'var(--primary)' }}
            />
          </div>
        </div>

        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <span>RAM Allocation</span>
            <span>{memory}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${memory}%` }}
              style={{ height: '100%', background: 'var(--secondary)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Session Active</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatTime(uptime)}</span>
      </div>
    </div>
  );
};

export default SystemStats;
