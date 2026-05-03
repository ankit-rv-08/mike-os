'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Settings2, Plus } from 'lucide-react';

const chartData = [
  { time: '9:00', price: 48200 },
  { time: '10:00', price: 48500 },
  { time: '11:00', price: 48100 },
  { time: '12:00', price: 48800 },
  { time: '13:00', price: 49200 },
  { time: '14:00', price: 48900 },
  { time: '15:00', price: 49500 },
  { time: '16:00', price: 49100 },
];

const watchlist = [
  { symbol: 'BTC', name: 'Bitcoin', price: 49234, change: 2.3, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3248, change: 1.8, type: 'crypto' },
  { symbol: 'AAPL', name: 'Apple', price: 192.45, change: 0.5, type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, change: -1.2, type: 'stock' },
];

const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

export default function TradingPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-glow mb-2">Trading</h1>
          <p className="text-muted-foreground">Real-time market analysis and trading tools</p>
        </div>
        <button className="p-3 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-accent transition-all duration-300 hover:neon-glow">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Chart Toolbar */}
          <div className="glass-panel p-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedSymbol}</h2>
              <p className="text-sm text-muted-foreground">Price Chart</p>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex gap-2 p-1 bg-card/40 rounded-lg border border-border/30">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`
                    px-3 py-1.5 rounded text-xs font-medium transition-all duration-300
                    ${
                      selectedTimeframe === tf
                        ? 'bg-accent/30 text-accent border border-accent/50 neon-glow'
                        : 'text-muted-foreground hover:text-foreground border border-transparent'
                    }
                  `}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel p-8 hover-glow">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(100, 200, 255)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(100, 200, 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                <XAxis dataKey="time" stroke="rgb(100, 150, 200)" />
                <YAxis stroke="rgb(100, 150, 200)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(100, 200, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="rgb(100, 200, 255)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Indicators Section */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Technical Indicators
            </h3>

            <div className="space-y-3">
              {[
                { name: 'RSI (14)', value: '65.2', status: 'overbought' },
                { name: 'MACD', value: 'Bullish', status: 'positive' },
                { name: 'Moving Avg (50)', value: '48,450', status: 'above' },
                { name: 'Bollinger Bands', value: 'Mid', status: 'neutral' },
              ].map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/20">
                  <span className="text-sm text-foreground">{indicator.name}</span>
                  <div className="text-right">
                    <p className="text-sm font-mono text-accent">{indicator.value}</p>
                    <p className="text-xs text-muted-foreground capitalize">{indicator.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Watchlist */}
          <div className="glass-panel p-6 hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Watchlist</h3>
              <button className="p-1 rounded hover:bg-card/50 transition-colors">
                <Plus className="w-4 h-4 text-accent" />
              </button>
            </div>

            <div className="space-y-3">
              {watchlist.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(`${item.symbol}/USD`)}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-300
                    ${
                      selectedSymbol === `${item.symbol}/USD`
                        ? 'bg-accent/20 border border-accent/50 neon-glow'
                        : 'bg-card/30 border border-border/20 hover:border-border/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{item.symbol}</span>
                    <span className={`text-xs ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-sm font-mono text-foreground mt-1">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Overview */}
          <div className="glass-panel p-6 hover-glow">
            <h3 className="font-semibold text-foreground mb-4">Market Status</h3>

            <div className="space-y-3">
              {[
                { name: 'Volatility', value: 'Medium', color: 'bg-yellow-500/20' },
                { name: 'Trend', value: 'Bullish', color: 'bg-green-500/20' },
                { name: 'Volume', value: 'High', color: 'bg-blue-500/20' },
              ].map((item) => (
                <div key={item.name} className={`p-3 rounded-lg border border-border/20 ${item.color}`}>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Info */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Portfolio Value</h3>
            <p className="text-2xl font-bold text-accent mb-1">$125,432.50</p>
            <p className="text-sm text-green-400">+4.2% Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
