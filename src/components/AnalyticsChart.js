import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";

const AnalyticsChart = ({ studentsCount, coursesCount }) => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const radarChartRef = useRef(null);

  const colors = {
    primary: '#6366f1', // Indigo
    secondary: '#ec4899', // Pink
    accent: '#8b5cf6', // Violet
    muted: 'rgba(255, 255, 255, 0.5)',
    grid: 'rgba(255, 255, 255, 0.05)'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#fff',
    plugins: {
      legend: { 
        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
      }
    },
    scales: {
      y: { 
        grid: { color: colors.grid },
        ticks: { color: colors.muted }
      },
      x: { 
        grid: { color: colors.grid },
        ticks: { color: colors.muted }
      }
    }
  };

  // Pie Chart
  useEffect(() => {
    const ctx = pieChartRef.current.getContext("2d");
    const pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Students", "Courses"],
        datasets: [{
          data: [studentsCount, coursesCount],
          backgroundColor: [colors.primary, colors.secondary],
          borderWidth: 0,
        }],
      },
      options: { ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Distribution", color: '#fff' } } },
    });
    return () => pieChart.destroy();
  }, [studentsCount, coursesCount]);

  // Bar Chart
  useEffect(() => {
    const ctx = barChartRef.current.getContext("2d");
    const barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Students", "Courses"],
        datasets: [{
          label: "Volume",
          data: [studentsCount, coursesCount],
          backgroundColor: [colors.primary, colors.secondary],
          borderRadius: 8,
        }],
      },
      options: chartOptions,
    });
    return () => barChart.destroy();
  }, [studentsCount, coursesCount]);

  // Doughnut
  useEffect(() => {
    const ctx = doughnutChartRef.current.getContext("2d");
    const doughnut = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Students", "Courses"],
        datasets: [{
          data: [studentsCount, coursesCount],
          backgroundColor: [colors.primary, colors.accent],
          borderWidth: 0,
          cutout: '70%'
        }],
      },
      options: chartOptions,
    });
    return () => doughnut.destroy();
  }, [studentsCount, coursesCount]);

  // Line
  useEffect(() => {
    const ctx = lineChartRef.current.getContext("2d");
    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Students",
            data: [studentsCount - 2, studentsCount - 1, studentsCount, studentsCount + 1],
            borderColor: colors.primary,
            backgroundColor: colors.primary + '20',
            fill: true,
            tension: 0.4
          }
        ],
      },
      options: chartOptions,
    });
    return () => lineChart.destroy();
  }, [studentsCount, coursesCount]);

  const cardStyle = {
    flex: "1 1 300px",
    height: "350px",
    padding: "1.5rem",
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
        <canvas ref={pieChartRef} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
        <canvas ref={barChartRef} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
        <canvas ref={doughnutChartRef} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={cardStyle}>
        <canvas ref={lineChartRef} />
      </motion.div>
    </div>
  );
};

export default AnalyticsChart;

