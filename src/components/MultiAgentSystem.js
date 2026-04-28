import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Calendar, Target, Heart, Search, Microscope, Coffee, 
  ChevronRight, Sparkles, Zap, ShieldCheck, Trophy, 
  Lightbulb, Activity, GraduationCap, DollarSign, BookOpen,
  Timer, BarChart3, LineChart, PieChart, Info, AlertCircle,
  FileText, Briefcase, UserCheck, Flame, Droplets, Utensils,
  Play, Pause, RefreshCw, Check, X, Download, Share2
} from 'lucide-react';
import SkillMasterAI from './SkillMasterAI';

// --- SHARED PREMIUM COMPONENTS ---

const StatusBadge = ({ type, text }) => {
  const styles = {
    optimal: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', dot: '#10b981' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', dot: '#f59e0b' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', dot: '#ef4444' },
    active: { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', dot: '#8b5cf6' }
  };
  const s = styles[type] || styles.active;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, boxShadow: `0 0 8px ${s.dot}` }} />
      {text}
    </div>
  );
};

// --- INTERACTIVE AGENT COMPONENTS ---

const StudyArchitect = ({ onAction }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleExplain = () => {
    if (!query) return;
    setIsProcessing(true);
    setTimeout(() => {
      setExplanation(`Here is a simplified breakdown of ${query}: It's like a library where books represent data...`);
      setIsProcessing(false);
      onAction(`Explained: ${query}`);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <GraduationCap color="#8b5cf6" /> Study Architect Elite
        </h3>
        <StatusBadge type="optimal" text="Neural Engine Active" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Brain size={18} color="#8b5cf6" /> Concept Explainer</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="What should I explain?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
            <button 
              onClick={handleExplain}
              disabled={isProcessing || !query}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#8b5cf6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isProcessing ? 'Processing...' : 'Generate Explanation'}
            </button>
            <AnimatePresence>
              {explanation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', fontSize: '0.85rem', color: '#a78bfa' }}>
                  {explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Timer size={18} color="#8b5cf6" /> Deep Work Timer</h4>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem' }}>25:00</div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'white', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Start Session</button>
              <button style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}><RefreshCw size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartTempo = ({ onAction }) => {
  const [isDeepWork, setIsDeepWork] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Calendar color="#f59e0b" /> Smart Tempo Chronos
        </h3>
        <button 
          onClick={() => { setIsDeepWork(!isDeepWork); onAction(isDeepWork ? 'Deep Work Disabled' : 'Deep Work Enabled'); }}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', background: isDeepWork ? '#f59e0b' : 'rgba(255,255,255,0.05)', border: 'none', color: isDeepWork ? 'black' : 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isDeepWork ? '⚡ Deep Work ON' : 'Deep Work Mode'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem' }}>Dynamic Schedule Heal</h4>
          <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
             <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>I've found a 2-hour gap on Wednesday. Should I move your "Advanced AI" study session there?</p>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <button onClick={() => onAction('Schedule Healed')} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#f59e0b', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Confirm Heal</button>
               <button style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', cursor: 'pointer' }}>Dismiss</button>
             </div>
          </div>
        </div>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem' }}>Time Allocation</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Academic', val: 65, color: '#f59e0b' },
              { label: 'Personal', val: 25, color: '#3b82f6' },
              { label: 'Unallocated', val: 10, color: '#10b981' }
            ].map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>{s.label}</span>
                  <span>{s.val}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                  <div style={{ width: `${s.val}%`, height: '100%', background: s.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerNavigator = ({ onAction }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Target color="#3b82f6" /> Career Navigator Pro
        </h3>
        <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer' }}>Sync LinkedIn</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { company: 'Google', role: 'SWE - Cloud', match: '96%', gap: 'K8s Certification' },
            { company: 'Tesla', role: 'AI Integration', match: '88%', gap: 'Real-time OS' },
            { company: 'Meta', role: 'Frontend Architect', match: '92%', gap: 'None - Ready' }
          ].map((job, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedJob(job)}
              style={{ 
                padding: '1.5rem', 
                background: selectedJob?.company === job.company ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', 
                borderRadius: '20px', 
                border: '1px solid',
                borderColor: selectedJob?.company === job.company ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: '800' }}>{job.role}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{job.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#3b82f6' }}>{job.match}</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>Match Index</div>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedJob ? (
            <motion.div key={selectedJob.company} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ marginBottom: '1.5rem' }}>Opportunity Analysis</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Primary Skill Gap</div>
                  <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 'bold' }}>{selectedJob.gap}</div>
                </div>
                <button onClick={() => onAction(`Prep started for ${selectedJob.company}`)} style={{ padding: '1rem', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Start Preparation Plan</button>
                <button style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', cursor: 'pointer' }}>View Similar Roles</button>
              </div>
            </motion.div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Select an opportunity to view detailed AI analysis
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SentinelAI = ({ onAction }) => {
  const [mood, setMood] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Heart color="#ef4444" /> Sentinel Empath v4
        </h3>
        <StatusBadge type="optimal" text="Emotional Engine Ready" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem' }}>Daily Mood Tracker</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { e: '🤩', l: 'Elite' },
              { e: '😊', l: 'Good' },
              { e: '😐', l: 'Neutral' },
              { e: '😔', l: 'Stressed' },
              { e: '😫', l: 'Burnout' }
            ].map(m => (
              <button 
                key={m.l} 
                onClick={() => { setMood(m.l); onAction(`Mood Logged: ${m.l}`); }}
                style={{ 
                  fontSize: '1.5rem', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  background: mood === m.l ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)', 
                  border: mood === m.l ? '1px solid #ef4444' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {m.e}
              </button>
            ))}
          </div>
          {mood && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', color: '#fca5a5', fontSize: '0.9rem' }}>
              "I've logged your mood as **{mood}**. I'll adjust your study load for today."
            </motion.div>
          )}
        </div>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '1.5rem' }}>AI Support Session</h4>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Feeling overwhelmed? Start a private, anonymous chat with the empathy engine.</p>
          <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Start 5m Support Chat</button>
        </div>
      </div>
    </div>
  );
};

const GrantScout = ({ onAction }) => {
  const [applied, setApplied] = useState([]);

  const handleApply = (name) => {
    onAction(`Applied: ${name}`);
    setApplied([...applied, name]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <DollarSign color="#10b981" /> Grant Scout Intelligence
        </h3>
        <StatusBadge type="optimal" text="12 New Matches" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'Tech Innovators', amt: '$12k', deadline: '2d' },
          { name: 'STEM Excellence', amt: '$5k', deadline: '12d' },
          { name: 'Green Campus', amt: '$3k', deadline: '30d' }
        ].map((g, i) => (
          <div key={i} className="card-glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Ends in {g.deadline}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{g.name}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1.5rem' }}>{g.amt}</div>
            <button 
              onClick={() => handleApply(g.name)}
              disabled={applied.includes(g.name)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '12px', 
                background: applied.includes(g.name) ? 'rgba(255,255,255,0.05)' : '#10b981', 
                color: applied.includes(g.name) ? 'var(--text-dim)' : 'white', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}
            >
              {applied.includes(g.name) ? 'Application Sent' : 'One-Click Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResearchCatalyst = ({ onAction }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onAction(`Research Paper Drafted: ${topic}`);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Microscope color="#ec4899" /> Research Catalyst X
        </h3>
        <StatusBadge type="active" text="Indexing Journals..." />
      </div>

      <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h4 style={{ marginBottom: '1.5rem' }}>Autonomous Thesis Generator</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <textarea 
            placeholder="What is your research topic?" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '100px' }}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isGenerating ? 'Synthesizing Literature & Draft...' : 'Generate Research Draft'}
          </button>
        </div>
      </div>
    </div>
  );
};

