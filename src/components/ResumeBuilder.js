import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Briefcase, GraduationCap, Code, 
  Star, Cpu, Upload, CheckCircle, AlertCircle, BarChart3, Scan, Globe
} from 'lucide-react';

const ResumeBuilder = ({ student, courses = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [skills, setSkills] = useState(['Java', 'Python', 'SQL', 'Management']);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploaded, scanning, results
  const [scanScore, setScanScore] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(null);
  const fileInputRef = useRef(null);

  const autoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mappedSkills = courses.map(c => {
        const name = (c?.course_name || '').toLowerCase();
        if (name.includes('data')) return 'Data Analytics';
        if (name.includes('web')) return 'Full Stack Dev';
        if (name.includes('system')) return 'System Design';
        return null;
      }).filter(s => s !== null);
      
      setSkills(prev => Array.from(new Set([...prev, ...mappedSkills])));
      setIsGenerating(false);
    }, 1500);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('uploaded');
      // Auto-trigger scan after a brief delay
      setTimeout(() => startScan(), 800);
    }
  };

  const startScan = () => {
    setUploadStatus('scanning');
    setIsScanning(true);
    
    // Simulate AI deep scan
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
      setScanScore({
        overall: randomScore,
        skills: Math.floor(randomScore * 0.9),
        format: 85,
        relevance: Math.floor(randomScore * 0.95),
        feedback: randomScore > 85 
          ? "Exceptional layout and keyword density. Your resume is highly ATS-friendly." 
          : "Good foundation. Consider adding more quantifiable impact to your experience section."
      });
      setUploadStatus('results');
      setIsScanning(false);
    }, 3000);
  };

  const handleDeployPortfolio = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setPortfolioUrl(`https://mru.edu/p/${student?.name?.toLowerCase().replace(/ /g, '-') || 'student'}`);
    }, 2500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <motion.div 
          layout
          style={{ 
            background: 'white', color: '#1e293b', padding: '3rem', borderRadius: '8px', 
            minHeight: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative',
            overflow: 'hidden'
          }}
        >
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
              >
                <Cpu className="animate-spin" size={48} color="#6366f1" />
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ marginTop: '1rem', fontWeight: 'bold', color: '#6366f1' }}
                >
                  AI is mapping your competencies...
                </motion.p>
              </motion.div>
            )}

            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ position: 'relative' }}>
                  <FileText size={64} color="white" />
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    style={{ position: 'absolute', left: -10, right: -10, height: '2px', background: '#10b981', boxShadow: '0 0 15px #10b981' }}
                  />
                </div>
                <p style={{ marginTop: '2rem', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>AI SCANNING IN PROGRESS...</p>
                <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: '100%', height: '100%', background: '#10b981' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                {courses.slice(0, 4).map(c => <div key={c?.id || Math.random()}>• {c?.course_name || 'Generic Course'}</div>)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* ACTION CARD */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Star size={18} color="#fcd34d" /> AI Optimizer
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={autoGenerate}
              disabled={isGenerating || isScanning || isDeploying}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Cpu size={16} /> {isGenerating ? 'Mapping...' : 'Sync with Courses'}
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            
            <button 
              onClick={handleUploadClick}
              disabled={isGenerating || isScanning || isDeploying}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Upload size={16} /> {uploadStatus === 'idle' ? 'Upload External Resume' : 'Change Resume'}
            </button>

            <button 
              onClick={handleDeployPortfolio}
              disabled={isGenerating || isScanning || isDeploying}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <Globe size={16} /> {isDeploying ? 'Deploying...' : portfolioUrl ? 'Update Portfolio' : 'Deploy Live Portfolio'}
            </button>

            <button style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>
              <Download size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Export Current
            </button>
          </div>

          {portfolioUrl && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 'bold', marginBottom: '0.4rem' }}>LIVE PORTFOLIO URL</div>
              <div style={{ fontSize: '0.75rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                https://mru.edu/p/{student?.name?.toLowerCase().replace(/ /g, '-') || 'student'}
              </div>
            </motion.div>
          )}
        </div>

        {/* RESULTS CARD */}
        <AnimatePresence mode="wait">
          {uploadStatus === 'results' && scanScore ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h4 style={{ color: '#34d399', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart3 size={16} /> AI Analysis Result
                </h4>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#34d399' }}>{scanScore.overall}%</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { label: 'Skills Match', value: scanScore.skills },
                  { label: 'Formatting', value: scanScore.format },
                  { label: 'Job Relevance', value: scanScore.relevance }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
                      <span>{stat.label}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        style={{ height: '100%', background: '#34d399', borderRadius: '2px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                  <Star size={12} color="#fcd34d" style={{ marginRight: '0.4rem', display: 'inline' }} />
                  {scanScore.feedback}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="strength"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Resume Strength</h4>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>88/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Excellent! Your technical skill density is high based on enrolled curriculum.</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ padding: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <h4 style={{ color: '#818cf8', marginBottom: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={14} /> AI Recommendation
          </h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.4' }}>
            Applying for <strong>Full Stack</strong> roles? Ensure you mention your work on the SmarterCampus project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
