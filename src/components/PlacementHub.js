import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Briefcase, Award, BookOpen } from 'lucide-react';

const PlacementHub = () => {
  const [activeTab, setActiveTab] = useState('drives');
  const [selectedRoadmap, setSelectedRoadmap] = useState('sde');

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
    },
    cyber: {
      title: 'Cybersecurity Analyst',
      path: [
        { level: 'Networking', skills: ['TCP/IP', 'Wireshark', 'OSI Model', 'DNS Security'], resource: 'https://roadmap.sh/cyber-security' },
        { level: 'Offensive', skills: ['Ethical Hacking', 'Metasploit', 'SQL Injection', 'Buffer Overflow'], resource: 'https://tryhackme.com/' },
        { level: 'Defensive', skills: ['Incident Response', 'Firewall Mgmt', 'SIEM', 'Digital Forensics'], resource: 'https://www.cybrary.it/' },
      ],
      prep: ['CompTIA Security+', 'CEH Study Guide', 'HackTheBox Challenges']
    },
    design: {
      title: 'UI/UX Designer',
      path: [
        { level: 'Foundations', skills: ['Typography', 'Color Theory', 'Layout Design', 'Figma'], resource: 'https://roadmap.sh/ux-design' },
        { level: 'User Research', skills: ['Personas', 'User Flows', 'Wireframing', 'Prototyping'], resource: 'https://www.nngroup.com/' },
        { level: 'Design Systems', skills: ['Atomic Design', 'Accessibility (WCAG)', 'Handover', 'Micro-interactions'], resource: 'https://designsystems.com/' },
      ],
      prep: ['The Design of Everyday Things', 'Laws of UX', 'Behance/Dribbble Portfolio']
    }
  };

  const alumni = [
    { name: 'Rahul Sharma', class: '2022', company: 'Google', role: 'Senior SDE', image: '👨‍💻' },
    { name: 'Priya Patel', class: '2021', company: 'Meta', role: 'Product Manager', image: '👩‍💼' },
    { name: 'Arjun Reddy', class: '2023', company: 'Razorpay', role: 'Staff Engineer', image: '🚀' },
  ];

  const upcomingDrives = [
    { company: 'Google', role: 'SDE-1', package: '32 LPA', date: 'Oct 15, 2026', status: 'Eligible', logo: 'G' },
    { company: 'Meta', role: 'Product Engineer', package: '42 LPA', date: 'Oct 18, 2026', status: 'Eligible', logo: '∞' },
    { company: 'Razorpay', role: 'Backend Dev (Startup)', package: '24 LPA', date: 'Oct 20, 2026', status: 'Eligible', logo: 'R' },
    { company: 'Swiggy', role: 'System Engineer (Startup)', package: '26 LPA', date: 'Oct 21, 2026', status: 'Eligible', logo: 'S' },
    { company: 'Microsoft', role: 'Full Stack Dev', package: '28 LPA', date: 'Oct 22, 2026', status: 'Pending Review', logo: 'M' },
    { company: 'CRED', role: 'Frontend Engineer (Startup)', package: '30 LPA', date: 'Oct 25, 2026', status: 'Eligible', logo: 'C' },
    { company: 'Zomato', role: 'App Developer (Startup)', package: '22 LPA', date: 'Oct 28, 2026', status: 'Eligible', logo: 'Z' },
    { company: 'Ola Electric', role: 'EV Software Eng (Startup)', package: '18 LPA', date: 'Nov 02, 2026', status: 'Eligible', logo: 'O' },
    { company: 'Amazon', role: 'Cloud Engineer', package: '25 LPA', date: 'Nov 05, 2026', status: 'Action Required', logo: 'A' },
    { company: 'Apple', role: 'Core OS Engineer', package: '38 LPA', date: 'Nov 12, 2026', status: 'Eligible', logo: '' },
    { company: 'NVIDIA', role: 'AI Researcher', package: '45 LPA', date: 'Dec 10, 2026', status: 'Eligible', logo: 'N' },
  ];

  const skillGaps = [
    { skill: 'Data Structures', mastery: 85, trend: 'up' },
    { skill: 'System Design', mastery: 45, trend: 'up' },
    { skill: 'React.js', mastery: 92, trend: 'steady' },
    { skill: 'Cloud Architecture', mastery: 30, trend: 'up' },
  ];

  return (
    <div style={{ color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target color="#8b5cf6" size={28} /> Placement Intelligence Hub
          </h2>
          <p style={{ color: 'var(--text-dim)', margin: '0.5rem 0 0' }}>AI-driven recruitment tracking and skill gap analysis.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '12px' }}>
          {['drives', 'analysis', 'roadmaps', 'alumni'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', 
                background: activeTab === tab ? '#8b5cf6' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-dim)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'drives' && (
          <motion.div
            key="drives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {upcomingDrives.map((drive, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, background: 'rgba(255,255,255,0.04)' }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: '900' }}>
                    {drive.logo}
                  </div>
                  <div style={{ 
                    padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold',
                    background: drive.status === 'Eligible' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: drive.status === 'Eligible' ? '#10b981' : '#f59e0b',
                    border: `1px solid ${drive.status === 'Eligible' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                  }}>
                    {drive.status}
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{drive.company}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>{drive.role}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={14} /> CTC: <span style={{ color: 'white', fontWeight: 'bold' }}>{drive.package}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> Date: {drive.date}
                  </div>
                </div>
                <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid #8b5cf6', background: 'transparent', color: '#8b5cf6', fontWeight: 'bold', cursor: 'pointer' }}>
                  Apply Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="#10b981" /> Skill Mastery vs Market Needs
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skillGaps.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span>{skill.skill}</span>
                      <span style={{ color: skill.mastery > 70 ? '#10b981' : '#f59e0b' }}>{skill.mastery}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.mastery}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, #8b5cf6, ${skill.mastery > 70 ? '#10b981' : '#f59e0b'})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Award color="#8b5cf6" size={24} />
                  <h4 style={{ margin: 0 }}>AI Insight</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
                  You are in the **Top 5%** for React.js. However, your **System Design** score is below the Google benchmark. We suggest taking the "Scalable Systems" course next.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Active Preparation</h4>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span>Mock Interviews</span>
                    <span style={{ color: 'white' }}>12 Done</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span>Problem Solving</span>
                    <span style={{ color: 'white' }}>245 Solved</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmaps' && (
          <motion.div
            key="roadmaps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.keys(roadmaps).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedRoadmap(key)}
                  style={{
                    padding: '1rem', borderRadius: '16px', border: 'none', textAlign: 'left',
                    background: selectedRoadmap === key ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedRoadmap === key ? '#8b5cf6' : 'white',
                    cursor: 'pointer', border: selectedRoadmap === key ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem', fontWeight: 'bold'
                  }}
                >
                  {roadmaps[key].title}
                </button>
              ))}
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0 }}>{roadmaps[selectedRoadmap].title} Path</h3>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', background: 'rgba(16,185,129,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                  2026 UPDATED
                </span>
              </div>
              
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {roadmaps[selectedRoadmap].path.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                    {i !== roadmaps[selectedRoadmap].path.length - 1 && (
                      <div style={{ position: 'absolute', left: '15px', top: '35px', bottom: '-25px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />
                    )}
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 1 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: 'white' }}>{step.level}</h4>
                        <a href={step.resource} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#8b5cf6', textDecoration: 'none', fontWeight: 'bold' }}>VIEW RESOURCES →</a>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {step.skills.map((s, j) => (
                          <span key={j} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} color="#8b5cf6" /> Preparation Materials
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {roadmaps[selectedRoadmap].prep.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircle size={12} color="#10b981" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'alumni' && (
          <motion.div
            key="alumni"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {alumni.map((alum, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{alum.image}</div>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{alum.name}</h3>
                <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{alum.company} • {alum.role}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Class of {alum.class}</div>
                <button style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Users size={16} /> Book Coffee Chat
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlacementHub;
