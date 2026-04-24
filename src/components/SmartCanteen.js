import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Clock, Wallet, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

const SmartCanteen = ({ studentWallet = 450 }) => {
  const [balance, setBalance] = useState(studentWallet);
  const [ordered, setOrdered] = useState([]);

  const menu = [
    { id: 1, name: 'Premium Veg Thali', price: 80, calories: 650, protein: '15g', status: 'High Demand' },
    { id: 2, name: 'Grilled Chicken Salad', price: 120, calories: 350, protein: '35g', status: 'Healthy Pick' },
    { id: 3, name: 'Paneer Butter Masala', price: 90, calories: 550, protein: '18g', status: 'Popular' },
    { id: 4, name: 'Fruit Bowl with Oats', price: 60, calories: 250, protein: '8g', status: 'Light' },
  ];

  const waitTimes = [
    { outlet: 'Main Canteen', time: '12-15 mins', status: 'busy', icon: '🏢' },
    { outlet: 'Juice Bar', time: '2-4 mins', status: 'clear', icon: '🥤' },
    { outlet: 'Bakery Block', time: '5-8 mins', status: 'moderate', icon: '🥐' },
  ];

  const handleOrder = (item) => {
    if (balance >= item.price) {
      setBalance(prev => prev - item.price);
      setOrdered([...ordered, item.id]);
      alert(`Order Placed: ${item.name}! Your token is #${Math.floor(Math.random() * 900) + 100}`);
    } else {
      alert("Insufficient Balance in Smart Wallet!");
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Daily Menu */}
        <section>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coffee size={20} color="#f59e0b" /> Daily Mess Menu
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {menu.map((item) => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -5 }}
                style={{ 
                  padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.05)', position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  {item.status}
                </div>
                <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span>🔥 {item.calories} kcal</span>
                  <span>💪 {item.protein} Protein</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>₹{item.price}</div>
                  <button 
                    onClick={() => handleOrder(item)}
                    disabled={ordered.includes(item.id)}
                    style={{ 
                      padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
                      background: ordered.includes(item.id) ? 'rgba(34, 197, 94, 0.1)' : 'var(--primary)',
                      color: ordered.includes(item.id) ? '#22c55e' : 'white',
                      cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                    }}
                  >
                    {ordered.includes(item.id) ? '✓ Ordered' : 'Pre-order Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Wait Times */}
        <section>
          <h3 style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#10b981" /> AI Crowd Analysis
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {waitTimes.map((w, i) => (
              <div key={i} style={{ flex: 1, minWidth: '200px', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{w.icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{w.outlet}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: w.status === 'busy' ? '#ef4444' : (w.status === 'moderate' ? '#f59e0b' : '#10b981') }}>
                    <Clock size={12} /> {w.time} wait
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Wallet Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <motion.div 
          style={{ 
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
            padding: '1.5rem', borderRadius: '24px', color: 'white', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Wallet size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 }}>Smart Wallet</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Current Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{balance.toFixed(2)}</div>
          <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            + Quick Topup
          </button>
        </motion.div>

        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Nutrition Insights</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                 <span>Protein Goal</span>
                 <span>65%</span>
               </div>
               <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                 <div style={{ width: '65%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
               </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.75rem', marginTop: '0.5rem' }}>
               <CheckCircle size={14} /> You're on track for your healthy goals!
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCanteen;
