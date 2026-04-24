import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AIIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await axios.get(`${baseUrl}/ai/insights`);
        setData(res.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchAI();
  }, []);

  if (loading) return <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>🧠 AI Engine Initializing...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {/* Risk Analysis Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05 }}>⚠️</div>
        <h4 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🛡️</span> Predictive Risk Analysis
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{data.insights.risk.level}</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{data.insights.risk.message}</p>
      </motion.div>

      {/* Financial Intelligence Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05 }}>💰</div>
        <h4 style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📈</span> Financial Intelligence
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{data.insights.finance.rate.toFixed(1)}%</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{data.insights.finance.message}</p>
      </motion.div>

      {/* Library Demand AI Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05 }}>📖</div>
        <h4 style={{ color: '#3b82f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🤖</span> Library Demand AI
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{data.insights.library.utilization.toFixed(1)}%</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{data.insights.library.message}</p>
      </motion.div>

      {/* Campus Sentiment Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(217, 70, 239, 0.05)', border: '1px solid rgba(217, 70, 239, 0.1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05 }}>❤️</div>
        <h4 style={{ color: '#d946ef', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🧠</span> Campus Sentiment AI
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{data.insights.sentiment.score}%</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{data.insights.sentiment.message}</p>
      </motion.div>

      {/* Schedule Optimization Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.05 }}>📅</div>
        <h4 style={{ color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚙️</span> Schedule Optimizer
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{data.insights.schedule.utilization}%</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{data.insights.schedule.message}</p>
      </motion.div>

      {/* AI Activity Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ gridColumn: 'span 1', padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>📡 Real-time AI Activity</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { tag: 'OCR', msg: 'Document Scan: 42 IDs verified', time: 'Just now' },
            { tag: 'NLP', msg: 'Chatbot query: At-risk student look-up', time: '2m ago' },
            { tag: 'PREDICT', msg: 'Library demand spiked for "OS"', time: '15m ago' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>[{item.tag}]</span>
              <span style={{ color: 'var(--text-muted)', flex: 1, marginLeft: '0.75rem' }}>{item.msg}</span>
              <span style={{ color: 'var(--text-dim)' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ gridColumn: 'span 2', padding: '2rem', borderRadius: '24px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
        <h4 style={{ color: '#8b5cf6', marginBottom: '1.5rem' }}>💡 AI-Generated Recommendations</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {data.recommendations.map((rec, i) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
              • {rec}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AIIntelligence;
