import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Award, Zap, Rocket, CheckCircle2, MessageSquare, BrainCircuit, BarChart3, Users, Briefcase, Star, Sparkles } from 'lucide-react';
import axios from 'axios';

const CareerArchitect = ({ studentId = 1 }) => {
  const [activeSubTab, setActiveSubTab] = useState('interviews');
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewRole, setInterviewRole] = useState('Full Stack Developer');
  const [feedback, setFeedback] = useState(null);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [skillMatrix, setSkillMatrix] = useState({
    'Frontend': 85,
    'Backend': 70,
    'DevOps': 40,
    'Soft Skills': 90,
    'Architecture': 60
  });

  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    fetchInterviews();
  }, [studentId]);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/ai/mock-interview/${studentId}`);
      setPastInterviews(res.data);
    } catch (e) { console.error(e); }
  };

  const startInterview = async () => {
    setIsInterviewing(true);
    setFeedback(null);
    try {
      const res = await axios.post(`${baseUrl}/ai/mock-interview`, {
        student_id: studentId,
        role: interviewRole
      });
      setFeedback(res.data);
      fetchInterviews();
      
      // Award CampusCoins for completing an interview
      await axios.post(`${baseUrl}/campus-coins/earn`, {
        student_id: studentId,
        amount: 50,
        reason: 'Completing AI Mock Interview'
      });
      
    } catch (e) { console.error(e); }
    finally { setIsInterviewing(false); }
  };

  const SkillBar = ({ label, value, color }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>{label}</span>
        <span style={{ fontSize: '0.9rem', color: color, fontWeight: 'bold' }}>{value}%</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ height: '100%', background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </div>
  );

  return (
    <div className="career-architect" style={{ color: 'white', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Career Architect
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Precision placement preparation & skill mastery analysis.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveSubTab('interviews')}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: activeSubTab === 'interviews' ? '#3b82f6' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <MessageSquare size={18} /> Mock Interviews
          </button>
          <button 
            onClick={() => setActiveSubTab('skills')}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: activeSubTab === 'skills' ? '#8b5cf6' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <BrainCircuit size={18} /> Skill Matrix
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'interviews' ? (
          <motion.div 
            key="interviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                   <Sparkles size={40} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Ready for your next challenge?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                  Our AI simulates top-tier technical and HR rounds. Get instant feedback on your performance, concepts, and communication.
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                   <input 
                     type="text" 
                     value={interviewRole}
                     onChange={(e) => setInterviewRole(e.target.value)}
                     placeholder="Enter Target Role"
                     style={{ padding: '1rem 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '250px' }}
                   />
                   <button 
                     onClick={startInterview}
                     disabled={isInterviewing}
                     style={{ padding: '1rem 2rem', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                   >
                     {isInterviewing ? 'Generating AI Round...' : <><Rocket size={18} /> Start AI Interview</>}
                   </button>
                </div>
              </div>

              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))', borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Award color="#f59e0b" /> Interview Result
                    </h3>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', color: '#10b981', fontWeight: '900', fontSize: '1.2rem' }}>
                      {feedback.score}%
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '1.5rem' }}>{feedback.feedback}</p>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <Target size={18} /> AI Suggestion: {feedback.recommendation}
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <Zap size={16} fill="#f59e0b" /> +50 CampusCoins awarded for preparation!
                  </div>
                </motion.div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Interview History</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pastInterviews.map((int, i) => (
                    <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                         <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{int.role}</span>
                         <span style={{ color: int.score > 80 ? '#10b981' : '#f59e0b', fontWeight: '900', fontSize: '0.8rem' }}>{int.score}%</span>
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(int.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {pastInterviews.length === 0 && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>No interviews recorded yet.</p>}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}
          >
             <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BarChart3 color="#8b5cf6" /> Professional Skill Matrix
                </h3>
                <SkillBar label="Frontend (React/Next.js)" value={skillMatrix.Frontend} color="#3b82f6" />
                <SkillBar label="Backend (Node/Spring)" value={skillMatrix.Backend} color="#8b5cf6" />
                <SkillBar label="System Architecture" value={skillMatrix.Architecture} color="#10b981" />
                <SkillBar label="DevOps & Cloud" value={skillMatrix.DevOps} color="#ef4444" />
                <SkillBar label="Soft Skills & Comm" value={skillMatrix['Soft Skills']} color="#f59e0b" />
                
                <button style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa', fontWeight: 'bold', cursor: 'pointer' }}>
                  Re-evaluate Skill Levels with AI Test
                </button>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ padding: '2.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '32px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                   <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target color="#8b5cf6" /> Targeted Improvements</h4>
                   <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                     Your <strong>DevOps</strong> and <strong>Architecture</strong> scores are below the industry baseline for Senior roles.
                   </p>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <CheckCircle2 size={16} color="#10b981" /> Complete "Kubernetes Mastery"
                      </div>
                      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <CheckCircle2 size={16} color="#10b981" /> Build a Microservices Project
                      </div>
                   </div>
                </div>

                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase color="#f59e0b" /> Job Readiness</h4>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981' }}>78%</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Matches requirements for 12 active campus drives.</div>
                   </div>
                   <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', background: '#10b981' }} />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerArchitect;
