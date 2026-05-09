'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Orb from '@/components/Orb';
import CommandBar from '@/components/CommandBar';
import { 
  Zap, Brain, Target, Activity, 
  TrendingUp, Terminal, Cpu, Network, 
  ChevronRight, BarChart3, Radio, Sliders
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
    <div className="relative min-h-screen bg-[#030303] text-cyan-50 font-mono overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(0,243,255,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
        <CommandBar />

        {/* --- TOP SYSTEM DATA STREAM --- */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] text-cyan-500/60 uppercase font-black tracking-widest mb-1">Link_Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-xs font-semibold text-white/90">SECURE</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-purple-400/60 uppercase font-black tracking-widest mb-1">Active_Cores</span>
              <span className="text-xs font-semibold text-white/90">GROQ_8B // GEMINI_FLASH</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1 block">Location</span>
              <span className="text-xs font-semibold text-white/80">NITK_SURATHKAL // BALLARI_HUB</span>
            </div>
            {/* Theme / Settings Placeholder */}
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-cyan-400">
              <Sliders size={16} />
            </button>
          </div>
        </div>

        {/* --- CENTRAL VISUALIZER --- */}
        <section className="relative w-full h-[300px] flex items-center justify-center mb-8 border border-white/5 bg-white/[0.01] rounded-3xl overflow-hidden backdrop-blur-sm">
          <Orb />
          
          {/* Holographic Text Overlays */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4 hidden lg:block"
          >
            <div className="flex items-center gap-2 text-cyan-400/70">
              <Radio size={14} className="animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Bio_Sync Active</span>
            </div>
            <div className="h-24 w-[1px] bg-gradient-to-b from-cyan-500/50 to-transparent ml-1.5" />
          </motion.div>

          <div className="absolute bottom-6 text-center z-10">
            <motion.h2 
              animate={{ letterSpacing: ['0.2em', '0.4em', '0.2em'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl font-black uppercase italic tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50"
            >
              Ankith
            </motion.h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-[9px] text-cyan-300 uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(6,182,212,0.1)]">Tier: Tech Lead</span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-md text-[9px] text-purple-300 uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(168,85,247,0.1)]">Hudra Partner</span>
            </div>
          </div>
        </section>

        {/* --- HUD STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Life_Score" value="88.4" sub="Peak" icon={Activity} color="#06b6d4" />
          <StatCard label="Focus_Time" value="4.5h" sub="Today" icon={Network} color="#a855f7" />
          <StatCard label="DSA_Leet" value="12" sub="Streak" icon={Zap} color="#eab308" />
          <StatCard label="Port_Value" value="$1.4k" sub="+5.2%" icon={TrendingUp} color="#10b981" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- LEFT: MISSION CONTROL --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-500">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
              
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                 <Target size={32} className="text-cyan-500" />
              </div>

              <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-cyan-400">
                <ChevronRight size={14} /> Critical_Mission: 15_LPA_Bangalore
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300">
                  <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20"><Cpu size={18}/></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-bold text-white/90 tracking-wide">Resume Protocol</p>
                      <p className="text-[10px] text-cyan-400/70 uppercase font-semibold">Processing</p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '65%' }} 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">Integrating HUDRA experience into LinkedIn/Resume...</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-black/40 border border-white/5 rounded-xl hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all duration-300">
                  <div className="p-2.5 bg-yellow-500/10 rounded-lg text-yellow-400 border border-yellow-500/20"><Terminal size={18}/></div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-white/90 tracking-wide mb-1">Daily DSA Sprint</p>
                     <p className="text-xs font-mono text-zinc-400 mb-3">"Solve 2 Sliding Window problems on LeetCode"</p>
                     <div className="flex gap-2">
                       <span className="text-[9px] font-semibold border border-white/10 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-wider bg-white/5">Array</span>
                       <span className="text-[9px] font-semibold border border-yellow-500/20 px-2 py-0.5 rounded text-yellow-500/70 uppercase tracking-wider bg-yellow-500/5">Medium</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: SYSTEM LOGS --- */}
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />

              <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-purple-400 relative z-10">
                <BarChart3 size={14} /> Core_Intelligence
              </h3>
              
              <div className="flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5 flex-1 mb-6">
                  {terminalLines.map((line, idx) => (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      key={idx} 
                      className="text-[11px] font-mono text-purple-300/80"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[9px] text-zinc-500 mb-2 uppercase font-black tracking-widest">Active_Advice</p>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "Ankith, current market volatility suggests holding. Focus session scheduled for 9 PM."
                  </p>
                </div>
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
      whileHover={{ y: -4 }}
      className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4 group transition-all duration-300 hover:bg-white/[0.04]"
      style={{ borderBottomColor: `${color}40`, borderBottomWidth: '2px' }}
    >
      <div className="flex justify-between items-start">
        <div style={{ color }} className="opacity-70 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-black/40 border border-white/5">
          <Icon size={18} />
        </div>
        <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase">{sub}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tighter font-mono text-white/90 drop-shadow-md">{value}</p>
      </div>
    </motion.div>
  );
}