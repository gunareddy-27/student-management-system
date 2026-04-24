import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  if (loading) return <p style={{ color: 'var(--text-dim)' }}>Loading fee data...</p>;

  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Collected', value: `₹${Number(summary.total_collected).toLocaleString()}`, color: '#22c55e', icon: '💰' },
            { label: 'Pending Dues', value: `₹${Number(summary.total_pending).toLocaleString()}`, color: '#ef4444', icon: '⚠️' },
            { label: 'Paid Records', value: summary.paid_count, color: '#3b82f6', icon: '✅' },
            { label: 'Unpaid Records', value: summary.unpaid_count, color: '#f59e0b', icon: '🔴' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{
                padding: '1.25rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)'
              }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Fee Button */}
      {isAdmin && (
        <button onClick={() => setShowForm(!showForm)}
          style={{ marginBottom: '1rem', padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
          {showForm ? '✖ Close' : '➕ Add Fee Record'}
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
            <input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)' }}>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
            <button type="submit" style={{ gridColumn: '1 / -1', padding: '0.6rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Fee Record
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Fee Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '0.5rem 1rem' }}>Student</th>
              <th style={{ padding: '0.5rem 1rem' }}>Amount</th>
              <th style={{ padding: '0.5rem 1rem' }}>Date</th>
              <th style={{ padding: '0.5rem 1rem' }}>Status</th>
              {isAdmin && <th style={{ padding: '0.5rem 1rem' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, i) => (
              <motion.tr key={fee.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{fee.student_name || 'N/A'}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: fee.status === 'Paid' ? '#22c55e' : '#ef4444' }}>₹{Number(fee.amount).toLocaleString()}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  {fee.payment_date ? new Date(fee.payment_date).toLocaleDateString('en-IN') : '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
                    background: fee.status === 'Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: fee.status === 'Paid' ? '#22c55e' : '#ef4444'
                  }}>
                    {fee.status}
                  </span>
                </td>
                {isAdmin && (
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {fee.status === 'Unpaid' && (
                      <button onClick={() => markPaid(fee)}
                        style={{ padding: '0.3rem 0.7rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', width: 'auto' }}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {fees.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No fee records found.</p>}
      </div>
    </div>
  );
};

export default FeeManagement;
