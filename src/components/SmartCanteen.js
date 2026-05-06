import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Clock, Wallet, CheckCircle, TrendingUp, ShoppingBag, 
  Trash2, MapPin, Navigation, ChefHat, Sparkles, AlertCircle,
  Pizza, Flame, Zap, Salad, X, CreditCard, ShieldCheck
} from 'lucide-react';

const SmartCanteen = ({ socket, studentWallet = 450 }) => {
  const [balance, setBalance] = useState(studentWallet);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderStatus, setOrderStatus] = useState(null); // 'preparing', 'out-for-delivery', 'delivered'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryBlock, setDeliveryBlock] = useState('Hostel Block A');
  const [deliveryRoom, setDeliveryRoom] = useState('');
  const [orderProgress, setOrderProgress] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('selection'); // selection, processing, success
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const categories = ['All', 'Breakfast', 'Main Course', 'Salads', 'Drinks', 'Snacks'];

  const menu = [
    { id: 1, name: 'Premium Veg Thali', price: 80, calories: 650, protein: '15g', category: 'Main Course', status: 'High Demand', img: '🍱' },
    { id: 2, name: 'Grilled Chicken Salad', price: 120, calories: 350, protein: '35g', category: 'Salads', status: 'Healthy Pick', img: '🥗' },
    { id: 3, name: 'Paneer Butter Masala', price: 90, calories: 550, protein: '18g', category: 'Main Course', status: 'Popular', img: '🥘' },
    { id: 4, name: 'Fruit Bowl with Oats', price: 60, calories: 250, protein: '8g', category: 'Breakfast', status: 'Light', img: '🥣' },
    { id: 5, name: 'Artisan Cappuccino', price: 45, calories: 120, protein: '4g', category: 'Drinks', status: 'Fresh', img: '☕' },
    { id: 6, name: 'Spiced Avocado Toast', price: 110, calories: 320, protein: '10g', category: 'Breakfast', status: 'Trending', img: '🥑' },
    { id: 7, name: 'Peri Peri Loaded Fries', price: 75, calories: 450, protein: '6g', category: 'Snacks', status: 'Must Try', img: '🍟' },
    { id: 8, name: 'Quinoa Power Bowl', price: 140, calories: 380, protein: '22g', category: 'Salads', status: 'Superfood', img: '🥣' },
    { id: 9, name: 'Hyderabadi Veg Biryani', price: 110, calories: 500, protein: '12g', category: 'Main Course', status: 'Classic', img: '🍛' },
    { id: 10, name: 'Butter Chicken Roast', price: 150, calories: 700, protein: '45g', category: 'Main Course', status: 'Premium', img: '🍗' },
    { id: 11, name: 'Masala Dosa with Chutney', price: 50, calories: 300, protein: '6g', category: 'Breakfast', status: 'Bestseller', img: '🥞' },
    { id: 12, name: 'Cold Brew Coffee', price: 65, calories: 50, protein: '1g', category: 'Drinks', status: 'Refresh', img: '🥤' },
    { id: 13, name: 'Mango Protein Smoothie', price: 90, calories: 280, protein: '20g', category: 'Drinks', status: 'Healthy', img: '🍹' },
    { id: 14, name: 'Crispy Samosa (2pc)', price: 30, calories: 220, protein: '4g', category: 'Snacks', status: 'Quick Bite', img: '🥟' },
    { id: 15, name: 'Spicy Chicken Wings', price: 130, calories: 450, protein: '30g', category: 'Snacks', status: 'Spicy', img: '🍗' },
    { id: 16, name: 'Greek Feta Salad', price: 105, calories: 280, protein: '12g', category: 'Salads', status: 'Fresh', img: '🥗' },
  ];

  const deliveryPoints = [
    'Hostel Block A', 'Hostel Block B', 'Main Library', 'Engineering Lab 204', 'Administrative Building', 'Open Amphitheater'
  ];

  const waitTimes = [
    { outlet: 'Main Canteen', time: '12-15 mins', status: 'busy', icon: '🏢' },
    { outlet: 'Juice Bar', time: '2-4 mins', status: 'clear', icon: '🥤' },
    { outlet: 'Bakery Block', time: '5-8 mins', status: 'moderate', icon: '🥐' },
  ];

  const filteredMenu = activeCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (balance >= totalPrice) {
      setIsPaymentModalOpen(true);
      setPaymentStep('selection');
    } else {
      alert("Insufficient Balance in Smart Wallet!");
    }
  };

  const finalizePayment = () => {
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
      setBalance(prev => prev - totalPrice);
      if (socket) {
        socket.emit('CAMPUS_PULSE', {
          id: Date.now(),
          msg: `🍔 Someone just ordered from the Canteen! Order total: ₹${totalPrice}`,
          type: 'canteen',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }, 2000);

    // After success, start order lifecycle
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setOrderStatus('preparing');
      setCart([]);
      setOrderProgress(20);
      
      // Simulate order lifecycle
      setTimeout(() => {
        setOrderStatus('out-for-delivery');
        setOrderProgress(60);
      }, 5000);

      setTimeout(() => {
        setOrderStatus('delivered');
        setOrderProgress(100);
        
        // Trigger feedback modal after a short delay
        setTimeout(() => {
          setIsFeedbackModalOpen(true);
          setOrderStatus(null);
        }, 3000);
      }, 10000);
    }, 4500);
  };

  const handleRecharge = (amount) => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;
    
    setBalance(prev => prev + value);
    setIsRechargeModalOpen(false);
    setRechargeAmount('');
    alert(`Successfully recharged ₹${value}! New balance: ₹${(balance + value).toFixed(2)}`);
  };

  const submitFeedback = () => {
    alert(`Thank you for your ${rating}-star feedback! Your comments have been sent to the Canteen Management.`);
    setIsFeedbackModalOpen(false);
    setRating(0);
    setComment('');
  };

  return (
    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* Left Side: Menu and Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Header Section */}
          <div style={{ 
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
            backgroundSize: 'cover', backgroundPosition: 'center',
            padding: '3rem 2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> AI Powered Menu
                </span>
                <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Fast Delivery
                </span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 1rem 0' }}>Campus <span style={{ color: '#f59e0b' }}>FoodHub</span></h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '450px', lineHeight: '1.6' }}>
                Fresh meals, nutrition-first ingredients, and lightning-fast delivery to any campus coordinate.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none',
                  background: activeCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                  whiteSpace: 'nowrap', transition: 'all 0.3s ease',
                  boxShadow: activeCategory === cat ? '0 10px 20px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Pizza size={24} color="#f59e0b" /> Today's Selection
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filteredMenu.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  style={{ 
                    padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.65rem', padding: '0.3rem 0.7rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)', fontWeight: 'bold' }}>
                    {item.status}
                  </div>
                  
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px' }}>
                    {item.img}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{item.name}</h4>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={12} color="#ef4444" /> {item.calories} kcal</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={12} color="#f59e0b" /> {item.protein} Protein</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>₹{item.price}</div>
                    <button 
                      onClick={() => addToCart(item)}
                      style={{ 
                        width: '44px', height: '44px', borderRadius: '14px', border: 'none',
                        background: 'var(--primary)', color: 'white',
                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI Crowd Analysis */}
          <section style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <TrendingUp size={20} color="#10b981" /> Live Queue Metrics
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>LIVE UPDATING</div>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {waitTimes.map((w, i) => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{w.icon}</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.status === 'busy' ? '#ef4444' : (w.status === 'moderate' ? '#f59e0b' : '#10b981') }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{w.outlet}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      <Clock size={12} /> {w.time} wait
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Wallet & Cart Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Smart Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              padding: '2rem', borderRadius: '28px', color: 'white', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
              position: 'relative', overflow: 'hidden'
            }}
          >
             {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
              <Wallet size={24} />
              <span style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>Uni-Wallet Pro</span>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>Available Balance</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>₹{balance.toFixed(2)}</div>
            
            <button 
              onClick={() => setIsRechargeModalOpen(true)}
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
            >
              + Instant Recharge
            </button>
          </motion.div>

          {/* Delivery Configuration */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#3b82f6" /> Delivery Location
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>Select Block / Building</label>
                <select 
                  value={deliveryBlock}
                  onChange={(e) => setDeliveryBlock(e.target.value)}
                  style={{
                    width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer'
                  }}
                >
                  {deliveryPoints.map(point => <option key={point} value={point} style={{ background: '#1e1b4b' }}>{point}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>Room / Lab Number</label>
                <input 
                  type="text"
                  placeholder="e.g. Room 302, Lab 4"
                  value={deliveryRoom}
                  onChange={(e) => setDeliveryRoom(e.target.value)}
                  style={{
                    width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              My Cart {cart.length > 0 && <span style={{ background: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem' }}>{cart.length} items</span>}
            </h4>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '300px', marginBottom: '1.5rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <ShoppingBag size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Your cart is empty.<br/>Add something delicious!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px' }}>
                      {item.img}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>₹{item.price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <span>Total</span>
                  <span style={{ color: '#f59e0b' }}>₹{totalPrice}</span>
                </div>
                <button 
                  onClick={handlePlaceOrder}
                  style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}
                >
                  Confirm Order & Pay
                </button>
              </div>
            )}
          </div>

          {/* Nutrition Advisor */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Salad size={16} color="#10b981" /> Nutrition Advisor
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                   <span>Protein intake goal</span>
                   <span>65%</span>
                 </div>
                 <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                   <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: '10px' }} />
                 </div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                 <CheckCircle size={14} /> AI Recommendation: Try the Quinoa bowl for better protein-carb balance today.
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Order Status Overlay */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{ 
              position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: '600px', background: 'rgba(30, 27, 75, 0.9)', backdropFilter: 'blur(20px)',
              padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', gap: '1.5rem'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {orderStatus === 'preparing' && <ChefHat size={32} color="#f59e0b" />}
              {orderStatus === 'out-for-delivery' && <Navigation size={32} color="#3b82f6" className="animate-pulse" />}
              {orderStatus === 'delivered' && <CheckCircle size={32} color="#10b981" />}
              
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <motion.circle 
                  cx="30" cy="30" r="28" fill="none" stroke={orderStatus === 'delivered' ? '#10b981' : '#f59e0b'} strokeWidth="4" 
                  strokeDasharray="175.9" 
                  initial={{ strokeDashoffset: 175.9 }}
                  animate={{ strokeDashoffset: 175.9 - (175.9 * orderProgress / 100) }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {orderStatus === 'preparing' && 'Chef is preparing your meal...'}
                {orderStatus === 'out-for-delivery' && `On the way to ${deliveryBlock}${deliveryRoom ? `, ${deliveryRoom}` : ''}`}
                {orderStatus === 'delivered' && 'Order Delivered! Enjoy!'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Order #CAMP-{Math.floor(Math.random() * 9000) + 1000} • Estimated arrival: 5 mins
              </div>
              <div style={{ marginTop: '0.75rem', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                 <motion.div 
                   animate={{ width: `${orderProgress}%` }}
                   style={{ height: '100%', background: orderStatus === 'delivered' ? '#10b981' : 'var(--primary)' }}
                 />
              </div>
            </div>

            {orderStatus === 'delivered' && (
              <button onClick={() => setOrderStatus(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake Payment Gateway Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '24px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            >
              {/* Header */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                    <Zap size={18} fill="white" />
                  </div>
                  <span style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>PayUni Gateway</span>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20}/></button>
              </div>

              <div style={{ padding: '2rem' }}>
                {paymentStep === 'selection' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Amount to Pay</div>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>₹{totalPrice.toFixed(2)}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {[
                         { id: 'wallet', name: 'Smart Wallet', sub: `Bal: ₹${balance.toFixed(2)}`, icon: <Wallet size={20}/> },
                         { id: 'coins', name: 'CampusCoins', sub: `Pay with rewards`, icon: <Zap size={20} color="#f59e0b" fill="#f59e0b" /> },
                         { id: 'card', name: 'Credit / Debit Card', sub: 'Visa, Mastercard', icon: <CreditCard size={20}/> },
                         { id: 'upi', name: 'UPI Payment', sub: 'Google Pay, PhonePe', icon: <Navigation size={20} style={{ transform: 'rotate(45deg)' }}/> }
                       ].map(method => (
                         <div 
                           key={method.id}
                           onClick={() => setPaymentMethod(method.id)}
                           style={{ 
                             padding: '1rem', borderRadius: '16px', border: paymentMethod === method.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                             background: paymentMethod === method.id ? '#f5f3ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
                           }}
                         >
                           <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: paymentMethod === method.id ? 'var(--primary)' : '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: paymentMethod === method.id ? 'white' : '#64748b' }}>
                             {method.icon}
                           </div>
                           <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{method.name}</div>
                             <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{method.sub}</div>
                           </div>
                           {paymentMethod === method.id && <CheckCircle size={20} color="var(--primary)" />}
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={finalizePayment}
                      style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '16px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Pay Now
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                      <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Secure 256-bit SSL Encrypted Payment
                    </div>
                  </motion.div>
                )}

                {paymentStep === 'processing' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '60px', height: '60px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 2rem auto' }}
                    />
                    <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Processing Payment</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Verifying transaction with your bank...</p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}
                    >
                      <CheckCircle size={40} />
                    </motion.div>
                    <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Payment Successful</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Transaction ID: #UNI-{Math.floor(Math.random()*1000000)}</p>
                    <p style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '1rem' }}>Redirecting to order tracking...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instant Recharge Modal */}
      <AnimatePresence>
        {isRechargeModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '28px', color: '#1e293b', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#0f172a' }}>Topup Smart Wallet</h3>
                <button onClick={() => setIsRechargeModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>Enter Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>₹</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                {[100, 200, 500].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setRechargeAmount(amt.toString())}
                    style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: rechargeAmount === amt.toString() ? '#f5f3ff' : 'white', borderColor: rechargeAmount === amt.toString() ? 'var(--primary)' : '#e2e8f0', color: rechargeAmount === amt.toString() ? 'var(--primary)' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handleRecharge(rechargeAmount)}
                disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                style={{ width: '100%', padding: '1.1rem', borderRadius: '18px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', opacity: (!rechargeAmount || parseFloat(rechargeAmount) <= 0) ? 0.5 : 1 }}
              >
                Confirm Recharge
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: '#94a3b8' }}>
                   <ShieldCheck size={14} /> PCI Compliant
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: '#94a3b8' }}>
                   <CheckCircle size={14} /> Instant Credit
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ width: '100%', maxWidth: '450px', background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', borderRadius: '32px', color: 'white', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Sparkles size={40} color="#f59e0b" />
              </div>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>How was your meal?</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '2rem' }}>Your feedback helps us improve the campus dining experience.</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: star <= rating ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}
                  >
                    <Sparkles size={32} fill={star <= rating ? '#f59e0b' : 'transparent'} />
                  </motion.button>
                ))}
              </div>

              <textarea 
                placeholder="Any specific suggestions? (Taste, Delivery speed, Packing...)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', minHeight: '100px', marginBottom: '2rem', outline: 'none', resize: 'none' }}
              />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setIsFeedbackModalOpen(false)}
                  style={{ flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Skip
                </button>
                <button 
                  onClick={submitFeedback}
                  disabled={rating === 0}
                  style={{ flex: 2, padding: '1rem', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: rating === 0 ? 0.5 : 1 }}
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};

export default SmartCanteen;
