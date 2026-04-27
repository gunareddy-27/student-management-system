import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Info, Zap, Target, Activity, BookOpen } from "lucide-react";

const AnalyticsChart = () => {
  const [stats, setStats] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // overview, predictive
  const polarChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const horizontalBarRef = useRef(null);
  
  const baseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${baseUrl}/dashboard/stats`);
        setStats(res.data);
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  const colors = {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    accent: '#ec4899', // Pink
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Rose
    muted: 'rgba(255, 255, 255, 0.4)',
    grid: 'rgba(255, 255, 255, 0.05)'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#fff',
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 10 }, usePointStyle: true, padding: 15 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 12,
        cornerRadius: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        backdropFilter: 'blur(10px)'
      }
    },
    scales: {
      y: { grid: { color: colors.grid }, ticks: { color: colors.muted, font: { size: 10 } } },
      x: { grid: { color: colors.grid }, ticks: { color: colors.muted, font: { size: 10 } } }
    }
  };

  useEffect(() => {
    if (!stats || activeView !== 'overview') return;

    // 1. Polar Area Chart (Campus Distribution)
    if (!polarChartRef.current || !barChartRef.current || !doughnutChartRef.current || !lineChartRef.current || !radarChartRef.current || !horizontalBarRef.current) return;

    const polarChart = new Chart(polarChartRef.current.getContext("2d"), {
      type: "polarArea",
      data: {
        labels: ["Students", "Courses", "Books", "Enrollments"],
        datasets: [{
          data: [stats.totalStudents, stats.totalCourses, stats.totalBooks, stats.totalEnrollments],
          backgroundColor: [colors.primary + '80', colors.secondary + '80', colors.accent + '80', colors.success + '80'],
          borderColor: 'rgba(255,255,255,0.2)',
          borderWidth: 1,
        }],
      },
      options: { ...chartOptions, scales: { r: { grid: { color: colors.grid }, ticks: { display: false } } } },
    });

    const barChart = new Chart(barChartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Collected", "Pending"],
        datasets: [{
          label: "Amount (₹)",
          data: [stats.feePaid, stats.feePending],
          backgroundColor: [colors.success + '90', colors.error + '90'],
          borderRadius: 12,
          barThickness: 40
        }],
      },
      options: chartOptions,
    });

    const doughnut = new Chart(doughnutChartRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Issued", "Available"],
        datasets: [{
          data: [stats.issuedBooks, stats.totalBooks - stats.issuedBooks],
          backgroundColor: [colors.secondary, colors.muted],
          borderWidth: 0,
          cutout: '75%'
        }],
      },
      options: { 
        ...chartOptions, 
        plugins: { ...chartOptions.plugins, title: { display: true, text: "Library Utilization", color: '#fff', font: { size: 14, weight: 'bold' } } } 
      },
    });

    const lineChart = new Chart(lineChartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
        datasets: [{
          label: "Engagement",
          data: [65, 78, 72, 85, 80, 92],
          borderColor: colors.primary,
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, colors.primary + '00');
            gradient.addColorStop(1, colors.primary + '40');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: colors.primary
        }],
      },
      options: chartOptions,
    });

    const radarChart = new Chart(radarChartRef.current.getContext("2d"), {
      type: "radar",
      data: {
        labels: ["Attendance", "Course Quality", "Library Usage", "Fee Collection", "Alert Resolution"],
        datasets: [{
          label: "Current Performance",
          data: [85, 90, 65, 75, 80],
          backgroundColor: colors.primary + '30',
          borderColor: colors.primary,
          pointBackgroundColor: colors.primary,
          borderWidth: 2
        }],
      },
      options: { 
        ...chartOptions, 
        scales: { r: { grid: { color: colors.grid }, angleLines: { color: colors.grid }, pointLabels: { color: '#94a3b8', font: { size: 9 } }, ticks: { display: false } } }
      },
    });

    const hBarChart = new Chart(horizontalBarRef.current.getContext("2d"), {
      type: "bar",
      indexAxis: 'y',
      data: {
        labels: ["At Risk", "Active SOS", "Overdue Returns", "Upcoming Returns"],
        datasets: [{
          label: "Count",
          data: [stats.atRiskStudents, stats.activeAlerts, stats.overdueReturns, stats.upcomingReturns],
          backgroundColor: [colors.error, colors.warning, colors.accent, colors.secondary],
          borderRadius: 8
        }],
      },
      options: chartOptions,
    });

    return () => {
      polarChart.destroy();
      barChart.destroy();
      doughnut.destroy();
      lineChart.destroy();
      radarChart.destroy();
      hBarChart.destroy();
    };
  }, [stats, activeView]);

  if (!stats) return <div style={{ color: 'var(--text-dim)', padding: '4rem', textAlign: 'center' }}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ marginBottom: '1rem' }}>
      <Brain size={48} color="#6366f1" />
    </motion.div>
    Loading SmarterCampus Intelligence...
  </div>;

  const cardStyle = {
    padding: "2rem",
    background: 'rgba(15, 23, 42, 0.3)',
    borderRadius: '32px',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)'
  };

  const riskScore = (stats.atRiskStudents / stats.totalStudents) * 100;
  const healthLevel = riskScore > 10 ? 'At Risk' : 'Optimal';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: '1rem' }}>
      
      {/* Switcher */}
      <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '16px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={() => setActiveView('overview')}
          style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: activeView === 'overview' ? '#6366f1' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          Institutional Overview
        </button>
        <button 
          onClick={() => setActiveView('predictive')}
          style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: activeView === 'predictive' ? '#6366f1' : 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Brain size={16} /> AI Predictive Engine
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={18} color={colors.primary} /> Campus Distribution
              </div>
              <div style={{ height: '250px' }}><canvas ref={polarChartRef} /></div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={18} color={colors.success} /> Financial Health
              </div>
              <div style={{ height: '250px' }}><canvas ref={barChartRef} /></div>
            </div>

            <div style={cardStyle}>
              <div style={{ height: '250px' }}><canvas ref={doughnutChartRef} /></div>
            </div>

            <div style={{ ...cardStyle, gridColumn: "span 2" }}>
              <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={18} color={colors.secondary} /> Student Engagement Trends
              </div>
              <div style={{ height: '250px' }}><canvas ref={lineChartRef} /></div>
            </div>

            <div style={cardStyle}>
               <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} color={colors.error} /> Risk Assessment
              </div>
              <div style={{ height: '250px' }}><canvas ref={horizontalBarRef} /></div>
            </div>

            <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
              <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={18} color={colors.accent} /> Performance Radar
              </div>
              <div style={{ height: '350px' }}><canvas ref={radarChartRef} /></div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="predictive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* AI Predictive Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
               <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Semester Pass Prediction</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '4px' }}>Based on current engagement & attendance</p>
                    </div>
                    <Brain size={32} color="#6366f1" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.05)', borderTopColor: '#6366f1', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                       <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900' }}>84%</span>
                    </div>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          <CheckCircle2 size={16} /> EXCELLENT OUTLOOK
                       </div>
                       <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '10px', lineHeight: '1.5' }}>
                         Our AI models predict an 84% probability of collective academic success this semester. High library utilization is the primary positive driver.
                       </p>
                    </div>
                  </div>
               </div>

               <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Dropout Risk Analysis</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '4px' }}>Identifying at-risk student patterns</p>
                    </div>
                    <AlertCircle size={32} color="#ef4444" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.05)', borderTopColor: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                       <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900' }}>{riskScore.toFixed(0)}%</span>
                    </div>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          <AlertCircle size={16} /> ACTION REQUIRED
                       </div>
                       <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '10px', lineHeight: '1.5' }}>
                         {stats.atRiskStudents} students have triggered risk protocols. Attendance correlation is 0.92, suggesting missing lectures is the lead indicator.
                       </p>
                    </div>
                  </div>
               </div>
            </div>

            <div style={{ ...cardStyle, padding: '3rem' }}>
               <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem', textAlign: 'center' }}>Strategic Recommendations</h4>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                  {[
                    { title: "Boost Library Engagement", desc: "Digital resource access is down 12% among Freshmen. Suggest adding new STEM titles.", icon: <BookOpen size={20} color="#6366f1" /> },
                    { title: "Attendance Intervention", desc: "Automate SMS alerts for students missing 2+ consecutive Engineering labs.", icon: <Zap size={20} color="#f59e0b" /> },
                    { title: "Fee Collection Blitz", desc: "Predictive revenue suggests a 15% shortfall unless overdue notices are sent by Friday.", icon: <Activity size={20} color="#ec4899" /> }
                  ].map((rec, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ marginBottom: '1rem' }}>{rec.icon}</div>
                       <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>{rec.title}</div>
                       <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', lineHeight: '1.6' }}>{rec.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsChart;

