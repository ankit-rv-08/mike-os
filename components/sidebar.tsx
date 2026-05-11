'use client'

import { useState } from 'react'
import { Brain, Cog, Heart, TrendingUp, CheckSquare, Calendar, Newspaper, BarChart3, Mic, HelpCircle, MessageSquare, Settings, Bell } from 'lucide-react'
import { useTheme } from './theme-provider'

const navItems = [
  { icon: Brain, label: 'NEURAL' }, { icon: Cog, label: 'CORE' }, { icon: Heart, label: 'VITALS' },
  { icon: TrendingUp, label: 'CAPITAL' }, { icon: CheckSquare, label: 'EXECUTION' }, { icon: Calendar, label: 'CALENDAR' },
  { icon: Newspaper, label: 'NEWS' }, { icon: BarChart3, label: 'TRADING' }, { icon: Mic, label: 'VOICE' },
]

interface SidebarProps { activeNav: string; setActiveNav: (nav: string) => void }

export function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const { mode } = useTheme()

  const getTextAccent = () => {
    if (mode === 'Focus') return 'text-blue-500'
    if (mode === 'Deadline') return 'text-orange-500'
    if (mode === 'Hacker') return 'text-green-500'
    return 'text-amber-500' 
  }

  const getThemeAccent = () => {
    if (mode === 'Focus') return 'text-blue-400 bg-blue-500/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
    if (mode === 'Deadline') return 'text-orange-400 bg-orange-500/20 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'
    if (mode === 'Hacker') return 'text-green-500 bg-green-900/40 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
    return 'text-amber-400 bg-amber-500/20 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
  }

  return (
    <div className="w-16 md:w-20 border-r border-[var(--border-color)] flex flex-col items-center py-4 h-full relative z-50 bg-[var(--bg-secondary)] backdrop-blur-md transition-colors duration-500">
      <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity mt-2 mb-6 cursor-pointer">
        <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${getTextAccent()}`}>Run</div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Your</div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Reality</div>
      </div>
      <nav className="space-y-1 flex-1 w-full flex flex-col items-center">
        {navItems.map((item) => {
          const isActive = activeNav === item.label
          return (
            <button key={item.label} onClick={() => setActiveNav(item.label)} title={item.label}
              className={`relative p-3 rounded-lg transition-all duration-300 ${isActive ? getThemeAccent() : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white border border-transparent'}`}>
              <item.icon size={20} />
            </button>
          )
        })}
      </nav>
      <div className="space-y-1 pt-4 border-t border-[var(--border-color)] w-full flex flex-col items-center mb-2">
        <button onClick={() => alert('[SYSTEM] Settings Protocol')} className="p-3 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all relative"><Settings size={20} /></button>
        <button onClick={() => alert('[SYSTEM] Help/Docs Protocol')} className="p-3 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all relative"><HelpCircle size={20} /></button>
      </div>
    </div>
  )
}