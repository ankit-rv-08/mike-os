'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, TrendingUp, Globe } from 'lucide-react'

const newsData: Record<string, any[]> = {
  'International': [
    { title: 'G7 Leaders Convene Emergency Summit on Global Economic Stability', summary: 'Finance ministers and central bank governors gathered to coordinate policy responses to ongoing market turbulence amid geopolitical shifts.', source: 'Reuters', time: '2h ago', category: 'Politics' },
    { title: 'EU Passes Landmark AI Regulation Framework for 2025', summary: 'The European Union has finalized its comprehensive AI governance framework, setting global precedent for high-risk system oversight.', source: 'BBC', time: '4h ago', category: 'Tech' },
  ],
  'Indian': [
    { title: 'RBI Holds Interest Rates Steady, Signals Cautious Outlook', summary: 'The Reserve Bank of India maintained its benchmark rate, citing persistent food inflation and global uncertainty as key concerns.', source: 'Economic Times', time: '1h ago', category: 'Finance' },
    { title: 'Tata Group Announces $2.8B Investment in Semiconductor Fab', summary: 'The conglomerate plans to establish India\'s most advanced chip manufacturing facility in collaboration with global partners.', source: 'Mint', time: '3h ago', category: 'Tech' },
  ],
  'Crypto': [
    { title: 'Bitcoin Consolidates Above $67K as ETF Inflows Remain Strong', summary: 'Spot Bitcoin ETFs continued to absorb selling pressure with $420M in net inflows this week, supporting price stability.', source: 'CoinDesk', time: '30m ago', category: 'BTC' },
    { title: 'SEC Approves First Spot Ethereum ETF for US Markets', summary: 'The landmark decision opens institutional access to Ethereum exposure, with nine products expected to begin trading next week.', source: 'Bloomberg', time: '6h ago', category: 'Regulation' },
  ]
}

const aiSummary = "Today's key themes: AI regulation tightening globally (EU framework), strong crypto ETF momentum (BTC ETF inflows), Indian markets at all-time highs driven by FII buying. Tech earnings broadly positive. Watch RBI commentary for INR impact."

export function NewsView() {
  const tabs = Object.keys(newsData)
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-4">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles size={16} /> AI Digest
          </div>
          <p className="text-sm text-cyan-50 leading-relaxed relative z-10">{aiSummary}</p>
        </div>

        {/* News Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-2">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === tab ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed Content */}
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {newsData[activeTab].map((article, i) => (
              <div key={i} className="group p-4 border border-slate-800 rounded-lg hover:border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-2 text-xs">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">{article.category}</span>
                  <span className="text-slate-500">{article.time}</span>
                  <span className="text-slate-500 border-l border-slate-700 pl-3">{article.source}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">{article.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{article.summary}</p>
                <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Full <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-4">
        {/* Trending */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><TrendingUp size={16} className="text-emerald-400" /> Trending Topics</h3>
          <div className="space-y-3">
            {['Bitcoin ETF', 'RBI Policy', 'AI Regulation', 'S&P 500', 'NVIDIA Earnings'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-cyan-500 font-bold text-xs bg-slate-950 px-2 py-1 rounded">#{i + 1}</span>
                <span className="text-sm text-slate-300 hover:text-white cursor-pointer transition-colors">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Globe size={16} className="text-blue-400"/> Trusted Sources</h3>
          <div className="flex flex-wrap gap-2">
            {['Reuters', 'Bloomberg', 'CoinDesk', 'WSJ'].map((s, i) => (
              <span key={i} className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
