'use client'

import { Bell, Grid3x3, Settings, Clock, Activity, Cpu } from 'lucide-react'
import { CoreCard } from './cards/core-card'
import { VitalsCard } from './cards/vitals-card'
import { ExecutionCard } from './cards/execution-card'
import { LifeScoreCircle } from './cards/life-score-circle'
import { CapitalCard } from './cards/capital-card'
import { ChatCard } from './cards/chat-card'

// Import our new detailed views!
import { TradingView } from './views/trading-view'
import { ProjectsView } from './views/projects-view'
import { NewsView } from './views/news-view'

interface MainDashboardProps {
  activeNav: string
}

export function MainDashboard({ activeNav }: MainDashboardProps) {
  
  const renderContent = () => {
    switch (activeNav) {
      case 'NEURAL':
        return (
          <div className="grid grid-cols-3 gap-4 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3"><CoreCard /><VitalsCard /><ExecutionCard /></div>
            <div className="flex items-center justify-center"><LifeScoreCircle /></div>
            <div className="space-y-3 flex flex-col"><CapitalCard /><ChatCard /></div>
          </div>
        )
      
      case 'TRADING': return <TradingView />
      case 'EXECUTION': return <ProjectsView />
      case 'NEWS': return <NewsView />

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 border border-slate-800/50 border-dashed rounded-2xl bg-slate-900/20 animate-in fade-in duration-300">
            <Cpu size={48} className="mb-4 opacity-20" />
            <h2 className="text-xl font-mono tracking-widest text-slate-400">{activeNav} MODULE</h2>
            <p className="text-sm mt-2 opacity-60">System integration pending...</p>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sticky top-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-transparent z-10 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            MIKE <span className="text-cyan-400">{activeNav === 'NEURAL' ? 'NEURAL HUB' : activeNav}</span> <span className="ml-1 text-base">🧠</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400 mr-2 font-mono tracking-tight">ANKITH RV | NITK | HUDRA TECH</div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400"><Bell size={16} /></button>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full ml-2">
            <Clock size={12} className="text-cyan-500" />
            <span className="text-xs font-mono text-slate-300">Active</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Activity size={14} className="text-cyan-500 animate-pulse" />
        <p className="text-xs font-mono text-slate-400 tracking-wider">DUAL BRAIN: GEMINI 1.5 PRO | GROQ LLAMA 8B ⚡</p>
      </div>

      {/* Dynamic Content Area */}
      {renderContent()}
    </div>
  )
}