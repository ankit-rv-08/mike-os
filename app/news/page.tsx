'use client';

import { Sparkles, Globe, TrendingUp, Clock } from 'lucide-react';

export default function NewsPage() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence</h1>
        <p className="text-muted-foreground text-sm mt-1">Curated global events and AI analysis.</p>
      </div>

      {/* AI Digest Card */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/30 border border-blue-800/50 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Sparkles size={64} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-blue-400" />
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest">AI Digest</h2>
        </div>
        <p className="text-lg text-gray-200 leading-relaxed max-w-3xl">
          Today's key themes: <strong className="text-white">AI regulation tightening</strong> globally (EU framework), strong crypto ETF momentum (BTC ETF inflows), Indian markets at all-time highs driven by FII buying. Watch RBI commentary for INR impact.
        </p>
        <div className="flex gap-2 mt-4">
          {['International', 'Indian', 'Business', 'Crypto'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Latest Briefings</h3>
          
          {[
            { tag: 'Tech', time: '2h ago', source: 'Reuters', title: 'EU Passes Landmark AI Regulation Framework for 2025', desc: 'The European Union has finalized its comprehensive AI governance framework, setting global precedent for high-risk system oversight.' },
            { tag: 'Finance', time: '4h ago', source: 'Bloomberg', title: 'G7 Leaders Convene Emergency Summit on Global Economic Stability', desc: 'Finance ministers and central bank governors gathered to coordinate policy responses to ongoing market turbulence amid geopolitical shifts.' },
            { tag: 'Economy', time: '6h ago', source: 'Economic Times', title: 'India Reports Strongest Manufacturing PMI in 18 Months', desc: 'Factory output exceeded expectations in April, signaling economic recovery momentum despite ongoing global trade complexities.' }
          ].map((news, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:bg-gray-800 transition cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-bold text-gray-300 uppercase">{news.tag}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {news.time}</span>
                  <span>•</span>
                  <span>{news.source}</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition">{news.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{news.desc}</p>
            </div>
          ))}
        </div>

        {/* Trending & Sources Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-orange-400" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Trending</h3>
            </div>
            <div className="space-y-3">
              {[
                { rank: '#1', topic: 'Bitcoin ETF' },
                { rank: '#2', topic: 'RBI Policy' },
                { rank: '#3', topic: 'AI Regulation' },
                { rank: '#4', topic: 'NVIDIA Earnings' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="font-mono text-gray-500 text-xs">{item.rank}</span>
                  <span className="font-medium text-gray-200">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sources</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Reuters', 'Bloomberg', 'CoinDesk', 'Economic Times', 'TechCrunch', 'WSJ'].map(source => (
                <span key={source} className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-700 cursor-pointer">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}