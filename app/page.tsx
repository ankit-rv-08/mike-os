'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Orb from './components/Orb';
import CommandBar from './components/CommandBar';
import { 
  Zap, Brain, Shield, Target, Activity, 
  TrendingUp, Terminal, Cpu, Network, 
  ChevronRight, BarChart3, Radio
} from 'lucide-react';

export default function Dashboard() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Simulation of JARVIS system logs
  useEffect(() => {
    const logs = [
      "> INITIALIZING NEURAL_LINK...",
      "> BYPASSING NITK_PROXY...",
      "> SYNCING HUDRA_MAINNET...",
      "> OPTIMIZING DSA_ROUTINES...",
      "> TARGET: 15_LPA_STARK_TOWER",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTerminalLines(prev => [...prev.slice(-4), logs[i]]);
      i = (i + 1) % logs.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-cyan-50 font-mono">
      <CommandBar />

      {/* --- TOP SYSTEM DATA STREAM --- */}
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/10 pb-4">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] text-cyan-500/40 uppercase font-black">Link_Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">SECURE</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-cyan-500/40 uppercase font-black">Active_Cores</span>
            <span className="text-xs">GROQ_8B // GEMINI_FLASH</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[8px] text-cyan-500/40 uppercase font-black">Location</span>
          <span className="text-xs">NITK_SURATHKAL // BALLARI_HUB</span>
        </div>
      </div>

      {/* --- CENTRAL VISUALIZER --- */}
      <section className="relative w-full h-[400px] flex items-center justify-center mb-12">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--neon-blue)_0%,_transparent_70%)]" />
        <Orb />
        
        {/* Holographic Text Overlays */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 space-y-4 hidden lg:block"
        >
          <div className="flex items-center gap-2 text-cyan-400/50">
            <Radio size={14} className="animate-pulse" />
            <span className="text-[10px] tracking-tighter uppercase">Bio_Sync Active</span>
          </div>
          <div className="h-20 w-[1px] bg-gradient-to-b from-cyan-500/50 to-transparent ml-1.5" />
        </motion.div>

        <div className="absolute bottom-0 text-center z-10">
          <motion.h2 
            animate={{ letterSpacing: ['0.2em', '0.5em', '0.2em'] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-3xl font-black uppercase italic tracking-[0.3em] text-glow"
          >
            Ankith
          </motion.h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-cyan-500/20 text-[8px] border border-cyan-500/40 rounded text-cyan-300 uppercase">Tier: Tech Lead</span>
            <span className="px-2 py-0.5 bg-purple-500/20 text-[8px] border border-purple-500/40 rounded text-purple-300 uppercase">Hudra Partner</span>
          </div>
        </div>
      </section>

      {/* --- HUD STATS GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Life_Score" value="88.4" sub="Peak" icon={Activity} color="#00f3ff" />
        <StatCard label="Focus_Time" value="4.5h" sub="Today" icon={Network} color="#a855f7" />
        <StatCard label="DSA_Leet" value="12" sub="Streak" icon={Zap} color="#eab308" />
        <StatCard label="Port_Value" value="$1.4k" sub="+5.2%" icon={TrendingUp} color="#22c55e" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT: MISSION CONTROL --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="hud-panel p-6 border-t-2 border-t-cyan-500/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
               <Target size={40} className="text-cyan-500" />
            </div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-cyan-400">
              <ChevronRight size={14} /> Critical_Mission: 15_LPA_Bangalore
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-lg hover:border-cyan-500/30 transition-colors">
                <div className="p-2 bg-cyan-500/20 rounded text-cyan-400"><Cpu size={16}/></div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-bold">Resume Protocol</p>
                    <p className="text-[10px] text-cyan-500/50 italic">Processing...</p>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '65%' }} 
                      className="h-full bg-cyan-500" 
                    />
                  </div>
                  <p className="text-[10px] mt-2 text-white/40 italic">Integrating HUDRA experience into LinkedIn/Resume...</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-lg hover:border-yellow-500/30 transition-colors">
                <div className="p-2 bg-yellow-500/20 rounded text-yellow-400"><Terminal size={16}/></div>
                <div className="flex-1">
                   <p className="text-xs font-bold mb-1">Daily DSA Sprint</p>
                   <p className="text-sm font-mono text-white/80">"Solve 2 Sliding Window problems on LeetCode"</p>
                   <div className="flex gap-2 mt-2">
                     <span className="text-[8px] border border-white/10 px-1 text-white/30 uppercase">Array</span>
                     <span className="text-[8px] border border-white/10 px-1 text-white/30 uppercase">Medium</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: SYSTEM LOGS --- */}
        <div className="space-y-6">
          <div className="hud-panel p-6 border-l-2 border-l-purple-500/50 flex flex-col h-full">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-4 text-purple-400">
              <BarChart3 size={14} /> Core_Intelligence
            </h3>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {terminalLines.map((line, idx) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={idx} 
                    className="text-[10px] font-mono text-purple-300/70"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] text-white/20 mb-2 uppercase font-bold tracking-widest">Active_Advice</p>
                <p className="text-xs text-cyan-200 leading-relaxed italic">
                  "Ankith, current market volatility in KASPA suggest holding. Focus session scheduled for 9 PM."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: color }}
      className="hud-panel p-4 flex flex-col gap-3 group transition-all duration-500 border border-white/5"
    >
      <div className="flex justify-between items-start">
        <div style={{ color }} className="opacity-50 group-hover:opacity-100 transition-opacity">
          <Icon size={18} />
        </div>
        <span className="text-[8px] text-white/20 font-black tracking-widest">{sub}</span>
      </div>
      <div>
        <p className="text-[9px] uppercase text-cyan-500/40 font-black mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tighter font-mono group-hover:text-white transition-colors">{value}</p>
      </div>
    </motion.div>
  );
}