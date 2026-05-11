'use client'

import { useState, useEffect } from 'react'
import { Bell, Clock, Activity, Cpu, ArrowUpRight, Target, Layout, Brain, TrendingUp, Lock, CheckCircle2, ChevronRight } from 'lucide-react'
import { ChatCard } from './cards/chat-card'

// Import all views
import { TradingView } from './views/trading-view'
import { ProjectsView } from './views/projects-view'
import { NewsView } from './views/news-view'
import { CalendarView } from './views/calendar-view'
import { FinanceView } from './views/finance-view'
import { PerformanceView } from './views/performance-view'
import { VoiceView } from './views/voice-view'
import { NeuralView } from './views/neural-view'

interface MainDashboardProps {
  activeNav: string
}

export function MainDashboard({ activeNav }: MainDashboardProps) {
  // Global State
  const [lifeScore, setLifeScore] = useState(88)
  const [tasksDone, setTasksDone] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [netWorth, setNetWorth] = useState(0)
  const [deepWorkHours, setDeepWorkHours] = useState(0)
  const [sleepHours, setSleepHours] = useState(0)

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  useEffect(() => {
    if (activeNav !== 'CORE') return;
    
    const fetchCoreData = async () => {
      try {
        const [perfRes, finRes, projRes] = await Promise.all([
          fetch(`${API_BASE}/api/performance`),
          fetch(`${API_BASE}/api/finance`),
          fetch(`${API_BASE}/api/projects`)
        ]);

        if (perfRes.ok) {
          const perf = await perfRes.json();
          const todayStr = new Date().toISOString().split('T')[0]
          const todayLogs = (perf.logs || []).filter((l: any) => l.date === todayStr)
          
          const work = todayLogs.filter((l: any) => !['Sleep', 'Chilling'].includes(l.category)).reduce((s: number, l: any) => s + l.hours, 0)
          const deep = todayLogs.filter((l: any) => l.category === 'Deep Work').reduce((s: number, l: any) => s + l.hours, 0)
          const sleep = todayLogs.filter((l: any) => l.category === 'Sleep').reduce((s: number, l: any) => s + l.hours, 0)
          const prod = todayLogs.filter((l: any) => ['Deep Work', 'Learning'].includes(l.category)).reduce((s: number, l: any) => s + l.hours, 0)
          
          setDeepWorkHours(deep)
          setSleepHours(sleep)

          let rawScore = work > 0 ? Math.round((prod / work) * 100) : 75;
          if (work > 0 && rawScore < 70) rawScore = 70 + Math.floor(Math.random() * 5); 
          setLifeScore(rawScore);
        }

        if (finRes.ok) {
          const fin = await finRes.json();
          const inc = (fin.income || []).reduce((a: number, b: any) => a + b.amount, 0);
          const exp = (fin.expenses || []).reduce((a: number, b: any) => a + b.amount, 0);
          setNetWorth(inc - exp);
        }

        if (projRes.ok) {
          const proj = await projRes.json();
          const tasks = proj.tasks || [];
          setTotalTasks(tasks.length);
          setTasksDone(tasks.filter((t: any) => t.status === 'Completed').length);
        }
      } catch (e) {
        console.error("Failed to load core dashboard data");
      }
    }
    fetchCoreData();
  }, [activeNav]);

  // Mini Bar Chart Component for Vitals/Execution
  const MiniBarChart = ({ color, data }: { color: string, data: number[] }) => (
    <div className="flex items-end gap-1 h-12 w-full mt-2">
      {data.map((val, i) => (
        <div key={i} className="flex-1 bg-slate-950 rounded-t-sm flex items-end overflow-hidden border border-slate-800">
          <div className="w-full transition-all" style={{ height: `${val}%`, backgroundColor: color }} />
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeNav) {
      case 'CORE': 
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 animate-in fade-in duration-500">
            
            {/* COLUMN 1: CORE, VITALS, EXECUTION */}
            <div className="space-y-6">
              
              {/* CORE Dashboard Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core dashboard</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Focus hours</div>
                    <div className="text-xl font-bold text-cyan-400">{deepWorkHours}h <span className="text-[10px] text-slate-500 font-normal">Today</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Daily streak</div>
                    <div className="text-xl font-bold text-white">12 Days</div>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Key insights</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Finish-and-forget in focus hours</li>
                    <li>• Protect deep work blocks</li>
                  </ul>
                </div>
              </div>

              {/* VITALS Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-400" /> VITALS (Performance)
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Sleep</div>
                    <div className="text-lg font-bold text-purple-400">{sleepHours}h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Quality</div>
                    <div className="text-lg font-bold text-white">92%</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase flex justify-between">
                    <span>Weekly Summary</span>
                  </div>
                  {/* Mock data for the weekly flow bars */}
                  <MiniBarChart color="#34d399" data={[40, 60, 30, 80, 50, 90, 70]} />
                  <div className="flex justify-between text-[8px] text-slate-500 uppercase mt-1">
                    <span>Sun</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                </div>
              </div>

              {/* EXECUTION Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layout size={14} className="text-blue-400" /> EXECUTION (Tasks)
                </h3>
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
                   <div className="space-y-1">
                     <div className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 size={10} className="text-cyan-400"/> Active Projects</div>
                     <div className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-400"/> Milestone Tracker</div>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-bold text-cyan-400">{tasksDone}/{totalTasks}</div>
                   </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase flex justify-between">
                    <span>Daily tasks done</span>
                    <span>100</span>
                  </div>
                  {/* Mock data for execution flow bars */}
                  <MiniBarChart color="#06b6d4" data={[20, 50, 80, 40, 60, 100, 30]} />
                   <div className="flex justify-between text-[8px] text-slate-500 uppercase mt-1">
                    <span>Sun</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* COLUMN 2: PREMIUM LIFE SCORE COMPONENT */}
            <div className="flex flex-col items-center justify-start pt-8 relative">
              <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl -z-10" />
              
              <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                  {/* Background tracks */}
                  <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle cx="60" cy="60" r="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle cx="60" cy="60" r="24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />

                  {/* Active Data Tracks (Simulated attributes based on lifeScore) */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 48 * (lifeScore/100)} ${2 * Math.PI * 48}`} strokeLinecap="round" className="opacity-80" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 40 * ((lifeScore-5)/100)} ${2 * Math.PI * 40}`} strokeLinecap="round" className="opacity-80" />
                  <circle cx="60" cy="60" r="32" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 32 * ((lifeScore+5)/100)} ${2 * Math.PI * 32}`} strokeLinecap="round" className="opacity-80" />
                  <circle cx="60" cy="60" r="24" fill="none" stroke="#ec4899" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 24 * ((lifeScore-10)/100)} ${2 * Math.PI * 24}`} strokeLinecap="round" className="opacity-80" />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Ankith Life Score:</span>
                  <span className="text-5xl font-black text-white" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)'}}>{lifeScore}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">/100</span>
                </div>
              </div>

              {/* Legend for the rings */}
              <div className="grid grid-cols-4 gap-2 w-full mt-8 px-4">
                 {[
                   {l: 'FOCUS', c: 'text-cyan-400'}, 
                   {l: 'EXECUTION', c: 'text-blue-400'}, 
                   {l: 'ENERGY', c: 'text-purple-400'}, 
                   {l: 'MOOD', c: 'text-pink-400'}
                 ].map((item, i) => (
                   <div key={i} className="text-[8px] font-bold text-center tracking-widest uppercase">
                     <div className={`w-2 h-2 rounded-full mx-auto mb-1 bg-current ${item.c}`} />
                     {item.l}
                   </div>
                 ))}
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Brain size={12} className="text-cyan-400" /> Dual Brain: Gemini 1.5 Pro | Groq LLaMA 8B
              </div>
            </div>
            
            {/* COLUMN 3: CAPITAL & CHAT */}
            <div className="space-y-6 flex flex-col">
              
              {/* CAPITAL Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock size={14} className="text-amber-400"/> CAPITAL (Finance)</h3>
                 <div className="mb-4">
                   <div className="text-[10px] text-slate-500 uppercase">Portfolio value</div>
                   <div className="text-3xl font-black text-white">₹{netWorth.toLocaleString()}</div>
                   <div className="text-xs text-emerald-400 font-bold">Active Capital</div>
                 </div>
                 
                 {/* Mini Crypto Tickers */}
                 <div className="grid grid-cols-2 gap-3 mb-2">
                   <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                     <div className="text-[9px] text-slate-500 uppercase mb-1">Crypto trend</div>
                     <div className="text-sm font-bold text-white mb-1">BTC</div>
                     <div className="text-xs text-emerald-400 font-bold">+2.4%</div>
                   </div>
                   <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                     <div className="text-[9px] text-slate-500 uppercase mb-1">Crypto trend</div>
                     <div className="text-sm font-bold text-white mb-1">KASPA</div>
                     <div className="text-xs text-emerald-400 font-bold">+5.0%</div>
                   </div>
                 </div>
              </div>

              {/* Seamless Chat Integration */}
              <div className="flex-1 min-h-[300px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                   <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2"><Brain size={14} className="text-cyan-400"/> Neural Chat (MIKE OS assistant)</h3>
                   <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Live</span>
                </div>
                {/* The ChatCard handles its own internal overflow */}
                <div className="flex-1 bg-slate-950 relative">
                   <ChatCard />
                </div>
              </div>

            </div>
          </div>
        )
      
      case 'NEURAL': return <NeuralView />  
      case 'TRADING': return <TradingView />
      case 'EXECUTION': return <ProjectsView />
      case 'NEWS': return <NewsView />
      case 'CALENDAR': return <CalendarView />
      case 'CAPITAL': return <FinanceView />
      case 'VITALS': return <PerformanceView />
      case 'VOICE': return <VoiceView />

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 border border-slate-800/50 border-dashed rounded-2xl bg-slate-900/20 animate-in fade-in duration-300">
            <Cpu size={48} className="mb-4 opacity-20" />
            <h2 className="text-xl font-mono tracking-widest text-slate-400">{activeNav} MODULE</h2>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-950 z-10 pb-4 pt-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            MIKE <span className="text-cyan-400">{activeNav === 'NEURAL' ? 'NEURAL HUB' : activeNav}</span> <span className="ml-1 text-base">🧠</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest hidden md:block">ANKITH RV | NITK | HUDRA TECH | GRAD 2027</div>
          <div className="text-[10px] font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
             10:38 AM <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Activity size={12} className="text-cyan-500 animate-pulse" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DUAL BRAIN: Gemini 1.5 Pro | Groq LLaMA 8B ⚡</p>
      </div>

      {/* Dynamic Content Area */}
      {renderContent()}
    </div>
  )
}