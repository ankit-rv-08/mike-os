'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const weightTrendData = [
  { value: 75 },
  { value: 74 },
  { value: 76 },
  { value: 73 },
  { value: 72 },
]

const workoutData = [
  { time: '8', value: 20 },
  { time: '14', value: 60 },
  { time: '18', value: 45 },
  { time: '24', value: 75 },
  { time: '28', value: 50 },
  { time: '32', value: 65 },
  { time: '36', value: 40 },
]

export function VitalsCard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="text-orange-400">📈</span>
          VITALS (Performance)
        </h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 hover:bg-slate-700 rounded transition-all"
        >
          <MoreVertical size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Sleep */}
        <div>
          <p className="text-xs text-slate-400 mb-1">Sleep</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">7.2h</p>
            <p className="text-lg font-bold text-cyan-400">92%</p>
            <p className="text-xs text-slate-500">quality</p>
          </div>
        </div>

        {/* Weight Trend */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Weight trend</p>
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={weightTrendData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Consistency */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Workout consistency</p>
          <div className="flex items-end justify-between gap-1 h-16">
            {workoutData.map((data, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                style={{ height: `${(data.value / 100) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Sun</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
          </div>
        </div>
      </div>
    </div>
  )
}