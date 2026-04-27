import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, PieChart, TrendingDown, Award, Calendar, Search, Filter, Download, Zap, CreditCard, X } from 'lucide-react';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ student_id: '', amount: '', payment_date: '', status: 'Unpaid' });
  const baseUrl = 'http://localhost:8080';
  const isAdmin = (localStorage.getItem('role') || 'student') === 'admin';

  const fetchData = async () => {
    try {
      const [feesRes, summaryRes, studentsRes] = await Promise.all([
        axios.get(`${baseUrl}/fees`),
        axios.get(`${baseUrl}/fees/summary`),
        axios.get(`${baseUrl}/students`)
      ]);
      setFees(feesRes.data);
      setSummary(summaryRes.data);
      setStudents(studentsRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/fees`, form);
      setForm({ student_id: '', amount: '', payment_date: '', status: 'Unpaid' });
      setShowForm(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const markPaid = async (fee) => {
    try {
      await axios.put(`${baseUrl}/fees/${fee.id}`, {
        amount: fee.amount,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Paid'
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const filteredFees = fees.filter(f => 
    f.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div style={{ color: 'var(--text-dim)', padding: '2rem', textAlign: 'center' }}>Synchronizing financial ledgers...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Financial Intelligence Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {summary && (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{ padding: '2rem', borderRadius: '32px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <DollarSign size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0.5rem 0' }}>₹{Number(summary.total_collected).toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Current Semester Collection</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              style={{ padding: '2rem', borderRadius: '32px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <TrendingDown size={32} style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.6, textTransform: 'uppercase' }}>Accounts Receivable</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', margin: '0.5rem 0' }}>₹{Number(summary.total_pending).toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem' }}>Pending from {summary.unpaid_count} student accounts</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ padding: '2rem', borderRadius: '32px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
              <Award size={32} style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.6, textTransform: 'uppercase' }}>Scholarship Outlay</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', margin: '0.5rem 0' }}>₹{(summary.total_collected * 0.12).toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem' }}>12% of total revenue allocated</div>
            </motion.div>
          </>
        )}
      </div>

      {/* Advanced Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input 
            type="text" 
            placeholder="Search student or status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download size={16} /> Export
          </button>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
              {showForm ? <X size={16} /> : <Zap size={16} />} {showForm ? 'Cancel' : 'Register Payment'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 'bold' }}>STUDENT</label>
                <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required
                  style={{ padding: '1rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  <option value="">Select Account</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} (#{s.id})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 'bold' }}>AMOUNT (INR)</label>
                <input type="number" placeholder="₹ 0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required
                  style={{ padding: '1rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 'bold' }}>DATE</label>
                <input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} required
                  style={{ padding: '1rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>
                  COMPLETE TRANSACTION
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ledger Table */}
      <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entity</th>
              <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Transaction ID</th>
              <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Value</th>
              <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
              <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              {isAdmin && <th style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Registry</th>}
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee, i) => (
              <motion.tr key={fee.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {fee.student_name?.charAt(0)}
                    </div>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{fee.student_name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '0.8rem' }}>TX-{fee.id}8832-{i}</td>
                <td style={{ padding: '1.5rem 2rem', color: fee.status === 'Paid' ? '#10b981' : '#ef4444', fontWeight: '900', fontSize: '1.1rem' }}>₹{Number(fee.amount).toLocaleString()}</td>
                <td style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {fee.payment_date ? new Date(fee.payment_date).toLocaleDateString('en-IN') : '—'}
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: fee.status === 'Paid' ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: fee.status === 'Paid' ? '#10b981' : '#ef4444', boxShadow: `0 0 10px ${fee.status === 'Paid' ? '#10b981' : '#ef4444'}` }} />
                    {fee.status}
                  </div>
                </td>
                {isAdmin && (
                  <td style={{ padding: '1.5rem 2rem' }}>
                    {fee.status === 'Unpaid' ? (
                      <button onClick={() => markPaid(fee)}
                        style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CreditCard size={14} /> Verify
                      </button>
                    ) : (
                      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PieChart size={14} /> ARCHIVED
                      </div>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredFees.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '4rem' }}>No financial records match the criteria.</div>}
      </div>
    </div>
  );
};

export default FeeManagement;
