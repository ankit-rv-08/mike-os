'use client'

import { useState } from 'react'
import { Globe, Star, TrendingUp, ArrowUpRight, ArrowDownRight, List } from 'lucide-react'

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']

const watchlist = [
  { symbol: 'BTC/USDT', price: '67,420', change: '+2.14%', vol: '28.4B', up: true },
  { symbol: 'ETH/USDT', price: '3,841', change: '-0.82%', vol: '14.2B', up: false },
  { symbol: 'SOL/USDT', price: '172.4', change: '+4.21%', vol: '3.8B', up: true },
  { symbol: 'AAPL', price: '187.2', change: '+0.64%', vol: '52.1M', up: true },
  { symbol: 'TSLA', price: '182.3', change: '+1.24%', vol: '89.3M', up: true },
  { symbol: 'NVDA', price: '875.4', change: '-1.12%', vol: '41.2M', up: false },
  { symbol: 'SPX', price: '5,284', change: '+0.42%', vol: '—', up: true },
  { symbol: 'GOLD', price: '2,318', change: '+0.18%', vol: '—', up: true },
]

const marketOverview = [
  { label: 'Fear & Greed', value: '68', tag: 'Greed', color: 'text-yellow-400' },
  { label: 'BTC Dominance', value: '54.2%', tag: 'High', color: 'text-blue-400' },
  { label: 'Total Market Cap', value: '$2.48T', tag: 'Bull', color: 'text-emerald-400' },
  { label: 'DXY Index', value: '104.2', tag: 'Neutral', color: 'text-slate-400' },
]

function generateCandleData(count: number) {
  const data = []
  let price = 65000 + Math.random() * 5000
  for (let i = 0; i < count; i++) {
    const open = price
    const change = (Math.random() - 0.46) * 1200
    const close = open + change
    const high = Math.max(open, close) + Math.random() * 400
    const low = Math.min(open, close) - Math.random() * 400
    data.push({ open, close, high, low })
    price = close
  }
  return data
}

const candleData = generateCandleData(60)
const minPrice = Math.min(...candleData.map(c => c.low))
const maxPrice = Math.max(...candleData.map(c => c.high))
const priceRange = maxPrice - minPrice

function ChartArea() {
  const W = 700; const H = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 70 }
  const chartW = W - padding.left - padding.right
  const chartH = H - padding.top - padding.bottom
  const candleW = chartW / candleData.length
  const toY = (p: number) => padding.top + chartH - ((p - minPrice) / priceRange) * chartH
  const toX = (i: number) => padding.left + i * candleW + candleW / 2
  const priceLabels = [minPrice, minPrice + priceRange * 0.25, minPrice + priceRange * 0.5, minPrice + priceRange * 0.75, maxPrice]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block mt-4">
      {priceLabels.map((p, i) => (
        <g key={i}>
          <line x1={padding.left} y1={toY(p)} x2={W - padding.right} y2={toY(p)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={padding.left - 8} y={toY(p) + 4} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">
            {(p / 1000).toFixed(1)}k
          </text>
        </g>
      ))}
      {candleData.map((c, i) => {
        const up = c.close >= c.open
        const color = up ? '#06b6d4' : '#ef4444'
        const x = toX(i); const bodyTop = toY(Math.max(c.open, c.close)); const bodyH = Math.max(1, Math.abs(toY(c.open) - toY(c.close)))
        return (
          <g key={i}>
            <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={color} strokeWidth="0.8" opacity="0.7" />
            <rect x={x - candleW * 0.3} y={bodyTop} width={candleW * 0.6} height={bodyH} fill={color} opacity={0.85} />
          </g>
        )
      })}
      <line x1={padding.left} y1={toY(candleData[candleData.length - 1].close)} x2={W - padding.right} y2={toY(candleData[candleData.length - 1].close)} stroke="#06b6d4" strokeWidth="1" strokeDasharray="4,4" opacity="0.7" />
    </svg>
  )
}

export function TradingView() {
  const [tf, setTf] = useState('1H')
  const [activeSymbol, setActiveSymbol] = useState('BTC/USDT')

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-4">
        {/* Main Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-cyan-400">{activeSymbol}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">67,420</span>
                <span className="text-sm bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">+2.14%</span>
              </div>
            </div>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {timeframes.map(t => (
                <button key={t} onClick={() => setTf(t)} className={`px-3 py-1 text-xs rounded transition-all ${tf === t ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ChartArea />
        </div>

        {/* Order Book */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><List size={16} /> Order Book</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-emerald-400 text-xs font-bold mb-2">Bids</div>
              {[67410, 67395, 67380, 67365, 67340].map((p, i) => (
                <div key={i} className="flex justify-between text-sm py-1 relative">
                  <div className="absolute top-0 right-0 h-full bg-emerald-500/10" style={{ width: `${60 - i * 10}%` }} />
                  <span className="text-emerald-400 z-10">{p.toLocaleString()}</span>
                  <span className="text-slate-400 z-10">{(1.2 - i * 0.2).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-red-400 text-xs font-bold mb-2">Asks</div>
              {[67425, 67440, 67460, 67480, 67510].map((p, i) => (
                <div key={i} className="flex justify-between text-sm py-1 relative">
                  <div className="absolute top-0 left-0 h-full bg-red-500/10" style={{ width: `${40 + i * 8}%` }} />
                  <span className="text-red-400 z-10">{p.toLocaleString()}</span>
                  <span className="text-slate-400 z-10">{(0.8 + i * 0.3).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-4">
        {/* Watchlist */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Star size={16} /> Watchlist</h3>
          <div className="space-y-1">
            {watchlist.map((w, i) => (
              <button key={i} onClick={() => setActiveSymbol(w.symbol)} className={`w-full flex justify-between items-center p-2 rounded transition-all ${activeSymbol === w.symbol ? 'bg-slate-800 border-l-2 border-cyan-400' : 'hover:bg-slate-800/50'}`}>
                <span className={activeSymbol === w.symbol ? 'text-cyan-400 font-bold' : 'text-slate-300'}>{w.symbol}</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm">{w.price}</span>
                  <span className={`text-xs flex items-center ${w.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {w.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {w.change}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Globe size={16} /> Overview</h3>
          <div className="space-y-3">
            {marketOverview.map((m, i) => (
              <div key={i} className="flex justify-between items-center p-2 border border-slate-800 rounded bg-slate-950/50">
                <span className="text-xs text-slate-400">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{m.value}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 ${m.color}`}>{m.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}