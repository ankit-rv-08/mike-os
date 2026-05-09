'use client';
import React, { useState, useEffect } from 'react';
import { Command } from 'lucide-react';

export default function CommandBar() {
  const [open, setState] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setState((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-500/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center p-4 border-b border-white/10">
          <Command className="text-blue-400 mr-3" size={20} />
          <input 
            autoFocus
            placeholder="Execute system command..."
            className="bg-transparent border-none outline-none text-white w-full text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="p-2 text-xs text-gray-500 bg-black/20 flex justify-between">
          <span>Commands: "analyze stock", "check dsa", "update memory"</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}