const NutriBot = ({ onAction }) => {
  const [water, setWater] = useState(65);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Coffee color="#f59e0b" /> NutriBot Elite
        </h3>
        <StatusBadge type="optimal" text="Bio-Metrics Synced" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Hydration Tracker</h4>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#3b82f6', marginBottom: '1rem' }}>{water}%</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => { setWater(Math.min(100, water + 10)); onAction('Water Intake Logged'); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer' }}>+ 250ml</button>
              <button onClick={() => setWater(0)} style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer' }}><RefreshCw size={18} /></button>
            </div>
          </div>
        </div>
        <div className="card-glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Smart Canteen Suggestion</h4>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.1)', color: '#fcd34d' }}>
            "Based on your high activity, you need **25g more protein**. The *Quinoa Power Bowl* at Canteen B is your best match."
          </div>
          <button onClick={() => onAction('Meal Pre-ordered')} style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: '#f59e0b', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Pre-order for Pickup</button>
        </div>
      </div>
    </div>
  );
};

const AutomationEngine = ({ onAction }) => {
  const [logs, setLogs] = useState([
    { id: 1, action: 'Neural Sync Complete', detail: '8 Agents updated with latest session data', time: 'Just now', impact: '+12% Efficiency' },
    { id: 2, action: 'Schedule Healed', detail: 'Re-allocated 1hr gap to "Deep Work"', time: '2m ago', impact: 'Save: 45m' },
    { id: 3, action: 'Resume Synced', detail: 'Added "Advanced React" skill from Mastery Plan', time: '15m ago', impact: 'Job Match ↑' }
  ]);

  const [automations, setAutomations] = useState([
    { id: 'heal', name: 'Smart Schedule Healing', desc: 'Auto-adjusts calendar on class cancellations', active: true, savings: '4.2 hrs/wk' },
    { id: 'sync', name: 'Resume Auto-Sync', desc: 'Updates professional profile on skill mastery', active: true, savings: 'Manual Work: 0' },
    { id: 'grant', name: 'Grant Autopilot', desc: 'Drafts scholarship applications automatically', active: true, savings: 'Drafting: 100%' },
    { id: 'fine', name: 'Autonomous Fine Settlement', desc: 'Clears library fines under $1 automatically', active: true, savings: 'Admin Overhead: 0' }
  ]);

  const toggleAutomation = (id) => {
    setAutomations(automations.map(a => a.id === id ? { ...a, active: !a.active } : a));
    const auto = automations.find(a => a.id === id);
    onAction(`Automation ${auto.name} ${!auto.active ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>Autonomous Orchestrator v5</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
               System Integrity: Optimal
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Live Autonomous Feed</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map((log) => (
              <motion.div key={log.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '800' }}>{log.action}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{log.detail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>{log.impact}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{log.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Manage Triggers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {automations.map(auto => (
              <div key={auto.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '700' }}>{auto.name}</span>
                  <div 
                    onClick={() => toggleAutomation(auto.id)}
                    style={{ width: '40px', height: '20px', background: auto.active ? '#10b981' : '#334155', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'absolute', top: '2px', left: auto.active ? '22px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>{auto.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SYSTEM COMPONENT ---

const MultiAgentSystem = () => {
  const [activeAgent, setActiveAgent] = useState('skill');
  const [notifications, setNotifications] = useState([]);
  const [showBlueprint, setShowBlueprint] = useState(false);

  const addNotification = (msg) => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg }, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const agents = [
    { id: 'skill', name: 'Skill Master Elite', icon: <Zap size={20} />, color: '#8b5cf6', component: <SkillMasterAI />, blueprint: 'Model: Rule-based Expert System • Logic: Sequential Phase Generation • Input: Skill Tag' },
    { id: 'study', name: 'Study Architect', icon: <GraduationCap size={20} />, color: '#8b5cf6', component: <StudyArchitect onAction={addNotification} />, blueprint: 'Model: Transformer (GPT-style) • Task: Text Summarization & Synthesis • Input: Query/Document' },
    { id: 'tempo', name: 'Smart Tempo', icon: <Calendar size={20} />, color: '#f59e0b', component: <SmartTempo onAction={addNotification} />, blueprint: 'Model: Time-Series Analysis • Task: Chronos Optimization • Input: Attendance & Task Logs' },
    { id: 'career', name: 'Career Navigator', icon: <Target size={20} />, color: '#3b82f6', component: <CareerNavigator onAction={addNotification} />, blueprint: 'Model: Random Forest Classifier • Task: Job Match Prediction • Input: Skill Matrix & GPA' },
    { id: 'sentinel', name: 'Sentinel AI', icon: <Heart size={20} />, color: '#ef4444', component: <SentinelAI onAction={addNotification} />, blueprint: 'Model: VADER Sentiment Analysis • Task: Emotional Monitoring • Input: Sentiment Score' },
    { id: 'grant', name: 'Grant Scout', icon: <DollarSign size={20} />, color: '#10b981', component: <GrantScout onAction={addNotification} />, blueprint: 'Model: Pattern Matching / KNN • Task: Scholarship Scoring • Input: Student Profile' },
    { id: 'research', name: 'Research Catalyst', icon: <Microscope size={20} />, color: '#ec4899', component: <ResearchCatalyst onAction={addNotification} />, blueprint: 'Model: TF-IDF / LSA • Task: Academic Synthesis • Input: Research Abstract' },
    { id: 'nutri', name: 'NutriBot', icon: <Coffee size={20} />, color: '#f59e0b', component: <NutriBot onAction={addNotification} />, blueprint: 'Model: Heuristic Optimizer • Task: Macronutrient Balancing • Input: Canteen JSON Data' },
    { id: 'automation', name: 'Automation Engine', icon: <ShieldCheck size={20} />, color: '#10b981', component: <AutomationEngine onAction={addNotification} />, blueprint: 'Model: Event-Driven Logic Gate • Task: Autonomous Triggering • Input: Multi-Agent Signal' }
  ];

  return (
    <div className="multi-agent-system" style={{ color: 'white', maxWidth: '1400px', margin: '0 auto' }}>
      {/* LOCAL TOAST SYSTEM */}
      <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100000, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id} 
              initial={{ opacity: 0, x: 50, scale: 0.9 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              style={{ padding: '1rem 1.5rem', background: 'rgba(30, 27, 75, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <Sparkles size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{n.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '2rem', minHeight: '80vh' }}>
        {/* Agent Sidebar Navigation */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900' }}>
            <Sparkles color="#8b5cf6" /> AI Pavilion <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>v4.0</span>
          </h2>
          {agents.map(agent => (
            <motion.button
              key={agent.id}
              whileHover={{ x: 8, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveAgent(agent.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.4rem',
                borderRadius: '20px',
                border: 'none',
                background: activeAgent === agent.id ? `linear-gradient(135deg, ${agent.color}, transparent)` : 'transparent',
                color: activeAgent === agent.id ? 'white' : 'var(--text-dim)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                border: activeAgent === agent.id ? `1px solid ${agent.color}50` : '1px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '12px', background: activeAgent === agent.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                {agent.icon}
              </span>
              <span style={{ fontWeight: activeAgent === agent.id ? '800' : '500', fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>{agent.name}</span>
              {activeAgent === agent.id && <ChevronRight size={18} style={{ marginLeft: 'auto', position: 'relative', zIndex: 1 }} />}
            </motion.button>
          ))}
        </div>

        {/* Active Agent Viewport */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '3.5rem', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          
          {/* TECHNICAL BLUEPRINT TOGGLE */}
          <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 10 }}>
            <button 
              onClick={() => setShowBlueprint(!showBlueprint)}
              style={{ padding: '0.5rem 1rem', borderRadius: '100px', background: showBlueprint ? '#8b5cf6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', color: showBlueprint ? 'white' : '#a78bfa', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Info size={14} /> {showBlueprint ? 'HIDE BLUEPRINT' : 'VIEW TECHNICAL BLUEPRINT'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showBlueprint && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'absolute', top: '4.5rem', left: '3.5rem', right: '3.5rem', zIndex: 5, padding: '1.25rem', background: 'rgba(139, 92, 246, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', color: '#a78bfa', fontSize: '0.8rem', fontWeight: '500', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                   <ShieldCheck size={16} /> ACADEMIC JUSTIFICATION
                </div>
                {agents.find(a => a.id === activeAgent).blueprint}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeAgent}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              {agents.find(a => a.id === activeAgent).component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global AI Intelligence Hub Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginTop: '3rem' }}>
        {[
          { label: 'Neural Throughput', val: '98.2 GB/s', icon: <Activity size={20} />, color: '#8b5cf6' },
          { label: 'Intelligence Depth', val: 'Level 14', icon: <BarChart3 size={20} />, color: '#3b82f6' },
          { label: 'Proactive Confidence', val: '99.4%', icon: <Lightbulb size={20} />, color: '#f59e0b' },
          { label: 'Network Harmony', val: 'Optimal', icon: <ShieldCheck size={20} />, color: '#10b981' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
            style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600' }}>{stat.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900' }}>{stat.val}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MultiAgentSystem;
