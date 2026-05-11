'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Star, TrendingUp, ArrowUpRight, ArrowDownRight, List, Loader2, AlertCircle } from 'lucide-react'

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT']
const STOCK_SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NFLX']

const TIMEFRAMES = [{ label: '1m', val: '1m' }, { label: '15m', val: '15m' }, { label: '1H', val: '1h' }, { label: '4H', val: '4h' }, { label: '1D', val: '1d' }]

interface Candle { open: number; high: number; low: number; close: number }
interface WatchlistItem { symbol: string; price: string; change: string; up: boolean }

// --- DYNAMIC CHART COMPONENT ---
function ChartArea({ data, color }: { data: Candle[], color: string }) {
  if (!data || data.length === 0) return <div className="h-[260px] mt-4 flex items-center justify-center text-slate-500"><Loader2 className="animate-spin" /></div>

  const minPrice = Math.min(...data.map(c => c.low))
  const maxPrice = Math.max(...data.map(c => c.high))
  const priceRange = maxPrice - minPrice || 1

  const W = 700; const H = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 70 }
  const chartW = W - padding.left - padding.right
  const chartH = H - padding.top - padding.bottom
  const candleW = chartW / data.length
  
  const toY = (p: number) => padding.top + chartH - ((p - minPrice) / priceRange) * chartH
  const toX = (i: number) => padding.left + i * candleW + candleW / 2
  const priceLabels = [minPrice, minPrice + priceRange * 0.25, minPrice + priceRange * 0.5, minPrice + priceRange * 0.75, maxPrice]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block mt-4">
      {priceLabels.map((p, i) => (
        <g key={i}>
          <line x1={padding.left} y1={toY(p)} x2={W - padding.right} y2={toY(p)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={padding.left - 8} y={toY(p) + 4} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">
            {p > 1000 ? `${(p / 1000).toFixed(2)}k` : p.toFixed(2)}
          </text>
        </g>
      ))}
      {data.map((c, i) => {
        const up = c.close >= c.open
        const candleColor = up ? color : '#ef4444' 
        const x = toX(i); const bodyTop = toY(Math.max(c.open, c.close)); const bodyH = Math.max(1, Math.abs(toY(c.open) - toY(c.close)))
        return (
          <g key={i}>
            <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={candleColor} strokeWidth="1" opacity="0.8" />
            <rect x={x - candleW * 0.35} y={bodyTop} width={candleW * 0.7} height={bodyH} fill={candleColor} opacity="0.9" />
          </g>
        )
      })}
      {/* Current live price dotted line */}
      <line x1={padding.left} y1={toY(data[data.length - 1].close)} x2={W - padding.right} y2={toY(data[data.length - 1].close)} stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.7" />
    </svg>
  )
}

