'use client'

import { useState } from 'react'
import {
  Brain,
  Cog,
  Heart,
  TrendingUp,
  CheckSquare,
  Calendar,
  Newspaper,
  BarChart3,
  Mic,
  HelpCircle,
  MessageSquare,
  Settings,
} from 'lucide-react'

const navItems = [
  { icon: Brain, label: 'NEURAL' },
  { icon: Cog, label: 'CORE' },
  { icon: Heart, label: 'VITALS' },
  { icon: TrendingUp, label: 'CAPITAL' },
  { icon: CheckSquare, label: 'EXECUTION' },
  { icon: Calendar, label: 'CALENDAR' },
  { icon: Newspaper, label: 'NEWS' },
  { icon: BarChart3, label: 'TRADING' },
  { icon: Mic, label: 'VOICE' },
]

const bottomItems = [
  { icon: HelpCircle, label: 'Help' },
  { icon: MessageSquare, label: 'Feedback' },
  { icon: Settings, label: 'Settings' },
]

interface SidebarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
}

export function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  return (
    <div className="w-24 bg-slate-950 border-r border-slate-800 p-3 flex flex-col items-center">
      {/* Header */}
      <div className="text-xs font-bold text-slate-400 mb-6 text-center tracking-tight writing-vertical">
        RUN<br/>YOUR<br/>REALITY
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1 flex-1 w-full flex flex-col items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              onMouseEnter={() => setShowTooltip(item.label)}
              onMouseLeave={() => setShowTooltip(null)}
              title={item.label}
              className={`relative p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-lg"></div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 pt-4 border-t border-slate-800 w-full flex flex-col items-center">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className="p-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
              title={item.label}
            >
              <Icon size={20} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

