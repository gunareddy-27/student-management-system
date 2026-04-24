import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Briefcase, GraduationCap, Code, Star, Cpu } from 'lucide-react';

const ResumeBuilder = ({ student, courses = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState(['Java', 'Python', 'SQL', 'Management']);

  const autoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Logic to pull skills from courses
      const mappedSkills = courses.map(c => {
        if (c.course_name.toLowerCase().includes('data')) return 'Data Analytics';
        if (c.course_name.toLowerCase().includes('web')) return 'Full Stack Dev';
        if (c.course_name.toLowerCase().includes('system')) return 'System Design';
        return null;
      }).filter(s => s !== null);
      
      setSkills(prev => Array.from(new Set([...prev, ...mappedSkills])));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <motion.div 
          style={{ 
            background: 'white', color: '#1e293b', padding: '3rem', borderRadius: '8px', 
            minHeight: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' 
          }}
        >
          {isGenerating && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <Cpu className="animate-spin" size={48} color="#6366f1" />
              <p style={{ marginTop: '1rem', fontWeight: 'bold', color: '#6366f1' }}>AI is mapping your competencies...</p>
            </div>
          )}

          <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>{student?.name || 'STUDENT NAME'}</h1>
            <p style={{ fontSize: '1rem', color: '#64748b' }}>{student?.email} | +91 {student?.phone} | Hyderabad, India</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Technical Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map(s => <span key={s} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>{s}</span>)}
              </div>

              <h3 style={{ fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Education</h3>
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 'bold' }}>Malla Reddy University</div>
                <div>B.Tech in CSE</div>
                <div style={{ color: '#64748b' }}>2023 - 2027</div>
                <div style={{ marginTop: '0.5rem' }}>GPA: 9.2/10.0</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Experience & Projects</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <span>SmarterCampus Platform</span>
                  <span>Jan 2026 - Present</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.4rem' }}>Developed an AI-integrated student management system with real-time analytics and predictive modeling using React and Node.js.</p>
              </div>

              <h3 style={{ fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Key Courses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                {courses.slice(0, 4).map(c => <div key={c.id}>• {c.course_name}</div>)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Star size={18} color="#fcd34d" /> AI Optimizer
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>The AI will analyze your <strong>{courses.length} courses</strong> and academic record to map professional competencies.</p>
          <button 
            onClick={autoGenerate}
            disabled={isGenerating}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            {isGenerating ? 'Mapping Skills...' : 'Re-sync with AI'}
          </button>
          <button style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Export as PDF
          </button>
        </div>

        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Resume Strength</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>88/100</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Excellent! Your technical skill density is high.</div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
