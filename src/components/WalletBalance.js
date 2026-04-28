import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const WalletBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');

  const fetchBalance = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/wallet/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Wallet fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTopup = async () => {
    if (!topupAmount) return;
    try {
      await axios.post('http://localhost:8080/api/wallet/topup', { amount: topupAmount });
      fetchBalance();
      setShowTopup(false);
      setTopupAmount('');
    } catch (err) {
      alert("Topup failed");
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>Campus Wallet</h4>
        <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 'bold' }}>SECURE</span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>
          ${loading ? '---' : balance.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Available Credits</div>
      </div>

      <button 
        onClick={() => setShowTopup(!showTopup)}
        style={{ width: '100%', padding: '0.8rem', background: 'var(--secondary)', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}
      >
        {showTopup ? 'Cancel' : 'Add Credits'}
      </button>

      <AnimatePresence>
        {showTopup && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: '1rem', overflow: 'hidden' }}
          >
            <input 
              type="number"
              placeholder="Amount"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)' }}
            />
            <button 
              onClick={handleTopup}
              className="primary"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              Confirm Deposit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletBalance;
