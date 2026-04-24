import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

const DocumentVault = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([
    { name: "Syllabus_2026.pdf", size: "1.2 MB", timestamp: "2 hours ago" },
    { name: "Physics_Assignment_1.docx", size: "450 KB", timestamp: "5 hours ago" },
  ]);

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFile = e.dataTransfer.files[0];
      setFiles([{ name: newFile.name, size: `${(newFile.size / 1024).toFixed(1)} KB`, timestamp: "Just now" }, ...files]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%', flexDirection: 'column' }}>
      <motion.div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragActive ? "var(--primary)" : "rgba(255,255,255,0.2)",
          backgroundColor: isDragActive ? "rgba(99, 102, 241, 0.1)" : "rgba(255,255,255,0.02)"
        }}
        style={{
          border: '2px dashed',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <UploadCloud size={48} color={isDragActive ? "var(--primary)" : "var(--text-muted)"} style={{ marginBottom: '1rem' }} />
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Drag & Drop files here</h4>
        <p style={{ color: 'var(--text-dim)', margin: 0 }}>or click to browse from your computer</p>
      </motion.div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
        <h4 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Recent Documents</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {files.map((file, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -10 }} 
               animate={{ opacity: 1, x: 0 }}
               style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px' }}
             >
               <File size={24} color="var(--primary)" />
               <div style={{ flex: 1 }}>
                 <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{file.size} • {file.timestamp}</div>
               </div>
               <CheckCircle size={20} color="var(--success)" />
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;
