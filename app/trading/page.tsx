'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, BarChart2 } from 'lucide-react';

export default function TradingPage() {
  const [marketData, setMarketData] = useState<any>({
    BTC: { price: 'Loading...', change: 0 },
    ETH: { price: 'Loading...', change: 0 },
    SOL: { price: 'Loading...', change: 0 },
  });

  // Fetch REAL LIVE DATA from Binance Free Public API
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
        const data = await res.json();
        
        const formatData = (symbol: string) => {
          const coin = data.find((d: any) => d.symbol === symbol);
          return {
            price: parseFloat(coin.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: parseFloat(coin.priceChangePercent)
          };
        };

        setMarketData({
          BTC: formatData('BTCUSDT'),
          ETH: formatData('ETHUSDT'),
          SOL: formatData('SOLUSDT'),
        });
      } catch (err) {
        console.error("Failed to fetch market data", err);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trading</h1>
          <p className="text-muted-foreground text-sm mt-1">Live market data and portfolio tracking.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
            <Activity size={16} className="text-green-400" />
            <span className="text-sm font-medium text-gray-300">Markets Open</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">BTC/USDT</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-mono text-gray-200">${marketData.BTC.price}</span>
                  <span className={`text-sm font-medium flex items-center ${marketData.BTC.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.BTC.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(marketData.BTC.change)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                {['1m', '15m', '1H', '4H', '1D', '1W'].map(tf => (
                  <button key={tf} className={`px-3 py-1 text-xs font-medium rounded-md ${tf === '1D' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mock Chart UI */}
            <div className="h-64 w-full bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <BarChart2 size={48} className="text-blue-500 opacity-50" />
              <span className="absolute bottom-4 right-4 text-xs font-mono text-gray-600">TradingView Integrated (Mock)</span>
            </div>
          </div>

          {/* Order Book */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Order Book</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs text-gray-500 flex justify-between mb-2 pb-2 border-b border-gray-800">
                  <span>Size</span><span>Bid (USDT)</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  {[1.2, 1.0, 0.8, 0.6, 0.4].map((size, i) => (
                    <div key={i} className="flex justify-between text-green-400">
                      <span>{size.toFixed(2)}</span><span>67,{(410 - i * 15).toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 flex justify-between mb-2 pb-2 border-b border-gray-800">
                  <span>Ask (USDT)</span><span>Size</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  {[0.8, 1.1, 1.4, 1.7, 2.0].map((size, i) => (
                    <div key={i} className="flex justify-between text-red-400">
                      <span>67,{(425 + i * 15).toString()}</span><span>{size.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Watchlist */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Live Watchlist</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <div>
                  <div className="font-bold text-white">BTC</div>
                  <div className="text-xs text-gray-500">Bitcoin</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">${marketData.BTC.price}</div>
                  <div className={`text-xs ${marketData.BTC.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{marketData.BTC.change}%</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <div>
                  <div className="font-bold text-white">ETH</div>
                  <div className="text-xs text-gray-500">Ethereum</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">${marketData.ETH.price}</div>
                  <div className={`text-xs ${marketData.ETH.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{marketData.ETH.change}%</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer">
                <div>
                  <div className="font-bold text-white">SOL</div>
                  <div className="text-xs text-gray-500">Solana</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">${marketData.SOL.price}</div>
                  <div className={`text-xs ${marketData.SOL.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{marketData.SOL.change}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Market Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-sm text-gray-400">Fear & Greed</span>
                <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">68 Greed</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-sm text-gray-400">Total Market Cap</span>
                <span className="text-sm font-mono text-white">$2.48T</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">BTC Dominance</span>
                <span className="text-sm font-mono text-white">54.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}