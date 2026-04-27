import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Zap, Cpu, Shield, Activity, Terminal } from "lucide-react";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Oracle System Online. Ready for campus-wide intelligence queries. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const baseUrl = "http://localhost:8080";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${baseUrl}/chatbot/query`, { query: currentInput });
      const reply = res.data.response;
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Oracle Error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Signal interference detected. System links are unstable. Retrying in bypass mode..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Who is at risk?",
    "Fee status for John",
    "Active SOS alerts",
    "Campus average attendance"
  ];

  return (
    <>
      <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 10000 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
              style={{
                width: "420px",
                height: "650px",
                background: "rgba(10, 10, 30, 0.85)",
                backdropFilter: "blur(30px) saturate(180%)",
                borderRadius: "32px",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 0 20px rgba(99, 102, 241, 0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                marginBottom: "20px",
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {/* Header */}
              <div style={{ padding: "24px", background: "linear-gradient(to right, rgba(99, 102, 241, 0.2), transparent)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "14px", background: "rgba(99, 102, 241, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgba(99, 102, 241, 0.4)" }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu size={24} color="#818cf8" />
                    </motion.div>
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: "900", fontSize: "1.1rem", letterSpacing: "0.5px" }}>COMMAND ORACLE</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                      <span style={{ fontSize: "0.65rem", color: "#10b981", fontWeight: "bold", textTransform: "uppercase" }}>Neural Link Active</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", color: "white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Status Bar */}
              <div style={{ padding: "8px 24px", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Shield size={10} /> ENCRYPTED
                </div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
                   v4.0.2-OMEGA
                </div>
              </div>

              {/* Messages Container */}
              <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", scrollbarWidth: "none" }}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)",
                      color: "white",
                      padding: "12px 20px",
                      borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      maxWidth: "85%",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      border: msg.sender === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: msg.sender === "user" ? "0 10px 20px rgba(99, 102, 241, 0.2)" : "none"
                    }}
                  >
                    {msg.sender === "bot" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: "bold" }}>
                        <Terminal size={12} /> SYSTEM OUTPUT
                      </div>
                    )}
                    {msg.text}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.03)", padding: "12px 20px", borderRadius: "15px", display: "flex", gap: "4px" }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.1 }}
                        style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#818cf8" }}
                      />
                    ))}
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              <div style={{ padding: "0 24px", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", marginBottom: "12px" }}>
                 {suggestions.map(s => (
                   <button 
                     key={s}
                     onClick={() => { setInput(s); }}
                     style={{ padding: "6px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", whiteSpace: "nowrap", cursor: "pointer" }}
                   >
                     {s}
                   </button>
                 ))}
              </div>

              {/* Input Area */}
              <div style={{ padding: "24px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Enter command or query..."
                    style={{ width: "100%", padding: "14px 18px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", outline: "none", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.9rem" }}
                  />
                  <div style={{ position: "absolute", right: "12px", top: "14px", color: "rgba(255,255,255,0.2)" }}>
                    <Zap size={18} />
                  </div>
                </div>
                <button 
                  onClick={handleSend} 
                  style={{ width: "48px", height: "48px", background: "var(--primary)", border: "none", borderRadius: "14px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: "pointer", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: "24px",
                height: "64px",
                padding: "0 28px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={24} />
              </motion.div>
              <span style={{ fontWeight: "900", letterSpacing: "1px", fontSize: "0.9rem" }}>ORACLE AI</span>
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
