'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Settings2, Loader2 } from 'lucide-react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: string;
}

export default function TradingPage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787';
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: 'show me stock market data for NVDA AAPL TSLA MSFT', source: 'trading' }),
        });
        const data = await res.json();
        
        // Try to get real stock data from response
        if (data?.stockData) {
          setWatchlist([{
            symbol: data.stockData.symbol || 'NVDA',
            name: 'Nvidia',
            price: parseFloat(data.stockData.price) || 0,
            change: parseFloat(data.stockData.change) || 0,
            type: 'stock',
          }]);
        }
      } catch {
        // Fallback: try direct stock endpoint
        try {
          const res = await fetch(`${API_BASE}/api/stocks/NVDA`);
          const data = await res.json();
          if (data?.price) {
            setWatchlist([{
              symbol: 'NVDA', name: 'Nvidia', price: data.price,
              change: data.change || 0, type: 'stock',
            }]);
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [API_BASE]);

  // Generate chart data from watchlist
  useEffect(() => {
    if (watchlist.length > 0) {
      const basePrice = watchlist[0].price;
      const points = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
      const chart = points.map((time, i) => ({
        time,
        price: basePrice + (Math.sin(i * 0.5) * basePrice * 0.02),
      }));
      setChartData(chart);
    }
  }, [watchlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-glow mb-2">Trading</h1>
          <p className="text-muted-foreground">Real-time market analysis powered by MIKE</p>
        </div>
        <button className="p-3 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-accent transition-all duration-300">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No market data yet</h3>
          <p className="text-muted-foreground">
            Ask MIKE: "Show me Nvidia stock" or "What's the market doing today?"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="glass-panel p-4 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selectedSymbol}</h2>
                <p className="text-sm text-muted-foreground">
                  ${watchlist[0]?.price?.toFixed(2)} 
                  <span className={watchlist[0]?.change >= 0 ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                    {watchlist[0]?.change >= 0 ? '+' : ''}{watchlist[0]?.change}%
                  </span>
                </p>
              </div>
              <div className="flex gap-2 p-1 bg-card/40 rounded-lg border border-border/30">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      selectedTimeframe === tf
                        ? 'bg-accent/30 text-accent border border-accent/50'
                        : 'text-muted-foreground hover:text-foreground border border-transparent'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64c8ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#64c8ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(100,200,255,0.3)', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#64c8ff" fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Watchlist */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
            <div className="space-y-3">
              {watchlist.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedSymbol === item.symbol
                      ? 'bg-accent/20 border border-accent/50'
                      : 'bg-card/30 border border-border/30 hover:border-accent/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${item.price?.toFixed(2)}</p>
                      <p className={`text-xs ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Ask MIKE to track more stocks
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
