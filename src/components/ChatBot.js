import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your smart campus assistant. Ask me about students, courses, attendance, fees, or library books!" }
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
      console.error("Chatbot Error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "I'm sorry, I'm having trouble connecting to the system right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9999 }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{
                width: "350px",
                height: "450px",
                background: "rgba(30, 27, 75, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              <div style={{ padding: "15px", background: "var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", fontWeight: "bold" }}>
                  <Bot size={24} /> Virtual Assistant
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.sender === "bot" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "var(--primary)" : "rgba(255,255,255,0.1)",
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      maxWidth: "80%",
                      fontSize: "0.9rem",
                    }}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", padding: "10px 15px", borderRadius: "15px", color: "var(--text-dim)", fontSize: "0.8rem" }}
                  >
                    Typing...
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: "15px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", outline: "none", background: "rgba(255,255,255,0.1)", color: "white" }}
                />
                <button onClick={handleSend} style={{ background: "var(--primary)", border: "none", borderRadius: "10px", padding: "10px", color: "white", cursor: "pointer" }}>
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                border: "none",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
              }}
            >
              <MessageSquare size={28} />
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
