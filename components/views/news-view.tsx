'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, TrendingUp, Globe, Loader2, Image as ImageIcon } from 'lucide-react'

// Live RSS feeds via completely free rss2json converter
const FEEDS: Record<string, string> = {
  'Top Stories': 'https://feeds.bbci.co.uk/news/rss.xml',
  'Tech': 'https://techcrunch.com/feed/',
  'Crypto': 'https://cointelegraph.com/rss',
  'India': 'https://www.thehindu.com/news/national/feeder/default.rss'
}

interface Article {
  title: string
  summary: string
  link: string
  time: string
  image: string | null
}

export function NewsView() {
  const tabs = Object.keys(FEEDS)
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dynamicSummary, setDynamicSummary] = useState('')

  useEffect(() => {
    setIsLoading(true)
    const rssUrl = FEEDS[activeTab]
    
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && data.items) {
          const parsedArticles = data.items.map((item: any) => {
            // Strip HTML from descriptions for clean summaries
            const cleanSummary = item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
            // Extract thumbnail (rss2json tries to find it in enclosure or thumbnail fields)
            const img = item.thumbnail || item.enclosure?.link || null
            
            return {
              title: item.title,
              summary: cleanSummary,
              link: item.link,
              time: new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              image: img
            }
          })
          
          setArticles(parsedArticles)
          
          // Generate a fake "AI Summary" based on the actual live top 3 headlines
          if (parsedArticles.length >= 3) {
            setDynamicSummary(`Live analysis: Heavy focus on "${parsedArticles[0].title.substring(0, 30)}...". Other emerging patterns involve ${parsedArticles[1].title.split(' ')[0]} and developments in ${parsedArticles[2].title.split(' ')[0]}. Market sentiment is actively adjusting based on these breaking reports.`)
          }
        }
      })
      .catch(err => console.error('Failed to fetch news:', err))
      .finally(() => setIsLoading(false))
  }, [activeTab])

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Dynamic AI Summary */}
        <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles size={16} /> Live AI Digest
          </div>
          <p className="text-sm text-cyan-50 leading-relaxed relative z-10">
            {isLoading ? "MIKE is analyzing current global feeds..." : dynamicSummary}
          </p>
        </div>

        {/* Real-time News Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col min-h-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-2 shrink-0">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === tab ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed Content */}
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-cyan-400">
                <Loader2 size={32} className="animate-spin mb-4" />
                <span className="text-sm">Intercepting global signals...</span>
              </div>
            ) : (
              articles.map((article, i) => (
                <a 
                  key={i} 
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 p-4 border border-slate-800 rounded-lg hover:border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  {/* Real Image Rendering */}
                  <div className="w-32 h-24 bg-slate-950 rounded flex items-center justify-center shrink-0 overflow-hidden border border-slate-800">
                    {article.image ? (
                      <img src={article.image} alt="News thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="text-slate-700" size={24} />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 text-xs">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">{activeTab}</span>
                        <span className="text-slate-500 font-mono">{article.time}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors line-clamp-1">{article.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{article.summary}</p>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      Read Source <ArrowRight size={14} />
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-4">
        {/* Live Trending Concepts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shrink-0">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><TrendingUp size={16} className="text-emerald-400" /> Detected Signals</h3>
          <div className="space-y-3">
            {articles.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-cyan-500 font-bold text-xs bg-slate-950 px-2 py-1 rounded">#{i + 1}</span>
                <span className="text-sm text-slate-300 hover:text-white cursor-pointer transition-colors truncate">{a.title.split(' ').slice(0, 3).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Feeds */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shrink-0">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Globe size={16} className="text-blue-400"/> Active Satellites</h3>
          <div className="flex flex-wrap gap-2">
            {['BBC World', 'TechCrunch', 'CoinTelegraph', 'The Hindu'].map((s, i) => (
              <span key={i} className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}