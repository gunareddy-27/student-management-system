import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Eye, Zap, AlertTriangle, CheckCircle, 
  BarChart, Clock, Code, Globe, Terminal, Lock, 
  Camera, Cpu, Activity, Database, Server,
  Award, TrendingUp, Info, Play, Trash2
} from 'lucide-react';

const ExamIntelligence = ({ socket, studySessions = [] }) => {
  const [examState, setExamState] = useState('idle'); // idle, active, finished
  const [selectedSubject, setSelectedSubject] = useState('Fullstack Development');
  const [proctorStatus, setProctorStatus] = useState('Secure');
  const [violations, setViolations] = useState(0);
  const [activeTab, setActiveTab] = useState('code'); 
  const [logs, setLogs] = useState(['System Initialized', 'Neural Link Established']);
  const [testCases, setTestCases] = useState([
    { id: 1, name: 'Basic Logic', status: 'Pending' },
    { id: 2, name: 'Edge Cases', status: 'Pending' },
    { id: 3, name: 'Performance O(N)', status: 'Pending' }
  ]);

  const subjects = [
    { name: 'Fullstack Development', icon: <Code size={18}/>, difficulty: 'High' },
    { name: 'Cloud Architecture', icon: <Server size={18}/>, difficulty: 'Expert' },
    { name: 'Data Structures', icon: <Database size={18}/>, difficulty: 'Medium' },
    { name: 'Cyber Security', icon: <Lock size={18}/>, difficulty: 'Hard' }
  ];

  useEffect(() => {
    if (examState === 'active') {
      const handleMouseLeave = () => {
        setProctorStatus('CRITICAL: TAB SWITCH DETECTED');
        setViolations(v => v + 1);
        addLog('🚨 VIOLATION: Browser focus lost');
        setTimeout(() => setProctorStatus('Secure'), 3000);
      };

      const container = document.getElementById('exam-container');
      container?.addEventListener('mouseleave', handleMouseLeave);

      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          const statuses = ['Analyzing Eye Movement', 'Scanning Background', 'Voice Detection Active', 'Pattern Matching'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          setProctorStatus(`AI: ${randomStatus}...`);
          addLog(`AI: ${randomStatus}`);
          setTimeout(() => setProctorStatus('Secure'), 1500);
        }
      }, 5000);

      return () => {
        container?.removeEventListener('mouseleave', handleMouseLeave);
        clearInterval(interval);
      };
    }
  }, [examState]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const runTests = () => {
    addLog('🚀 Running automated test cases...');
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'Running' })));
    
    setTimeout(() => {
      setTestCases([
        { id: 1, name: 'Basic Logic', status: 'Passed' },
        { id: 2, name: 'Edge Cases', status: 'Passed' },
        { id: 3, name: 'Performance O(N)', status: 'Failed' }
      ]);
      addLog('⚠️ Testing Complete: 2/3 Passed');
    }, 2000);
  };

  return (
    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>
      {/* EXAM HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.5px' }}>
            <ShieldCheck color="#ef4444" size={32} /> Quantum <span style={{ color: '#ef4444' }}>ExamNode</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Next-gen cognitive assessment with real-time AI proctoring.</p>
        </div>
        
        {examState === 'active' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ padding: '0.6rem 1.25rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '16px', border: '1px solid #ef4444', fontSize: '0.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Camera size={14} /> LIVE PROCTORING
            </motion.div>
            <div style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Eye size={16} color={proctorStatus === 'Secure' ? '#10b981' : '#f59e0b'} /> {proctorStatus}
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem 1rem', borderRadius: '14px', color: '#ef4444', fontWeight: '900', fontSize: '0.8rem' }}>VIOLATIONS: {violations}</div>
          </div>
        )}
      </div>

      <div id="exam-container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* MAIN WORKSPACE */}
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.06)', minHeight: '650px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          
          {/* IDLE STATE: SUBJECT SELECTION */}
          {examState === 'idle' && (
            <div style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                style={{ width: '120px', height: '120px', border: '1px dashed rgba(239,68,68,0.5)', borderRadius: '50%', position: 'absolute', top: '10%', left: '10%' }} 
              />
              
              <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                <div style={{ width: '110px', height: '110px', background: 'rgba(239,68,68,0.1)', borderRadius: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.2)' }}>
                  <ShieldCheck size={56} />
                </div>
              </div>

              <h3 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Initialize Session</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', marginBottom: '3rem', lineHeight: '1.7', fontSize: '1rem' }}>
                Select your specialized track to begin the assessment. Your behavioral patterns and code efficiency will be benchmarked against elite developers.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
                {subjects.map(s => (
                  <div 
                    key={s.name}
                    onClick={() => setSelectedSubject(s.name)}
                    style={{ 
                      padding: '1.25rem', borderRadius: '20px', background: selectedSubject === s.name ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)', 
                      border: selectedSubject === s.name ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.05)', 
                      cursor: 'pointer', transition: 'all 0.3s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem'
                    }}
                  >
                    <div style={{ color: selectedSubject === s.name ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{s.name}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>Difficulty: {s.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setExamState('active')}
                style={{ padding: '1.2rem 4rem', borderRadius: '24px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 15px 35px rgba(239,68,68,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}
              >
                Launch {selectedSubject} Exam
              </button>

              {/* REAL-TIME STUDY JAM HUB */}
              <div style={{ marginTop: '4rem', width: '100%', maxWidth: '800px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="status-dot pulsing"></div> Live Study Jam Hub
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{studySessions.length} active sessions</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '24px', border: '2px dashed rgba(99, 102, 241, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      const studentName = prompt("Enter your study alias:");
                      if (studentName) {
                        socket.emit('JOIN_STUDY_JAM', { studentName, subject: selectedSubject });
                      }
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <Play size={20} fill="white" />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Start Study Jam</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Invite others to join you</span>
                  </motion.div>

                  {studySessions.map((session, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                           <div style={{ width: '32px', height: '32px', borderRadius: '80%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{session.studentName[0]}</div>
                           <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{session.studentName}</div>
                         </div>
                         <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Studying: <span style={{ color: 'white' }}>{session.subject}</span></div>
                      <button style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: '0.75rem', cursor: 'pointer' }}>Join Session</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE STATE: THE EXAM ENVIRONMENT */}
          {examState === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setActiveTab('code')} style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: activeTab === 'code' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'code' ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Code size={16} /> workspace.py
                  </button>
                  <button onClick={() => setActiveTab('terminal')} style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: activeTab === 'terminal' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'terminal' ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Terminal size={16} /> console_log
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ padding: '0.5rem 1rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900' }}>
                     <Clock size={14} style={{ marginRight: '0.5rem', display: 'inline' }} /> 58:12
                   </div>
                </div>
              </div>

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', minHeight: 0 }}>
                {/* Editor/Terminal Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1rem', fontWeight: '800' }}>Task: Advanced Memory Allocation</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                        Design a custom memory allocator for a real-time OS that handles fragmentation with O(1) complexity. Implement a garbage collection threshold.
                      </p>
                   </div>

                   <div style={{ flex: 1, background: '#0a0f1e', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      {activeTab === 'code' ? (
                        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
                           <div style={{ color: 'rgba(255,255,255,0.15)', textAlign: 'right', fontSize: '0.9rem', userSelect: 'none', lineHeight: '1.8', fontFamily: 'monospace' }}>
                             {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                           </div>
                           <textarea 
                             defaultValue={`import quantum_mem\n\nclass MemoryAllocator:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.nodes = {}\n\n    def allocate(self, size):\n        # Neural logic for allocation\n        pass\n\n    def deallocate(self, ptr):\n        # Defragmentation logic\n        pass`}
                             style={{ flex: 1, background: 'transparent', border: 'none', color: '#34d399', resize: 'none', fontSize: '0.95rem', outline: 'none', fontFamily: 'Fira Code, monospace', lineHeight: '1.8' }}
                           />
                        </div>
                      ) : (
                        <div style={{ flex: 1, padding: '1.5rem', background: '#000', fontFamily: 'monospace', fontSize: '0.85rem', color: '#10b981' }}>
                           <div style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>System Terminal v4.0.1 (Ready)</div>
                           <div>$ run tests --track={selectedSubject}</div>
                           <div style={{ color: 'white', margin: '0.5rem 0' }}>Compiling source...</div>
                           <div style={{ color: '#f59e0b' }}>Warning: Unused import 'quantum_mem'</div>
                           <div style={{ color: '#ef4444' }}>Traceback: Memory overflow at line 12.</div>
                           <div style={{ color: 'white' }}>$ _</div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Right Panel: Test Cases & Live Monitoring */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Validation Cases</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         {testCases.map(tc => (
                           <div key={tc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                             <span style={{ fontSize: '0.75rem', color: 'white' }}>{tc.name}</span>
                             <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: tc.status === 'Passed' ? '#10b981' : (tc.status === 'Failed' ? '#ef4444' : '#f59e0b') }}>{tc.status}</span>
                           </div>
                         ))}
                      </div>
                      <button 
                        onClick={runTests}
                        style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Play size={14} /> Run Neural Tests
                      </button>
                   </div>

                   <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
                      <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Proctor Logs</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                         {logs.map((log, i) => <div key={i} style={{ padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>{log}</div>)}
                      </div>
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setExamState('finished')}
                  style={{ padding: '1rem 3rem', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', fontSize: '1rem' }}
                >
                  FINALIZE & SUBMIT
                </button>
              </div>
            </div>
          )}

          {/* FINISHED STATE: INTELLIGENT ANALYTICS */}
          {examState === 'finished' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>Assessment Complete</h2>
                   <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Generated neural performance report for {selectedSubject}.</p>
                 </div>
                 <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 'bold' }}>GRADE</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white' }}>A+</div>
                 </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                  {[
                    { label: 'Logic Accuracy', value: '96%', icon: <Zap color="#f59e0b" size={16}/> },
                    { label: 'Complexity Index', value: 'O(1)', icon: <Activity color="#3b82f6" size={16}/> },
                    { label: 'Proctor Confidence', value: 'High', icon: <ShieldCheck color="#10b981" size={16}/> },
                    { label: 'Global Percentile', value: 'Top 3%', icon: <Award color="#8b5cf6" size={16}/> }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>{stat.icon} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{stat.label}</span></div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>{stat.value}</div>
                    </motion.div>
                  ))}
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
                  <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '32px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                     <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#6366f1', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                       <TrendingUp size={20} /> Career Trajectory
                     </h4>
                     <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                       Based on your architectural choices and de-fragmentation logic, your skills align perfectly with high-performance systems engineering.
                     </p>
                     <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Recommended Role:</span>
                        <span style={{ color: '#8b5cf6', fontWeight: '900' }}>Systems Architect</span>
                     </div>
                  </div>

                  {/* Neural Performance Radar (Mocked with SVG) */}
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <h4 style={{ alignSelf: 'flex-start', margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'white', fontWeight: '800' }}>Performance Radar</h4>
                     <svg width="200" height="200" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <path d="M 100 20 L 180 100 L 100 180 L 20 100 Z" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
                        <circle cx="100" cy="20" r="4" fill="#6366f1" /><text x="100" y="15" textAnchor="middle" fill="white" fontSize="8">Logic</text>
                        <circle cx="180" cy="100" r="4" fill="#6366f1" /><text x="185" y="105" textAnchor="start" fill="white" fontSize="8">Speed</text>
                        <circle cx="100" cy="180" r="4" fill="#6366f1" /><text x="100" y="195" textAnchor="middle" fill="white" fontSize="8">Safety</text>
                        <circle cx="20" cy="100" r="4" fill="#6366f1" /><text x="15" y="105" textAnchor="end" fill="white" fontSize="8">Focus</text>
                     </svg>
                  </div>
               </div>

               <button 
                 onClick={() => setExamState('idle')}
                 style={{ alignSelf: 'center', padding: '1rem 3.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
               >
                 Close Report & Exit
               </button>
            </motion.div>
          )}
        </div>

        {/* SIDEBAR: SYSTEM INTELLIGENCE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Facial Monitoring Mockup */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
             <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', fontWeight: '800', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
               <Camera size={18} color="#ef4444" /> Live Bio-Sync
             </h4>
             <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '2px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', opacity: 0.5 }}>👤</div>
                {/* Face Scanning Overlay */}
                <motion.div 
                  animate={{ top: ['0%', '95%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: '#ef4444', boxShadow: '0 0 15px #ef4444', zIndex: 5 }} 
                />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 'bold' }}>
                   <div style={{ color: '#10b981' }}>● FACE TRACKED</div>
                   <div style={{ color: '#ef4444' }}>88 BPM</div>
                </div>
             </div>
          </div>

          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={18} color="#8b5cf6" /> Cognitive Load
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  style={{ 
                    aspectRatio: '1', borderRadius: '8px', 
                    background: `rgba(139, 92, 246, ${Math.random() * 0.7 + 0.1})`,
                    border: '1px solid rgba(255,255,255,0.03)'
                  }} 
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(139, 92, 246, 0.2)' }} /> CALM</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(139, 92, 246, 0.8)' }} /> PEAK</div>
            </div>
          </div>

          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={18} color="#f59e0b" /> Certifications
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f59e0b' }}><Zap size={20}/></div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Elite Developer</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>98.2 Percentile</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamIntelligence;
