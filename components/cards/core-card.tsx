'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'

export function CoreCard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-cyan-500/30 border border-cyan-500"></span>
          CORE dashboard
        </h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 hover:bg-slate-700 rounded transition-all"
        >
          <MoreVertical size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Focus Hours */}
        <div>
          <p className="text-xs text-slate-400 mb-1">Focus hours</p>
          <p className="text-3xl font-bold text-white">4.5h</p>
          <p className="text-xs text-slate-500">Today</p>
        </div>

        {/* Daily Streak */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-400">Daily streak</p>
            <div className="w-5 h-5 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400/20"></div>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">12 Days</p>
        </div>

        {/* Key Insights */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2 font-semibold">Key insights</p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Focus hours: finish-and-forget in focus hours</li>
            <li>• Daily streak: Daily 12 Days house. Key insights.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}