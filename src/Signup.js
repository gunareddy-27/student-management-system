import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Auth.css"; 

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email.split('@')[0], email, password, role })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card"
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p>Join our student management community</p>
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

          <label className="input-label">Account Type</label>
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
            onClick={handleSignup}
          >
            Create Account
          </motion.button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/login" className="auth-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Already have an account? <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Login</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

