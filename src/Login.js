import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Auth.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", data.username);
        localStorage.setItem("role", data.role);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card"
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p>Login to manage your student records</p>
        </div>
        
        <div className="auth-form">
          <label className="input-label">Email Address</label>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="name@university.com" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <label className="input-label">Password</label>
          <input 
            type="password" 
            className="auth-input" 
            placeholder="••••••••" 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <label className="input-label">Identity</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              className={role === 'student' ? "primary" : "secondary"} 
              style={{ flex: 1, padding: '0.8rem', fontSize: '0.8rem' }}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button 
              className={role === 'admin' ? "primary" : "secondary"} 
              style={{ flex: 1, padding: '0.8rem', fontSize: '0.8rem' }}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="auth-button" 
            onClick={handleLogin}
          >
            Sign In
          </motion.button>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/signup" className="auth-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Don't have an account? <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Sign up</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

