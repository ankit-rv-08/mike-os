'use client';

import { useState } from 'react';
import { Globe, TrendingUp, Zap, BookOpen } from 'lucide-react';

type NewsCategory = 'international' | 'indian' | 'business' | 'crypto' | 'market';

const newsData: Record<NewsCategory, Array<{ id: number; headline: string; summary: string; time: string; source: string }>> = {
  international: [
    {
      id: 1,
      headline: 'Global economic outlook shows signs of stabilization',
      summary: 'Major economies report reduced inflation and steady growth in Q2 2024...',
      time: '2 hours ago',
      source: 'Reuters',
    },
    {
      id: 2,
      headline: 'Tech stocks surge on AI advancement announcements',
      summary: 'Major tech companies reveal groundbreaking AI capabilities at conference...',
      time: '4 hours ago',
      source: 'Bloomberg',
    },
  ],
  indian: [
    {
      id: 3,
      headline: 'India&apos;s GDP growth accelerates to 7.2% in FY2024',
      summary: 'Economic data shows strong performance in manufacturing and services sectors...',
      time: '1 hour ago',
      source: 'Economic Times',
    },
    {
      id: 4,
      headline: 'Rupee strengthens against major currencies',
      summary: 'INR crosses new highs against USD and EUR in morning trading...',
      time: '3 hours ago',
      source: 'Moneycontrol',
    },
  ],
  business: [
    {
      id: 5,
      headline: 'Fortune 500 company posts record Q2 earnings',
      summary: 'Major conglomerate beats analyst expectations with strong performance...',
      time: '30 mins ago',
      source: 'Business Standard',
    },
    {
      id: 6,
      headline: 'Startup funding surge continues despite market slowdown',
      summary: 'Venture capital investments reach new quarterly highs in emerging markets...',
      time: '2 hours ago',
      source: 'Startup India',
    },
  ],
  crypto: [
    {
      id: 7,
      headline: 'Bitcoin breaks above $50,000 on ETF optimism',
      summary: 'Cryptocurrency rebounds strongly following institutional adoption announcements...',
      time: '15 mins ago',
      source: 'CoinMarketCap',
    },
    {
      id: 8,
      headline: 'Ethereum network upgrades boost transaction capacity',
      summary: 'Major protocol update enables faster processing and lower fees...',
      time: '1 hour ago',
      source: 'Crypto News',
    },
  ],
  market: [
    {
      id: 9,
      headline: 'Stock market reaches all-time high amid bullish sentiment',
      summary: 'S&P 500 and Nasdaq close at record levels as investors gain confidence...',
      time: '45 mins ago',
      source: 'MarketWatch',
    },
    {
      id: 10,
      headline: 'Oil prices edge higher on supply concerns',
      summary: 'Energy sector sees modest gains as geopolitical tensions increase...',
      time: '2 hours ago',
      source: 'CNBC',
    },
  ],
};

const categories: Array<{ id: NewsCategory; label: string; icon: React.ReactNode }> = [
  { id: 'international', label: 'International', icon: <Globe className="w-4 h-4" /> },
  { id: 'indian', label: 'Indian', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'business', label: 'Business', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'crypto', label: 'Crypto', icon: <Zap className="w-4 h-4" /> },
  { id: 'market', label: 'Market', icon: <TrendingUp className="w-4 h-4" /> },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('international');

  const currentNews = newsData[activeCategory];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-glow mb-2">News Feed</h1>
        <p className="text-muted-foreground">Stay informed with latest market and business updates</p>
      </div>

      {/* Category Tabs */}
      <div className="glass-panel p-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              ${
                activeCategory === category.id
                  ? 'bg-accent/30 text-accent border border-accent/50 neon-glow'
                  : 'bg-card/40 text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/50'
              }
            `}
          >
            {category.icon}
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* News Articles */}
      <div className="space-y-4">
        {currentNews.map((article) => (
          <article
            key={article.id}
            className="glass-panel p-6 hover-glow cursor-pointer group transition-all duration-300"
          >
            <div className="space-y-3">
              {/* Headline */}
              <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                {article.headline}
              </h2>

              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed">{article.summary}</p>

              {/* Meta Information */}
              <div className="flex items-center justify-between pt-3 border-t border-border/20">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{article.time}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                    {article.source}
                  </span>
                </div>

                <button className="text-xs px-3 py-1.5 rounded-lg bg-card/40 border border-border/30 text-foreground hover:text-accent transition-colors duration-200 hover:border-accent/50">
                  Read More
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* AI Summary Section */}
      <div className="glass-panel-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-foreground">AI Summary</h3>
        </div>

        <div className="bg-card/30 border border-border/20 rounded-lg p-6">
          <p className="text-foreground leading-relaxed mb-4">
            {activeCategory === 'international' &&
              'Global markets show signs of stabilization with reduced inflation pressures. Tech companies continue to lead growth with AI innovations, while traditional sectors show steady recovery. International trade dynamics remain favorable for emerging markets.'}
            {activeCategory === 'indian' &&
              'India&apos;s economy continues robust growth trajectory with GDP expansion and currency strength. Domestic consumption remains strong while export sectors benefit from global recovery. Policy support continues for manufacturing and digital transformation initiatives.'}
            {activeCategory === 'business' &&
              'Corporate earnings season shows mixed results with strong performance in tech and services sectors. Startups attract significant funding as investor confidence returns. M&A activity picks up as companies reshape their portfolios.'}
            {activeCategory === 'crypto' &&
              'Cryptocurrency markets gain momentum with Bitcoin and Ethereum showing strength. Institutional adoption accelerates while regulatory clarity improves market sentiment. Network upgrades enhance scalability and reduce transaction costs.'}
            {activeCategory === 'market' &&
              'Stock markets reach new highs driven by positive economic indicators and corporate earnings. Sector rotation continues with defensive stocks gaining appeal. Commodity prices show volatility amid supply chain considerations.'}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 border border-border/20 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
              <p className="font-semibold text-green-400">Bullish</p>
            </div>
            <div className="bg-card/50 border border-border/20 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">Key Trend</p>
              <p className="font-semibold text-accent">Upward</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
