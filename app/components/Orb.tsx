'use client';
import { motion } from 'framer-motion';

export default function Orb() {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer ambient glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[50px]"
      />
      
      {/* Inner glowing core */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_50px_rgba(6,182,212,0.6)] border border-cyan-300/30 overflow-hidden"
      >
        {/* Glass reflection effect inside the orb */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-50" />
      </motion.div>
    </div>
  );
}