'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Activity, Cpu, ArrowUpRight, Target, Layout, Brain, TrendingUp, Lock, CheckCircle2, Terminal, Bell, MessageSquare, HelpCircle, Settings, Github, Linkedin, Instagram, Mail } from 'lucide-react'
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

// Import the Theme Hook to fix Prop errors
import { useTheme } from './theme-provider'
import type { ThemeMode } from './theme-provider'

// Import Career Context
import { useCareer } from '@/lib/career-context'

interface MainDashboardProps {
  activeNav: string
}

export function MainDashboard({ activeNav }: MainDashboardProps) {
  // Directly grab Theme Context instead of passing props
  const { mode, setMode } = useTheme()
  
  // Grab Career Context for Career Health widget
  const { careerFocusTime, toggleCareerCommand } = useCareer()
  
  const [mounted, setMounted] = useState(false)
  const [lifeScore, setLifeScore] = useState(88)
  const [tasksDone, setTasksDone] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [netWorth, setNetWorth] = useState(0)
  const [income, setIncome] = useState(0)
  const [deepWorkHours, setDeepWorkHours] = useState(0)
  const [sleepHours, setSleepHours] = useState(0)
  const [time, setTime] = useState(new Date())

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false)
  const [alerts, setAlerts] = useState<{id: string, title: string, type: 'urgent'|'info'}[]>([])

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  // --- THEME ENGINE ---
  const getThemeVars = () => {
    switch(mode) {
      case 'Focus': return { bg: 'bg-[var(--bg-secondary)]', border: 'border-[var(--border-color)]', accentText: 'text-[var(--accent-color)]', accentHex: '#3b82f6' } // Deep Blue
      case 'Deadline': return { bg: 'bg-[var(--bg-secondary)]', border: 'border-[var(--border-color)]', accentText: 'text-[var(--accent-color)]', accentHex: '#f97316' } // Orange
      case 'Hacker': return { bg: 'bg-[var(--bg-secondary)]', border: 'border-[var(--border-color)]', accentText: 'text-[var(--accent-color)]', accentHex: '#22c55e' } // Green
      default: return { bg: 'bg-[var(--bg-secondary)]', border: 'border-[var(--border-color)]', accentText: 'text-[var(--accent-color)]', accentHex: '#f59e0b' } // Normal (Amber)
    }
  }
  const theme = getThemeVars()

  // Safe JSON Fetcher
  const fetchSafe = async (endpoint: string) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`)
      if (res.headers.get("content-type")?.includes("application/json")) {
        return await res.json()
      }
    } catch (e) {}
    return null;
  }

  // Clocks & Mounts
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Data Fetching
  useEffect(() => {
    if (activeNav !== 'CORE') return;
    
    const fetchCoreData = async () => {
      const [perf, fin, proj, cal] = await Promise.all([
        fetchSafe('/api/performance'), 
        fetchSafe('/api/finance'), 
        fetchSafe('/api/projects'),
        fetchSafe('/api/calendar')
      ]);

      let newAlerts: {id: string, title: string, type: 'urgent'|'info'}[] = [];

      // Vitals
      if (perf && perf.logs) {
        const todayStr = new Date().toISOString().split('T')[0]
        const todayLogs = perf.logs.filter((l: any) => l.date === todayStr)
        const work = todayLogs.filter((l: any) => !['Sleep', 'Chilling'].includes(l.category)).reduce((s: number, l: any) => s + l.hours, 0)
        const deep = todayLogs.filter((l: any) => l.category === 'Deep Work').reduce((s: number, l: any) => s + l.hours, 0)
        const prod = todayLogs.filter((l: any) => ['Deep Work', 'Learning'].includes(l.category)).reduce((s: number, l: any) => s + l.hours, 0)
        
        setDeepWorkHours(deep)
        const sleepH = perf.vitals?.sleep || 7.2;
        setSleepHours(sleepH) 

        let rawScore = work > 0 ? Math.round((prod / work) * 100) : 75;
        if (work > 0 && rawScore < 70) rawScore = 70 + Math.floor(Math.random() * 5); 
        setLifeScore(rawScore);

        if (sleepH < 6) newAlerts.push({ id: 'sleep', title: 'Low recovery detected. Prioritize rest.', type: 'urgent' });
      }

      // Finance
      if (fin && fin.income) {
        const inc = fin.income.reduce((a: number, b: any) => a + b.amount, 0);
        const exp = fin.expenses.reduce((a: number, b: any) => a + b.amount, 0);
        setNetWorth(inc - exp); setIncome(inc);
      }

      // Projects
      if (proj && proj.tasks) {
        setTotalTasks(proj.tasks.length);
        setTasksDone(proj.tasks.filter((t: any) => t.status === 'Completed').length);
        
        const highPriority = proj.tasks.filter((t: any) => t.priority === 'High' && t.status !== 'Completed');
        if (highPriority.length > 0) {
          newAlerts.push({ id: 'proj', title: `${highPriority.length} High Priority tasks pending.`, type: 'urgent' });
        }
      }

      // Calendar
      if (cal) {
        const todayNum = new Date().getDate();
        const todayEvents = cal[todayNum] ? cal[todayNum].meetings?.filter((m:any) => m.status === 'pending') : [];
        if (todayEvents && todayEvents.length > 0) {
          newAlerts.push({ id: 'cal', title: `You have ${todayEvents.length} meetings today.`, type: 'info' });
        }
      }

      setAlerts(newAlerts);
    }
    fetchCoreData();
  }, [activeNav, mode]);

  const MiniBarChart = ({ data }: { data: number[] }) => (
    <div className="flex items-end gap-1 h-12 w-full mt-2">
      {data.map((val, i) => (
        <div key={i} className={`flex-1 ${theme.bg} rounded-t-sm flex items-end overflow-hidden border ${theme.border}`}>
          <div className="w-full transition-all duration-700" style={{ height: `${val}%`, backgroundColor: theme.accentHex }} />
        </div>
      ))}
    </div>
  )

  const handleActionClick = (action: string) => {
    alert(`[SYSTEM] Accessing ${action} Protocol. UI Module opening soon.`);
  }

  const renderContent = () => {
    switch (activeNav) {
      case 'CORE': 
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 animate-in fade-in duration-700">
            {/* COLUMN 1 */}
            <div className="space-y-6">
              <div className={`${theme.bg} border ${theme.border} p-5 rounded-2xl shadow-xl transition-colors duration-500`}>
                <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4">Core dashboard</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] opacity-60 uppercase">Focus hours</div>
                    <div className={`text-xl font-bold ${theme.accentText} transition-colors`}>{deepWorkHours}h <span className="text-[10px] opacity-60 font-normal">Today</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60 uppercase">Daily streak</div>
                    <div className="text-xl font-bold text-inherit">12 Days</div>
                  </div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="text-[10px] font-bold opacity-60 uppercase mb-2">Key insights</div>
                  <ul className="text-xs opacity-80 space-y-1">
                    <li>• Finish-and-forget in focus hours</li>
                    <li>• Protect deep work blocks</li>
                  </ul>
                </div>
              </div>

              <div className={`${theme.bg} border ${theme.border} p-5 rounded-2xl shadow-xl transition-colors duration-500`}>
                <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className={theme.accentText} /> VITALS (Performance)
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] opacity-60 uppercase">Sleep</div>
                    <div className="text-lg font-bold text-inherit">{sleepHours}h</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60 uppercase">Quality</div>
                    <div className="text-lg font-bold text-inherit">92%</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] opacity-60 uppercase flex justify-between">
                    <span>Weekly Summary</span>
                  </div>
                  <MiniBarChart data={[40, 60, 30, 80, 50, 90, 70]} />
                  <div className="flex justify-between text-[8px] opacity-60 uppercase mt-1">
                    <span>Sun</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                </div>
              </div>

              {/* Career Health Widget */}
              <div 
                onClick={toggleCareerCommand}
                className={`${theme.bg} border border-indigo-500/30 p-5 rounded-2xl shadow-xl transition-all duration-500 cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:border-indigo-500/50`}
              >
                <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Target size={14} className="text-indigo-500" /> CAREER HEALTH
                </h3>
                <div className="flex items-center justify-between bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 mb-4">
                   <div className="space-y-1">
                     <div className="text-[10px] opacity-80 flex items-center gap-1 text-indigo-400">
                       <Clock size={10} /> Today's Focus
                     </div>
                   </div>
                   <div className="text-2xl font-bold text-indigo-400">
                     {Math.floor(careerFocusTime / 60)}h {careerFocusTime % 60}m
                   </div>
                </div>
                <div>
                  <div className="text-[10px] opacity-60 uppercase flex justify-between mb-2">
                    <span>Daily Goal Progress</span>
                    <span className="text-indigo-400">{Math.min(Math.round((careerFocusTime / 300) * 100), 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((careerFocusTime / 300) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-[8px] opacity-60 uppercase mt-2 text-center">
                    Click to open Career Command
                  </div>
                </div>
              </div>

              <div className={`${theme.bg} border ${theme.border} p-5 rounded-2xl shadow-xl transition-colors duration-500`}>
                <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layout size={14} className={theme.accentText} /> EXECUTION (Tasks)
                </h3>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
                   <div className="space-y-1">
                     <div className="text-[10px] opacity-80 flex items-center gap-1"><CheckCircle2 size={10} className={theme.accentText}/> Active Projects</div>
                   </div>
                   <div className={`text-2xl font-bold ${theme.accentText}`}>{tasksDone}/{totalTasks}</div>
                </div>
                <div>
                  <div className="text-[10px] opacity-60 uppercase flex justify-between">
                    <span>Daily tasks done</span>
                    <span>{totalTasks > 0 ? Math.round((tasksDone/totalTasks)*100) : 0}%</span>
                  </div>
                  <MiniBarChart data={[20, 50, 80, 40, 60, 100, 30]} />
                   <div className="flex justify-between text-[8px] opacity-60 uppercase mt-1">
                    <span>Sun</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* COLUMN 2: LIFE SCORE */}
            <div className="flex flex-col items-center justify-start pt-8 relative">
              <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[60px] pointer-events-none -z-10 animate-pulse transition-colors duration-1000" style={{ backgroundColor: `${theme.accentHex}15` }} />
              
              <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite] opacity-40">
                  <circle cx="60" cy="60" r="58" fill="none" stroke={theme.accentHex} strokeWidth="0.5" strokeDasharray="2 4" className="transition-all duration-1000" />
                  <circle cx="60" cy="60" r="58" fill="none" stroke={theme.accentHex} strokeWidth="1.5" strokeDasharray="10 60" className="transition-all duration-1000" />
                </svg>

                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse] opacity-20">
                  <circle cx="60" cy="60" r="42" fill="none" stroke={theme.accentHex} strokeWidth="2" strokeDasharray="15 20" className="transition-all duration-1000" />
                </svg>

                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 relative z-10">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={theme.accentHex} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 50 * (lifeScore / 100)} ${2 * Math.PI * 50}`} strokeLinecap="round" className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 12px ${theme.accentHex})` }} />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                  <span className="text-[10px] opacity-60 font-bold uppercase tracking-[0.2em] mb-1">Life Score</span>
                  <span className="text-7xl font-black text-white">{lifeScore}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 w-full mt-12 px-6">
                 {['FOCUS', 'EXEC', 'ENERGY', 'MOOD'].map((l, i) => (
                   <div key={i} className="text-[9px] font-black text-center tracking-widest uppercase opacity-60">
                     <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2 opacity-80 transition-colors duration-1000" style={{ backgroundColor: theme.accentHex, boxShadow: `0 0 8px ${theme.accentHex}` }} />
                     {l}
                   </div>
                 ))}
              </div>
            </div>
            
            {/* COLUMN 3: CAPITAL & CHAT */}
            <div className="space-y-6 flex flex-col">
              <div className={`${theme.bg} border ${theme.border} p-5 rounded-2xl shadow-xl transition-colors duration-500`}>
                 <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock size={14} className={theme.accentText}/> CAPITAL (Finance)</h3>
                 <div className="mb-4">
                   <div className="text-[10px] opacity-60 uppercase">Portfolio value</div>
                   <div className="text-3xl font-black text-white">₹{netWorth.toLocaleString()}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-3 mb-2">
                   <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                     <div className="text-[9px] opacity-60 uppercase mb-1">Trend</div>
                     <div className={`text-sm font-bold ${theme.accentText}`}>+2.4%</div>
                   </div>
                   <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                     <div className="text-[9px] opacity-60 uppercase mb-1">Income</div>
                     <div className={`text-sm font-bold ${theme.accentText}`}>₹{(income/1000).toFixed(1)}k</div>
                   </div>
                 </div>
              </div>

              <div className={`flex-1 min-h-[300px] flex flex-col ${theme.bg} border ${theme.border} rounded-2xl shadow-xl overflow-hidden transition-colors duration-500`}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
                   <h3 className="text-xs font-bold text-inherit flex items-center gap-2"><Brain size={14} className={theme.accentText}/> Neural Chat</h3>
                   <span className={`text-[9px] uppercase tracking-widest ${theme.accentText} font-bold px-2 py-0.5 rounded flex items-center gap-1 bg-white/5`}>
                     <div className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-1000" style={{ backgroundColor: theme.accentHex }} /> Live
                   </span>
                </div>
                <div className="flex-1 bg-black/20 relative">
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
          <div className="flex flex-col items-center justify-center h-[60vh] opacity-40 border border-dashed border-current rounded-2xl bg-black/10 animate-in fade-in duration-300">
            <Cpu size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-mono tracking-widest">{activeNav} MODULE</h2>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto custom-scrollbar relative">
      {/* HEADER SECTION WITH MODES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sticky top-0 bg-inherit/90 backdrop-blur-md z-20 pb-4 pt-2 border-b border-white/5 transition-colors duration-500">
        
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded border flex items-center justify-center transition-all duration-500" style={{ backgroundColor: `${theme.accentHex}20`, borderColor: theme.accentHex, boxShadow: `0 0 10px ${theme.accentHex}40` }}>
            <Brain size={18} style={{ color: theme.accentHex }} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase leading-none">
              MIKE <span style={{ color: theme.accentHex }}>OS</span>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Dual Brain Active</span>
              <span className="text-[9px] font-bold uppercase tracking-widest hidden md:inline opacity-40">ANKITH RV | TECHNICAL PARTNER</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* THEME MODES TOGGLE */}
          <div className="flex bg-black/20 p-1 rounded-lg border border-white/5 shadow-inner">
            {(['Normal', 'Focus', 'Deadline', 'Hacker'] as ThemeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all duration-300 flex items-center gap-1 ${
                  mode === m 
                  ? `bg-white/10 shadow-lg border border-white/20` 
                  : 'opacity-40 hover:opacity-100 border border-transparent'
                }`}
                style={mode === m ? { color: theme.accentHex } : {}}
              >
                {m === 'Hacker' && <Terminal size={10} />}
                {m}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          {/* Live Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            >
              <Bell size={16} />
              {alerts.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse"></span>}
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-64 ${theme.bg} border ${theme.border} rounded-xl shadow-2xl z-50 p-2 animate-in slide-in-from-top-2`}>
                <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest px-2 pb-2 border-b border-white/10 mb-2">System Alerts</div>
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-xs opacity-60">No pending alerts.</div>
                ) : (
                  alerts.map((a, i) => (
                    <div key={i} className="p-2 hover:bg-black/20 rounded-lg transition-colors flex items-start gap-2 cursor-default border border-transparent hover:border-white/5">
                      <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${a.type === 'urgent' ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-current'}`} style={a.type !== 'urgent' ? { backgroundColor: theme.accentHex } : {}} />
                      <span className="text-xs opacity-90">{a.title}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Settings & Help */}
          <button onClick={() => handleActionClick('Settings')} className="p-2 hover:bg-white/5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hidden md:block"><Settings size={16} /></button>
          <button onClick={() => handleActionClick('Help')} className="p-2 hover:bg-white/5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hidden md:block"><HelpCircle size={16} /></button>
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          {/* Clock */}
          <div className="bg-black/20 border border-white/5 px-4 py-2 rounded-lg flex flex-col items-center shadow-inner min-w-[100px]">
             {mounted ? (
               <>
                 <span className="text-[9px] opacity-60 uppercase font-bold tracking-widest mb-0.5">
                   {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                 </span>
                 <span className="text-xs font-mono font-bold tracking-wider flex items-center gap-2">
                   <Clock size={12} style={{ color: theme.accentHex }} />
                   {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </span>
               </>
             ) : (
               <div className="w-full h-8 animate-pulse bg-white/5 rounded"></div>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-white/5 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in transition-colors duration-500">
        <div className="flex items-center gap-6">
           <a href="https://github.com/ankit-rv-08" target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-opacity">
             <Github size={14} /> GitHub
           </a>
           <a href="https://www.linkedin.com/in/ankith-rv-44892b2a9/" target="_blank" rel="noreferrer" className="opacity-60 hover:text-[#0077b5] flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
             <Linkedin size={14} /> LinkedIn
           </a>
           <a href="https://www.instagram.com/_ank1thh/" target="_blank" rel="noreferrer" className="opacity-60 hover:text-[#e1306c] flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
             <Instagram size={14} /> Instagram
           </a>
           <a href="mailto:ankith8804@gmail.com" className="opacity-60 hover:opacity-100 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all">
             <Mail size={14} /> Contact
           </a>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-bold opacity-50 uppercase tracking-widest">
           <button onClick={() => alert('Opening MIKE OS Documentation...')} className="hover:opacity-100 transition-opacity">Docs</button>
           <button onClick={() => alert('API Reference loaded.')} className="hover:opacity-100 transition-opacity">API</button>
           <span>&copy; 2026 MIKE OS INTELLIGENCE</span>
        </div>
      </footer>
    </div>
  )
}