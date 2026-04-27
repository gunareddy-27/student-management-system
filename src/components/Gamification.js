import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Shield, Zap, Target, Award, Crown, TrendingUp } from "lucide-react";

const Gamification = () => {
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(14500);
  const maxXp = 15000;

  const badges = [
    { title: "Perfect Attendance", desc: "100% attendance this month", icon: Shield, color: "#10b981", progress: 100, xp: 500 },
    { title: "Top Scorer", desc: "Highest grade in Physics", icon: Trophy, color: "#f59e0b", progress: 100, xp: 1000 },
    { title: "Early Bird", desc: "Submit 5 assignments early", icon: Zap, color: "#3b82f6", progress: 80, xp: 200 },
    { title: "Course Master", desc: "Complete 3 courses", icon: Star, color: "#ec4899", progress: 66, xp: 1500 },
  ];

  const leaderboard = [
    { rank: 1, name: "Anubhav R.", xp: 28400, level: 24, avatar: "👑" },
    { rank: 2, name: "Sarah K.", xp: 26100, level: 22, avatar: "🥈" },
    { rank: 3, name: "John D.", xp: 24500, level: 21, avatar: "🥉" },
    { rank: 4, name: "You", xp: 14500, level: 12, avatar: "👤" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* XP Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', 
          padding: '2.5rem', 
          borderRadius: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 70% 30%, white 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Crown size={24} color="#f59e0b" />
            <span style={{ color: 'white', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Elite Scholar Rank</span>
          </div>
          <h2 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: '900' }}>LEVEL {level}</h2>
          <div style={{ marginTop: '1.5rem', width: '300px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                <span>XP PROGRESS</span>
                <span>{xp.toLocaleString()} / {maxXp.toLocaleString()}</span>
             </div>
             <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp/maxXp)*100}%` }}
                  style={{ height: '100%', background: 'white', boxShadow: '0 0 15px white' }}
                />
             </div>
          </div>
        </div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '120px', height: '120px', borderRadius: '40px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
        >
           🏆
        </motion.div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Achievements Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <h4 style={{ color: 'white', margin: 0, fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Award size={20} color="#6366f1" /> UNLOCKED BADGES
           </h4>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {badges.map((badge, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, background: 'rgba(255,255,255,0.06)' }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: `1px solid ${badge.color}20`, position: 'relative', overflow: 'hidden' }}
              >
                <badge.icon size={28} color={badge.color} style={{ marginBottom: '1rem' }} />
                <h5 style={{ margin: '0 0 0.25rem 0', color: 'white', fontSize: '0.9rem' }}>{badge.title}</h5>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1rem 0', lineHeight: '1.4' }}>{badge.desc}</p>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: badge.color }}>+{badge.xp} XP</div>
              </motion.div>
            ))}
           </div>
        </div>

        {/* Global Leaderboard */}
        <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
           <h4 style={{ color: 'white', margin: '0 0 2rem 0', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Crown size={20} color="#f59e0b" /> GLOBAL LEADERBOARD
           </h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.map((user, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                    borderRadius: '20px', background: user.name === "You" ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: user.name === "You" ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                  }}
                >
                  <div style={{ width: '30px', fontWeight: '900', color: i < 3 ? '#f59e0b' : 'rgba(255,255,255,0.3)' }}>#{user.rank}</div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>Level {user.level}</div>
                  </div>
                  <div style={{ color: 'white', fontWeight: '900', fontSize: '0.9rem' }}>{user.xp.toLocaleString()} <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>XP</span></div>
                </motion.div>
              ))}
           </div>
           
           <motion.button 
             whileHover={{ scale: 1.05 }}
             style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
           >
             <TrendingUp size={16} /> VIEW ALL RANKINGS
           </motion.button>
        </div>

      </div>
    </div>
  );
};

export default Gamification;