export function TradingView() {
  const [marketMode, setMarketMode] = useState<'crypto' | 'stocks'>('crypto')
  const [activeSymbol, setActiveSymbol] = useState(CRYPTO_SYMBOLS[0])
  const [tf, setTf] = useState('1h')
  const [candleData, setCandleData] = useState<Candle[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [orderBook, setOrderBook] = useState({ bids: [] as string[][], asks: [] as string[][] })
  const [avLimitHit, setAvLimitHit] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const stockJitterRef = useRef<NodeJS.Timeout | null>(null)

  const themeColor = marketMode === 'crypto' ? 'text-cyan-400' : 'text-purple-400'
  const themeBg = marketMode === 'crypto' ? 'bg-cyan-500' : 'bg-purple-500'
  const themeBorder = marketMode === 'crypto' ? 'border-cyan-500' : 'border-purple-500'

  useEffect(() => {
    if (marketMode === 'crypto') {
      setActiveSymbol(CRYPTO_SYMBOLS[0])
      setWatchlist(CRYPTO_SYMBOLS.map(s => ({ symbol: s, price: '...', change: '...', up: true })))
    } else {
      setActiveSymbol(STOCK_SYMBOLS[0])
      setWatchlist(STOCK_SYMBOLS.map(s => ({ symbol: s, price: 'Delayed', change: '...', up: true })))
    }
  }, [marketMode])

  // --- CRYPTO MODE: Binance WebSocket ---
  useEffect(() => {
    if (marketMode !== 'crypto') return

    setCandleData([])
    
    // Wrapped in try/catch to prevent 'Failed to fetch' crash
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${activeSymbol}&interval=${tf}&limit=60`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setCandleData(data.map((d: any[]) => ({ open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) })))
        }
        
        const depthRes = await fetch(`https://api.binance.com/api/v3/depth?symbol=${activeSymbol}&limit=5`)
        const depthData = await depthRes.json()
        if (depthData.bids) setOrderBook({ bids: depthData.bids, asks: depthData.asks })
      } catch (err) {
        console.error('Binance fetch failed:', err)
      }
    }
    fetchInitialData()
      
    try {
      const streams = CRYPTO_SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/') + `/${activeSymbol.toLowerCase()}@kline_${tf}`
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

      wsRef.current.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        const data = payload.data
        if (payload.stream.includes('@ticker')) {
          setWatchlist(prev => prev.map(item => {
            if (item.symbol === data.s) {
              const price = parseFloat(data.c); const change = parseFloat(data.P)
              return { ...item, price: price > 10 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4), change: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`, up: change >= 0 }
            }
            return item
          }))
        }
        if (payload.stream.includes('@kline')) {
          setCandleData(prev => {
            if (!prev.length) return prev
            const newData = [...prev]; newData[newData.length - 1] = { open: parseFloat(data.k.o), high: parseFloat(data.k.h), low: parseFloat(data.k.l), close: parseFloat(data.k.c) }
            return newData
          })
        }
      }
    } catch (err) {
      console.error('WebSocket creation failed:', err)
    }

    return () => { if (wsRef.current) wsRef.current.close() }
  }, [marketMode, activeSymbol, tf])

  // --- STOCKS MODE: Alpha Vantage REST API ---
  useEffect(() => {
    if (marketMode !== 'stocks') {
      if (stockJitterRef.current) clearInterval(stockJitterRef.current)
      return
    }

    setCandleData([])
    setAvLimitHit(false)
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY

    if (!apiKey || apiKey === 'your_alpha_vantage_key_here') {
      setAvLimitHit(true) 
      return
    }

    const fetchStocks = async () => {
      try {
        const tsRes = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${activeSymbol}&apikey=${apiKey}`)
        const tsData = await tsRes.json()
        
        if (tsData['Information'] || tsData['Note']) {
          setAvLimitHit(true) 
          return
        }

        if (tsData['Time Series (Daily)']) {
          const series = Object.values(tsData['Time Series (Daily)']).slice(0, 40).reverse() as any[]
          const parsedData = series.map(d => ({ open: parseFloat(d['1. open']), high: parseFloat(d['2. high']), low: parseFloat(d['3. low']), close: parseFloat(d['4. close']) }))
          setCandleData(parsedData)
          
          const currentPrice = parsedData[parsedData.length - 1].close
          const bids = Array.from({length: 5}, (_, i) => [(currentPrice - (i * 0.5)).toFixed(2), (Math.random() * 10).toFixed(2)])
          const asks = Array.from({length: 5}, (_, i) => [(currentPrice + (i * 0.5)).toFixed(2), (Math.random() * 10).toFixed(2)])
          setOrderBook({ bids, asks })
          setWatchlist(prev => prev.map(item => item.symbol === activeSymbol ? { ...item, price: currentPrice.toFixed(2), change: 'Market Open', up: true } : item))
        }
      } catch (e) {
        console.error("Alpha Vantage Error", e)
        setAvLimitHit(true) // Fall back to mock data if network fails
      }
    }

    fetchStocks()

    stockJitterRef.current = setInterval(() => {
      setCandleData(prev => {
        if (!prev.length) return prev
        const newData = [...prev]
        const last = newData[newData.length - 1]
        const jitter = (Math.random() - 0.5) * 0.5
        newData[newData.length - 1] = { ...last, close: last.close + jitter, high: Math.max(last.high, last.close + jitter), low: Math.min(last.low, last.close + jitter) }
        return newData
      })
    }, 2000)

    return () => { if (stockJitterRef.current) clearInterval(stockJitterRef.current) }
  }, [marketMode, activeSymbol])


  // Fallback Mock Data
  useEffect(() => {
    if (marketMode === 'stocks' && avLimitHit && candleData.length === 0) {
      let basePrice = activeSymbol === 'NVDA' ? 880 : activeSymbol === 'AAPL' ? 180 : 250
      const mockData = []
      for(let i=0; i<40; i++) {
        const change = (Math.random() - 0.45) * 5
        basePrice += change
        mockData.push({ open: basePrice, close: basePrice+change, high: basePrice + Math.abs(change) + 1, low: basePrice - Math.abs(change) - 1 })
      }
      setCandleData(mockData)
      const currentPrice = mockData[mockData.length - 1].close
      setWatchlist(prev => prev.map(item => item.symbol === activeSymbol ? { ...item, price: currentPrice.toFixed(2), change: 'API Limit/Mock', up: true } : item))
      const bids = Array.from({length: 5}, (_, i) => [(currentPrice - (i * 0.5)).toFixed(2), (Math.random() * 10).toFixed(2)])
      const asks = Array.from({length: 5}, (_, i) => [(currentPrice + (i * 0.5)).toFixed(2), (Math.random() * 10).toFixed(2)])
      setOrderBook({ bids, asks })
    }
  }, [avLimitHit, marketMode, activeSymbol, candleData.length])


  const activeStats = watchlist.find(w => w.symbol === activeSymbol)

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Main Chart Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
          {avLimitHit && marketMode === 'stocks' && (
            <div className="absolute top-0 left-0 w-full bg-red-500/10 border-b border-red-500/30 text-red-400 text-[10px] uppercase font-bold text-center py-1 flex items-center justify-center gap-2">
              <AlertCircle size={12} /> Alpha Vantage API limit reached or Network Error. Displaying simulated data.
            </div>
          )}
          
          <div className={`flex justify-between items-center mb-2 ${avLimitHit ? 'mt-4' : ''}`}>
            <div className="flex items-center gap-4">
              <span className={`text-xl font-bold ${themeColor}`}>{activeSymbol.replace('USDT', '/USDT')}</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${activeStats?.up ? 'text-emerald-400' : 'text-red-400'}`}>{activeStats?.price || '...'}</span>
                <span className={`text-sm px-2 py-0.5 rounded font-bold ${activeStats?.up ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {activeStats?.change || '...'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {TIMEFRAMES.map(t => (
                <button key={t.val} onClick={() => setTf(t.val)} className={`px-3 py-1 text-xs font-bold rounded transition-all ${tf === t.val ? `${themeBg}/20 ${themeColor} border ${themeBorder}/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]` : 'text-slate-500 hover:text-slate-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          
          <ChartArea data={candleData} color={marketMode === 'crypto' ? '#06b6d4' : '#a855f7'} />
        </div>

        {/* Live Order Book */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
            <List size={16} className={themeColor}/> Level 2 Order Book Depth
          </h3>
          <div className="grid grid-cols-2 gap-8">
            {/* Bids */}
            <div>
              <div className="text-emerald-400 text-xs font-bold mb-2 flex justify-between"><span>Bid Price</span><span>Amount</span></div>
              {orderBook.bids.map((b: string[], i) => (
                <div key={i} className="flex justify-between text-sm py-1 relative">
                  <div className="absolute top-0 right-0 h-full bg-emerald-500/10" style={{ width: `${80 - i * 12}%` }} />
                  <span className="text-emerald-400 z-10 font-mono">{parseFloat(b[0]).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-slate-400 z-10 font-mono">{parseFloat(b[1]).toFixed(3)}</span>
                </div>
              ))}
            </div>
            {/* Asks */}
            <div>
              <div className="text-red-400 text-xs font-bold mb-2 flex justify-between"><span>Ask Price</span><span>Amount</span></div>
              {orderBook.asks.map((a: string[], i) => (
                <div key={i} className="flex justify-between text-sm py-1 relative">
                  <div className="absolute top-0 left-0 h-full bg-red-500/10" style={{ width: `${80 - i * 12}%` }} />
                  <span className="text-red-400 z-10 font-mono">{parseFloat(a[0]).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-slate-400 z-10 font-mono">{parseFloat(a[1]).toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-4">

        {/* Market Toggle */}
        <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 shadow-lg">
          <button onClick={() => setMarketMode('crypto')} className={`flex-1 text-xs font-bold py-2 rounded transition-all ${marketMode === 'crypto' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>CRYPTO</button>
          <button onClick={() => setMarketMode('stocks')} className={`flex-1 text-xs font-bold py-2 rounded transition-all ${marketMode === 'stocks' ? 'bg-slate-800 text-purple-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>STOCKS</button>
        </div>

        {/* Watchlist */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 overflow-hidden flex flex-col">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Star size={16} className="text-yellow-400"/> Watchlist</h3>
          <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {watchlist.map((w, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSymbol(w.symbol)} 
                className={`w-full flex justify-between items-center p-2.5 rounded transition-all ${activeSymbol === w.symbol ? `bg-slate-950 border-l-2 ${themeBorder} shadow-inner` : 'hover:bg-slate-800/50'}`}
              >
                <span className={`font-bold ${activeSymbol === w.symbol ? themeColor : 'text-slate-300'}`}>{w.symbol.replace('USDT', '')}</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-mono text-slate-200">{w.price}</span>
                  <span className={`text-[10px] font-bold flex items-center ${w.change.includes('Mock') || w.change.includes('Delayed') ? 'text-slate-500' : w.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {!w.change.includes('Mock') && !w.change.includes('Delayed') && (w.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)} 
                    {w.change}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}