'use client'

import { useState } from 'react'
import { Bell, Grid3x3, Settings, Clock } from 'lucide-react'
import { CoreCard } from './cards/core-card'
import { VitalsCard } from './cards/vitals-card'
import { ExecutionCard } from './cards/execution-card'
import { LifeScoreCircle } from './cards/life-score-circle'
import { CapitalCard } from './cards/capital-card'
import { ChatCard } from './cards/chat-card'

interface MainDashboardProps {
  activeNav: string
}

export function MainDashboard({ activeNav }: MainDashboardProps) {
  return (
    <div className="flex-1 px-8 py-4 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sticky top-0 bg-gradient-to-b from-slate-950 via-slate-900 to-transparent z-10 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            MIKE{' '}
            <span className="text-cyan-400">NEURAL HUB</span>
            <span className="ml-1 text-base">🧠</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400">
            ANKITH RV | NITK | HUDRA TECH | GRAD 2027
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-all">
            <Bell size={16} className="text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-all">
            <Grid3x3 size={16} className="text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-all">
            <Settings size={16} className="text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-all">
            <Clock size={16} className="text-slate-400" />
          </button>
          <div className="text-xs text-slate-400">10:38 AM</div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="mb-4">
        <p className="text-xs text-slate-400">
          DUAL BRAIN: Gemini 1.5 Pro | Groq LLaMA 8B{' '}
          <span className="text-yellow-400">⚡</span>
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4 pb-8">
        {/* Left Column - Cards Stack */}
        <div className="space-y-3">
          <CoreCard />
          <VitalsCard />
          <ExecutionCard />
        </div>

        {/* Center Column - Life Score */}
        <div className="flex items-center justify-center">
          <LifeScoreCircle />
        </div>

        {/* Right Column - Capital & Chat */}
        <div className="space-y-3">
          <CapitalCard />
          <ChatCard />
        </div>
      </div>
    </div>
  )
}
