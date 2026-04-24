import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import axios from 'axios';

const AnalyticsChart = () => {
  const [stats, setStats] = useState(null);
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
    primary: '#8b5cf6', // Violet
    secondary: '#3b82f6', // Blue
    accent: '#ec4899', // Pink
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Rose
    muted: 'rgba(255, 255, 255, 0.5)',
    grid: 'rgba(255, 255, 255, 0.05)'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#fff',
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 }, usePointStyle: true, padding: 15 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Outfit', size: 14 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: { grid: { color: colors.grid }, ticks: { color: colors.muted } },
      x: { grid: { color: colors.grid }, ticks: { color: colors.muted } }
    }
  };

  useEffect(() => {
    if (!stats) return;

    // 1. Polar Area Chart (Campus Distribution)
    const polarCtx = polarChartRef.current.getContext("2d");
    const polarChart = new Chart(polarCtx, {
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

    // 2. Vertical Bar Chart (Financial Overview)
    const barCtx = barChartRef.current.getContext("2d");
    const barChart = new Chart(barCtx, {
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

    // 3. Doughnut (Library Status)
    const doughnutCtx = doughnutChartRef.current.getContext("2d");
    const doughnut = new Chart(doughnutCtx, {
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
        plugins: { ...chartOptions.plugins, title: { display: true, text: "Library Utilization", color: '#fff', font: { size: 16 } } } 
      },
    });

    // 4. Line Chart (Academic Trends - Simulated)
    const lineCtx = lineChartRef.current.getContext("2d");
    const lineChart = new Chart(lineCtx, {
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

    // 5. Radar Chart (Performance Matrix)
    const radarCtx = radarChartRef.current.getContext("2d");
    const radarChart = new Chart(radarCtx, {
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
        scales: { r: { grid: { color: colors.grid }, angleLines: { color: colors.grid }, pointLabels: { color: '#94a3b8', font: { size: 10 } }, ticks: { display: false } } }
      },
    });

    // 6. Horizontal Bar (Alerts & Risks)
    const hBarCtx = horizontalBarRef.current.getContext("2d");
    const hBarChart = new Chart(hBarCtx, {
      type: "bar",
      indexAxis: 'y',
      data: {
        labels: ["At Risk", "Active SOS", "Overdue Returns", "Upcoming Returns"],
        datasets: [{
          label: "Count",
          data: [stats.atRiskStudents, stats.activeAlerts, stats.overdueReturns, stats.upcomingReturns],
          backgroundColor: [colors.error, colors.warning, colors.accent, colors.secondary],
          borderRadius: 6
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
  }, [stats]);

  if (!stats) return <div style={{ color: 'var(--text-dim)', padding: '2rem', textAlign: 'center' }}>Loading high-fidelity analytics...</div>;

  const cardStyle = {
    flex: "1 1 calc(33% - 1rem)",
    minWidth: "300px",
    height: "320px",
    padding: "1.5rem",
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={cardStyle}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Campus Distribution</div>
        <div style={{ flex: 1 }}><canvas ref={polarChartRef} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={cardStyle}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Financial Health</div>
        <div style={{ flex: 1 }}><canvas ref={barChartRef} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={cardStyle}>
        <div style={{ flex: 1 }}><canvas ref={doughnutChartRef} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ ...cardStyle, flex: "1 1 calc(50% - 1rem)" }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Engagement Trend</div>
        <div style={{ flex: 1 }}><canvas ref={lineChartRef} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} style={{ ...cardStyle, flex: "1 1 calc(50% - 1rem)" }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Alerts & Risk Analysis</div>
        <div style={{ flex: 1 }}><canvas ref={horizontalBarRef} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} style={{ ...cardStyle, flex: "1 1 100%" }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Institutional Performance Radar</div>
        <div style={{ flex: 1 }}><canvas ref={radarChartRef} /></div>
      </motion.div>
    </div>
  );
};

export default AnalyticsChart;

