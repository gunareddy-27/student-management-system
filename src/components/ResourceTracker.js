import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Monitor, Coffee } from 'lucide-react';

const resourcesData = [
  { id: 'lib', name: 'Main Library', icon: <BookOpen size={20} />, capacity: 500, current: 420 },
  { id: 'lab1', name: 'CS Lab 1', icon: <Monitor size={20} />, capacity: 60, current: 58 },
  { id: 'lab2', name: 'CS Lab 2', icon: <Monitor size={20} />, capacity: 60, current: 12 },
  { id: 'cafe', name: 'Student Cafe', icon: <Coffee size={20} />, capacity: 150, current: 140 },
];

const ResourceTracker = () => {
  const [resources, setResources] = useState(resourcesData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => prev.map(res => {
        // Randomly change current capacity by -5 to +5
        const change = Math.floor(Math.random() * 11) - 5;
        let newCurrent = res.current + change;
        if (newCurrent < 0) newCurrent = 0;
        if (newCurrent > res.capacity) newCurrent = res.capacity;
        return { ...res, current: newCurrent };
      }));
    }, 3000); // update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {resources.map(res => {
        const percentage = (res.current / res.capacity) * 100;
        let color = '#10b981'; // green
        if (percentage > 70) color = '#f59e0b'; // yellow
        if (percentage > 90) color = '#ef4444'; // red

        return (
          <div key={res.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: color }}>{res.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{res.name}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {res.current} / {res.capacity}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                animate={{ width: `${percentage}%`, backgroundColor: color }}
                transition={{ type: 'spring', bounce: 0, duration: 1 }}
                style={{ height: '100%', borderRadius: '4px' }}
              />
            </div>
            {percentage > 90 && (
              <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'right' }}>
                Near full capacity!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResourceTracker;
