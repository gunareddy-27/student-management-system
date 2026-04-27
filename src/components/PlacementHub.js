import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Briefcase, Award, BookOpen, Search, Send, Plus, Filter, ArrowRight, MessageSquare, Star, Zap } from 'lucide-react';

const PlacementHub = () => {
  const [activeTab, setActiveTab] = useState('drives');
  const [selectedRoadmap, setSelectedRoadmap] = useState('sde');
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', role: '', experience_text: '', rating: 5 });

  const baseUrl = 'http://localhost:8080';
  const studentId = localStorage.getItem('userId') || 1;
  const isAdmin = localStorage.getItem('role') === 'admin';

  const roadmaps = {
    sde: {
      title: 'Full Stack Software Engineer',
      path: [
        { level: 'Frontend', skills: ['HTML5', 'CSS3/Sass', 'React Native', 'TypeScript'], resource: 'https://roadmap.sh/frontend' },
        { level: 'Backend', skills: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL'], resource: 'https://roadmap.sh/backend' },
        { level: 'System Design', skills: ['Microservices', 'Load Balancing', 'Caching', 'CAP Theorem'], resource: 'https://systemdesign.one/' },
      ],
      prep: ['Cracking the Coding Interview', 'LeetCode Top 100', 'NeetCode Roadmap']
    },
    ai: {
      title: 'AI & Data Science Specialist',
      path: [
        { level: 'Foundations', skills: ['Python', 'Linear Algebra', 'Statistics', 'Pandas'], resource: 'https://roadmap.sh/ai-data-scientist' },
        { level: 'Machine Learning', skills: ['Scikit-Learn', 'Feature Engineering', 'XGBoost', 'NLP'], resource: 'https://www.coursera.org/specializations/machine-learning-introduction' },
        { level: 'Deep Learning', skills: ['PyTorch', 'Transformers', 'Computer Vision', 'LLMs'], resource: 'https://deeplearning.ai' },
      ],
      prep: ['Hands-on ML with Scikit-Learn & TF', 'Kaggle Competitions', 'Fast.ai Courses']
    },
    cloud: {
      title: 'Cloud Architect & DevOps',
      path: [
        { level: 'Infrastructure', skills: ['Linux Ops', 'Docker', 'Kubernetes', 'Terraform'], resource: 'https://roadmap.sh/devops' },
        { level: 'Cloud Providers', skills: ['AWS Solutions Architect', 'Azure Fundamentals', 'GCP', 'IAM'], resource: 'https://aws.amazon.com/training/' },
        { level: 'Security', skills: ['OAuth2', 'Penetration Testing', 'Cloud Audit', 'SIEM'], resource: 'https://roadmap.sh/cyber-security' },
      ],
      prep: ['AWS Cert Prep Guides', 'Kubernetes Handbook', 'TryHackMe Labs']
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [drivesRes, appsRes, expRes, statsRes] = await Promise.all([
        axios.get(`${baseUrl}/placements/drives`),
        axios.get(`${baseUrl}/placements/applications/${studentId}`),
        axios.get(`${baseUrl}/placements/experiences`),
        axios.get(`${baseUrl}/placements/stats`)
      ]);
      setDrives(drivesRes.data);
      setApplications(appsRes.data);
      setExperiences(expRes.data);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApply = async (driveId) => {
    try {
      await axios.post(`${baseUrl}/placements/apply`, { drive_id: driveId, student_id: studentId });
      alert('Application successful! Track your status in the "My Tracker" tab.');
      fetchData();
    } catch (e) { alert('Already applied or error occurred.'); }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/placements/experiences`, { ...newExp, student_id: studentId });
      setShowExpModal(false);
      setNewExp({ company: '', role: '', experience_text: '', rating: 5 });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading && !stats) return <div className="loading-spinner">Calibrating Placement Intelligence...</div>;

  return (
    <div className="placement-hub-container" style={{ color: 'white' }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.1)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '32px',
          padding: '3rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Career Intelligence 2026
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.2)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: '#10b981' }}>
              <Zap size={14} /> LIVE RECRUITMENT
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, letterSpacing: '-2px', lineHeight: 0.9 }}>Career Command Center</h1>
          <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginTop: '1.5rem', lineHeight: 1.6 }}>
            Navigate the global job market with real-time drive tracking, AI-powered skill analysis, and direct mentorship from our elite alumni network.
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Active Drives', value: stats?.totalDrives || 0, icon: <Briefcase />, color: '#8b5cf6' },
          { label: 'Applications', value: stats?.totalApplications || 0, icon: <Send />, color: '#3b82f6' },
          { label: 'Placed Students', value: stats?.selectedStudents || 0, icon: <Award />, color: '#10b981' },
          { label: 'Avg. CTC', value: stats?.averagePackage || 'N/A', icon: <TrendingUp />, color: '#f59e0b' }
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              backdropFilter: 'blur(10px)',
              padding: '1.5rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem'
            }}>
            <div style={{ padding: '1rem', borderRadius: '18px', background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '900' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 'bold', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '16px', width: 'fit-content' }}>
        {['drives', 'tracker', 'experiences', 'roadmaps'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-dim)',
              padding: '0.7rem 1.8rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              textTransform: 'capitalize',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
            {tab === 'tracker' ? 'My Tracker' : tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'drives' && (
          <motion.div key="drives" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {drives.map((drive, i) => (
                <motion.div key={drive.id} whileHover={{ y: -8 }}
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '28px', 
                    padding: '2rem', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    position: 'relative'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {drive.company[0]}
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      ACTIVE
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{drive.company}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>{drive.role}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Package</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{drive.package}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Date</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{new Date(drive.drive_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    <AlertCircle size={12} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    {drive.eligibility_criteria}
                  </p>
                  <button 
                    onClick={() => handleApply(drive.id)}
                    disabled={applications.some(a => a.drive_id === drive.id)}
                    style={{ 
                      width: '100%', padding: '1rem', borderRadius: '16px', border: 'none', 
                      background: applications.some(a => a.drive_id === drive.id) ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
                      color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}>
                    {applications.some(a => a.drive_id === drive.id) ? <><CheckCircle size={18} /> Applied</> : <><ArrowRight size={18} /> Apply Now</>}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tracker' && (
          <motion.div key="tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1.5rem' }}>Company</th>
                    <th style={{ padding: '1.5rem' }}>Role</th>
                    <th style={{ padding: '1.5rem' }}>Applied Date</th>
                    <th style={{ padding: '1.5rem' }}>Status</th>
                    <th style={{ padding: '1.5rem' }}>Next Step</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{app.company}</td>
                      <td style={{ padding: '1.5rem' }}>{app.role}</td>
                      <td style={{ padding: '1.5rem', color: 'var(--text-dim)' }}>{new Date(app.applied_date).toLocaleDateString()}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{ 
                          padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold',
                          background: app.status === 'Selected' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                          color: app.status === 'Selected' ? '#10b981' : '#3b82f6'
                        }}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <Calendar size={14} /> OA on 24th Oct
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>No applications yet. Go to "Drives" to start applying!</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'experiences' && (
          <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Interview Experience Center</h2>
              <button onClick={() => setShowExpModal(true)} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Share Your Story
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
              {experiences.map((exp, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{exp.student_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{exp.company} • {exp.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', color: '#f59e0b', gap: '2px' }}>
                      {[...Array(exp.rating)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" />)}
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    "{exp.experience_text.length > 150 ? exp.experience_text.substring(0, 150) + '...' : exp.experience_text}"
                  </p>
                  <button style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>Read Full Interview →</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmaps' && (
          <motion.div key="roadmaps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.keys(roadmaps).map(key => (
                <button 
                  key={key} 
                  onClick={() => setSelectedRoadmap(key)}
                  style={{ 
                    padding: '1.2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left',
                    background: selectedRoadmap === key ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedRoadmap === key ? '#818cf8' : 'white',
                    fontWeight: 'bold', cursor: 'pointer'
                  }}>
                  {roadmaps[key].title}
                </button>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '32px', padding: '3rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ marginBottom: '2rem' }}>{roadmaps[selectedRoadmap].title} Roadmap</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {roadmaps[selectedRoadmap].path.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 1 }}>{i + 1}</div>
                      {i < roadmaps[selectedRoadmap].path.length - 1 && <div style={{ flex: 1, width: '2px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>{step.level}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {step.skills.map(s => <span key={s} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Modal */}
      <AnimatePresence>
        {showExpModal && (
          <div className="modal-backdrop" onClick={() => setShowExpModal(false)} style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} style={{ background: '#111', width: '600px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Share Interview Experience</h2>
              <form onSubmit={handleAddExperience} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input placeholder="Company Name" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} required style={formInputStyle} />
                  <input placeholder="Role (e.g. SDE-1)" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} required style={formInputStyle} />
                </div>
                <textarea placeholder="Describe your interview rounds, questions asked, and overall process..." value={newExp.experience_text} onChange={e => setNewExp({...newExp, experience_text: e.target.value})} required style={{...formInputStyle, height: '150px', resize: 'none'}} />
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Difficulty Rating (1-5)</label>
                  <input type="range" min="1" max="5" value={newExp.rating} onChange={e => setNewExp({...newExp, rating: parseInt(e.target.value)})} style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Submit Experience</button>
                  <button type="button" onClick={() => setShowExpModal(false)} style={{ padding: '1.2rem', borderRadius: '16px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .loading-spinner { display: flex; justify-content: center; align-items: center; height: 300px; color: var(--primary); font-weight: bold; }
        .placement-hub-container { font-family: 'Inter', sans-serif; }
        th { color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

const formInputStyle = {
  padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
};

export default PlacementHub;
