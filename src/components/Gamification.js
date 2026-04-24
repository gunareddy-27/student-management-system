import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Shield, Zap } from "lucide-react";

const Gamification = () => {
  const badges = [
    { title: "Perfect Attendance", desc: "100% attendance this month", icon: Shield, color: "#10b981", progress: 100 },
    { title: "Top Scorer", desc: "Highest grade in Physics", icon: Trophy, color: "#f59e0b", progress: 100 },
    { title: "Early Bird", desc: "Submit 5 assignments early", icon: Zap, color: "#3b82f6", progress: 80 },
    { title: "Course Master", desc: "Complete 3 courses", icon: Star, color: "#ec4899", progress: 66 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: 'white' }}>Level 12 Scholar</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.8)' }}>Current XP: 14,500 / 15,000</p>
        </div>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '4px solid currentColor', color: '#f59e0b' }}>
           🏆
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {badges.map((badge, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, scale: 1.02 }}
            style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: `1px solid ${badge.color}40`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
              <badge.icon size={100} color={badge.color} />
            </div>
            
            <badge.icon size={32} color={badge.color} style={{ marginBottom: '1rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{badge.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0 0 1rem 0' }}>{badge.desc}</p>
            
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${badge.progress}%` }} 
                style={{ height: '100%', background: badge.color, borderRadius: '3px' }} 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gamification;
