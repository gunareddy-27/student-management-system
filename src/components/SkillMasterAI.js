import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, Clock, Award, ChevronRight, Zap, Star, Rocket, CheckCircle2, ListChecks, Link as LinkIcon } from 'lucide-react';

const SkillMasterAI = () => {
  const [skill, setSkill] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    if (!skill.trim()) return;
    setIsGenerating(true);
    setRoadmap(null);

    // Simulate AI Generation with a delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated data based on skill
    const generatedRoadmap = {
      skill: skill,
      difficulty: 'Intermediate',
      estimatedTime: '12 Weeks',
      phases: [
        {
          title: "Phase 1: Foundations & Core Concepts",
          duration: "2 Weeks",
          tasks: [
            "Master the basic syntax and ecosystem",
            "Understand architectural principles",
            "Setup professional development environment",
            "Complete 3 introductory projects"
          ],
          resources: ["Official Documentation", "Mastery Course on Udemy", "Introductory Workshop"]
        },
        {
          title: "Phase 2: Intermediate Deep Dive",
          duration: "4 Weeks",
          tasks: [
            "Implement complex state management",
            "Integrate third-party APIs and services",
            "Performance optimization techniques",
            "Build a comprehensive portfolio project"
          ],
          resources: ["Advanced Patterns Guide", "Community Forum Case Studies", "Open Source Analysis"]
        },
        {
          title: "Phase 3: Advanced Specialization",
          duration: "4 Weeks",
          tasks: [
            "Master security protocols and best practices",
            "Implement automated testing suites",
            "Scaling and deployment strategies",
            "Contribute to a major open-source repository"
          ],
          resources: ["Expert Masterclass", "Security Audit Checklist", "Deployment Best Practices"]
        },
        {
          title: "Phase 4: Mastery & Professional Portfolio",
          duration: "2 Weeks",
          tasks: [
            "Finalize a capstone production-grade project",
            "Technical interview preparation",
            "Portfolio website optimization",
            "Acquire professional certification"
          ],
          resources: ["Interview Prep Kit", "Certification Guide", "Portfolio Review Checklist"]
        }
      ],
      milestones: [
        "Weeks 1-2: Certified Beginner",
        "Weeks 3-6: Competent Practitioner",
        "Weeks 7-10: Advanced Architect",
        "Week 12: Skill Mastery"
      ]
    };

    setRoadmap(generatedRoadmap);
    setIsGenerating(false);
  };

  return (
    <div className="skill-master-container" style={{ color: 'white', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '100px', color: '#a78bfa', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}
        >
          <Zap size={16} /> AI Skill Agent v2.0
        </motion.div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Any Skill.
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Our AI agent builds a personalized, industry-standard roadmap to take you from novice to world-class mastery.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="What skill do you want to master? (e.g. Full Stack Dev, UI/UX, AI Engineering)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              width: '100%',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              color: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'}
          />
          <button
            onClick={generateRoadmap}
            disabled={isGenerating || !skill.trim()}
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              bottom: '10px',
              padding: '0 2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: (isGenerating || !skill.trim()) ? 0.6 : 1
            }}
          >
            {isGenerating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Clock size={18} />
              </motion.div>
            ) : (
              <Rocket size={18} />
            )}
            {isGenerating ? 'Building Roadmap...' : 'Build Roadmap'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '4rem 0' }}
          >
            <div className="ai-loader" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    style={{ width: '12px', height: '12px', background: '#8b5cf6', borderRadius: '50%' }}
                  />
                ))}
              </div>
            </div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Agent Analyzing Skill Domains...</h3>
            <p style={{ color: 'var(--text-dim)' }}>Generating curated resources and phase-wise milestones for {skill}.</p>
          </motion.div>
        )}

        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}
          >
            {/* Left Column: Phases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: '#a78bfa' }}>
                <ListChecks /> Actionable Learning Path
              </h2>
              {roadmap.phases.map((phase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', left: '-12px', top: '2rem', width: '24px', height: '24px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {idx + 1}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.25rem' }}>{phase.title}</h3>
                      <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> Duration: {phase.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Tasks</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {phase.tasks.map((task, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            <CheckCircle2 size={18} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Recommended Resources</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {phase.resources.map((res, i) => (
                          <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', fontSize: '0.85rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LinkIcon size={14} /> {res}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Sidebar Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '32px' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Award style={{ color: '#f59e0b' }} /> Mastery Overview
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Difficulty</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>{roadmap.difficulty}</div>
                  </div>
                  <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Time</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{roadmap.estimatedTime}</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1rem' }}>Key Milestones</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {roadmap.milestones.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '32px', height: '32px', background: i === roadmap.milestones.length - 1 ? '#f59e0b' : 'rgba(139, 92, 246, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i === roadmap.milestones.length - 1 ? <Star size={16} fill="#f59e0b" /> : <ChevronRight size={16} />}
                      </div>
                      <span style={{ fontSize: '0.9rem' }}>{m}</span>
                    </div>
                  ))}
                </div>

                <button style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', borderRadius: '16px', background: 'white', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <Rocket size={18} /> Start This Journey
                </button>
              </motion.div>

              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={18} color="#8b5cf6" /> Goal Tracking</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                  Sync this roadmap with your Smart Timetable to automatically allocate daily deep-work sessions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillMasterAI;
