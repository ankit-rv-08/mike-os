'use client';
import { Search } from 'lucide-react';

export default function CommandBar() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 relative group z-20">
      {/* Background neon blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Input container */}
      <div className="relative flex items-center bg-black/60 border border-white/10 backdrop-blur-md rounded-2xl p-2 px-4 shadow-2xl transition-all duration-300 group-hover:border-white/20">
        <Search className="text-cyan-500 mr-3" size={20} />
        
        <input 
          type="text" 
          placeholder="Initiate command sequence..." 
          className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm placeholder:text-zinc-600"
        />
        
        {/* Keyboard shortcut UI */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono ml-4 shrink-0">
          <span className="bg-white/10 px-2 py-1 rounded border border-white/5 shadow-inner">⌘</span>
          <span className="bg-white/10 px-2 py-1 rounded border border-white/5 shadow-inner">K</span>
        </div>
      </div>
    </div>
  );
}