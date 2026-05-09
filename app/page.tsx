'use client';
import { motion } from 'framer-motion';
import Orb from './components/Orb';
import { Zap, Brain, Shield, Terminal, Target, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Life Score', value: '88/100', icon: Activity, color: 'text-cyan-400' },
    { label: 'Active Brain', value: 'Dual: Groq + Gemini', icon: Brain, color: 'text-purple-400' },
    { label: 'DSA Streak', value: '12 Days', icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP SECTION: THE ORB (JARVIS CORE) */}
      <section className="relative h-[40vh] lg:h-[500px] flex flex-col items-center justify-center border-b border-cyan-500/10">
        <Orb />
        <div className="absolute bottom-10 text-center">
          <h2 className="text-2xl font-bold tracking-[0.3em] uppercase text-glow italic">Ankith</h2>
          <p className="text-[10px] text-cyan-500/60 tracking-widest uppercase">System Administrator // NITK_SRK</p>
        </div>
      </section>

      {/* 2. STATS GRID (Mobile Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="hud-panel p-4 flex items-center gap-4 border-l-4 border-l-cyan-500"
          >
            <stat.icon className={`${stat.color} w-6 h-6`} />
            <div>
              <p className="text-[10px] uppercase text-cyan-500/50 font-bold">{stat.label}</p>
              <p className="text-lg font-mono font-bold tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. ACTIVE MISSIONS (CAREER & HUDRA) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Career Module Preview */}
        <div className="hud-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Target size={18} className="text-red-500" /> Mission: 15 LPA Bangalore
            </h3>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Priority: Alpha</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded border border-white/5">
              <p className="text-xs text-white/40">Today's DSA Target</p>
              <p className="text-sm font-mono mt-1 underline underline-offset-4 decoration-cyan-500">Solve "Medium" Level Dynamic Programming Problem</p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/5">
              <p className="text-xs text-white/40">Job Application</p>
              <p className="text-sm font-mono mt-1">Reviewing 3 startups in Indiranagar...</p>
            </div>
          </div>
        </div>

        {/* HUDRA Startup View */}
        <div className="hud-panel p-6 space-y-4 border-l-4 border-l-purple-500">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Shield size={18} className="text-purple-400" /> HUDRA Startup Feed
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3 text-xs font-mono text-white/60">
                <span className="text-purple-500 font-bold">0{j}:</span> 
                Backend API endpoint deployed... [SUCCESS]
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}