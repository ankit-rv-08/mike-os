'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const spendingData = [
  { value: 100 },
  { value: 150 },
  { value: 120 },
  { value: 180 },
  { value: 160 },
  { value: 200 },
]

export function CapitalCard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="text-yellow-600 text-xl">🔒</span>
          CAPITAL (Finance)
        </h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 hover:bg-slate-700 rounded transition-all"
        >
          <MoreVertical size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Portfolio Value */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Portfolio value</p>
          <p className="text-2xl font-bold text-white">$1,467.37</p>
          <p className="text-xs text-green-400 mt-1">+$373.860</p>
        </div>

        {/* Recent Spending */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Recent spending</p>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={spendingData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crypto Trends */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div>
          <p className="text-xs text-slate-400 mb-2">Crypto trend</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700"></div>
            <div>
              <p className="text-xs text-slate-300">KASPA</p>
              <p className="text-sm font-bold text-white">$0.16</p>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-1">+5%</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-2">Crypto trend</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700"></div>
            <div>
              <p className="text-xs text-slate-300">SOL</p>
              <p className="text-sm font-bold text-white">$145.20</p>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-1">+2.4%</p>
        </div>
      </div>
    </div>
  )
}