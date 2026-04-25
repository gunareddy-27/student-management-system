import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, Zap, AlertTriangle, CheckCircle, BarChart, Clock, Code, Globe, Terminal, Lock } from 'lucide-react';

const ExamIntelligence = () => {
  const [examState, setExamState] = useState('idle'); // idle, active, finished
  const [proctorStatus, setProctorStatus] = useState('Secure');
  const [violations, setViolations] = useState(0);
  const [activeTab, setActiveTab] = useState('code'); // code, terminal
  const [isTabLocked, setIsTabLocked] = useState(true);

  useEffect(() => {
    if (examState === 'active') {
      const handleMouseLeave = () => {
        setProctorStatus('CRITICAL: TAB SWITCH DETECTED');
        setViolations(v => v + 1);
        setTimeout(() => setProctorStatus('Secure'), 3000);
      };

      const container = document.getElementById('exam-container');
      container?.addEventListener('mouseleave', handleMouseLeave);

      const interval = setInterval(() => {
        if (Math.random() > 0.92) {
          setProctorStatus('AI: Detecting Eye Movement...');
          setTimeout(() => setProctorStatus('Secure'), 1500);
        }
      }, 5000);

      return () => {
        container?.removeEventListener('mouseleave', handleMouseLeave);
        clearInterval(interval);
      };
    }
  }, [examState]);

  return (
    <div style={{ color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck color="#ef4444" size={28} /> Matrix Exam Environment
          </h2>
          <p style={{ color: 'var(--text-dim)', margin: '0.5rem 0 0' }}>Enterprise-grade proctoring with neural behavioral analysis.</p>
        </div>
        {examState === 'active' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem 1rem', background: proctorStatus === 'Secure' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.2)', color: proctorStatus === 'Secure' ? '#10b981' : '#ef4444', borderRadius: '12px', border: '1px solid currentColor', fontSize: '0.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={14} /> BROWSER LOCKED
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={16} className={proctorStatus !== 'Secure' ? 'animate-pulse' : ''} /> {proctorStatus}
            </div>
            <div style={{ color: '#ef4444', fontWeight: '900', fontSize: '0.8rem' }}>VIOLATIONS: {violations}</div>
          </div>
        )}
      </div>

      <div id="exam-container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', position: 'relative' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', minHeight: '550px', position: 'relative', overflow: 'hidden' }}>
          {examState === 'idle' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(239,68,68,0.1)', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}>
                  <ShieldCheck size={50} />
                </div>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', inset: -10, border: '2px solid #ef4444', borderRadius: '35px' }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem' }}>Enter the Secure Sandbox</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '450px', marginBottom: '2.5rem', lineHeight: '1.6' }}>You are about to start a high-fidelity corporate simulation. System will lock focus, track eye-movement, and analyze code efficiency in real-time.</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {['Face ID Verified', 'Browser Calibrated', 'Neural Link Active'].map((t, i) => (
                  <div key={i} style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                    <CheckCircle size={12} /> {t}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setExamState('active')}
                style={{ padding: '1.2rem 3.5rem', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 15px 30px rgba(239,68,68,0.3)', letterSpacing: '1px' }}
              >
                INITIALIZE SIMULATION
              </button>
            </div>
          )}

          {examState === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setActiveTab('code')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'code' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'code' ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={14} /> solution.py
                  </button>
                  <button onClick={() => setActiveTab('terminal')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'terminal' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'terminal' ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Terminal size={14} /> Terminal
                  </button>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold' }}>TIME REMAINING: 44:52</div>
              </div>

              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '0.9rem' }}>Task: Optimal Pathfinding</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>Implement a function that finds the shortest path in a 3D weighted graph with dynamic obstacles. Time complexity must be O(E log V).</p>
                </div>
                
                {activeTab === 'code' ? (
                  <div style={{ flex: 1, padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'right', fontSize: '0.85rem', userSelect: 'none', lineHeight: '1.6' }}>
                      {Array.from({ length: 15 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <textarea 
                      defaultValue={`def find_optimal_path(graph, start, end):\n    # Initialize neural priority queue\n    pq = PriorityQueue()\n    pq.put((0, start))\n    \n    # Matrix tracking logic...`}
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#10b981', resize: 'none', fontSize: '0.9rem', outline: 'none', fontFamily: 'Fira Code, monospace', lineHeight: '1.6' }}
                    />
                  </div>
                ) : (
                  <div style={{ flex: 1, padding: '1.5rem', background: '#000', fontFamily: 'monospace', fontSize: '0.85rem', color: '#10b981' }}>
                    <div>$ python solution.py</div>
                    <div style={{ color: 'white', marginTop: '0.5rem' }}>Running neural tests...</div>
                    <div style={{ color: '#ef4444' }}>Error: Circular dependency at node 4.</div>
                    <div style={{ color: 'white' }}>$ _</div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                   <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Autosaved 2s ago</span>
                </div>
                <button 
                  onClick={() => setExamState('finished')}
                  style={{ padding: '0.8rem 2.5rem', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: '900', cursor: 'pointer', boxShadow: '0 5px 15px rgba(16,185,129,0.3)' }}
                >
                  SUBMIT SOLUTION
                </button>
              </div>
            </div>
          )}

          {examState === 'finished' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Performance Intelligence</h3>
                <div style={{ padding: '0.5rem 1.2rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '900', border: '1px solid #10b981' }}>
                  PASSED BENCHMARK
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Code Efficiency', value: '94%', sub: 'O(N log N)' },
                  { label: 'Focus Index', value: '98%', sub: 'Secure' },
                  { label: 'Anxiety Level', value: 'Low', sub: 'Calm' }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 'bold', marginTop: '0.25rem' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#34d399', fontWeight: '900' }}>NEURAL FEEDBACK</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                    Your coding speed peaked during the recursion logic implementation. Behavioral analytics indicate high confidence. <strong>Recommendation:</strong> You are ready for the <strong>Google Kickstart</strong> track.
                  </p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '24px', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#8b5cf6', fontWeight: '900' }}>CAREER PREDICTION</h4>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white' }}>Cloud Architect</div>
                  <div style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 'bold', marginTop: '0.5rem' }}>92% PROBABILITY</div>
                </div>
              </div>

              <button 
                onClick={() => setExamState('idle')}
                style={{ alignSelf: 'center', padding: '0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Return to Matrix
              </button>
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={18} color="#f59e0b" /> Behavioral Heatmap
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  style={{ 
                    aspectRatio: '1', borderRadius: '6px', 
                    background: `rgba(139, 92, 246, ${Math.random() * 0.8 + 0.1})`,
                    border: '1px solid rgba(255,255,255,0.03)'
                  }} 
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              <span>LOW STRESS</span>
              <span>PEAK COGNITIVE LOAD</span>
            </div>
          </div>

          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={18} color="var(--primary)" /> Intelligence History
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Google Hackerrank', score: '94%', status: 'Elite' },
                { name: 'AWS Cloud Simulation', score: '82%', status: 'Advanced' },
                { name: 'TCS Digital Mock', score: '98%', status: 'Master' }
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>{h.name}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{h.status}</div>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: 'white' }}>{h.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamIntelligence;

