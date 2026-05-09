'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Search, X } from 'lucide-react';

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle with Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for routing to your backend brain
    console.log("Executing:", input);
    // After execution, close and clear
    setTimeout(() => {
      setLoading(false);
      setIsOpen(false);
      setInput('');
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ scale: 0.9, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden relative z-10"
          >
            <div className="p-4 flex items-center gap-3 border-b border-white/5">
              <Terminal size={18} className="text-cyan-400" />
              <form onSubmit={handleCommand} className="flex-1">
                <input
                  autoFocus
                  placeholder="Enter JARVIS command... (e.g. 'Log 1h DSA', 'Analyze NVDA')"
                  className="w-full bg-transparent border-none outline-none text-cyan-50 font-mono text-sm placeholder:text-white/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full" />
              ) : (
                <span className="text-[10px] text-white/20 font-bold px-2 py-1 border border-white/10 rounded">ESC</span>
              )}
            </div>
            
            {/* Quick Suggestions Feed */}
            <div className="p-2 max-h-[300px] overflow-y-auto">
              <p className="text-[10px] uppercase text-white/30 font-bold p-2">Active Protocols</p>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-all">
                   <Cpu size={14} className="text-purple-400 group-hover:scale-110" />
                   <span className="text-xs font-mono text-white/70">Execute: HUDRA Backend Update</span>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-all">
                   <Search size={14} className="text-yellow-400 group-hover:scale-110" />
                   <span className="text-xs font-mono text-white/70">Search: Bangalore SDE Jobs (15 LPA+)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}