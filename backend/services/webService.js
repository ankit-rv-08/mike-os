// webService.js - Free web intelligence for MIKE OS
const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000;

async function fetchModule() {
  return (await import('node-fetch')).default;
}

async function searchWeb(query) {
  const cacheKey = `search_${query}`;
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TIME) return data;
  }

  try {
    const fetch = await fetchModule();
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    const data = await response.json();
    
    const result = {
      abstract: data.Abstract || data.AbstractText || 'No quick answer available',
      relatedTopics: (data.RelatedTopics || []).slice(0, 5).map(t => t.Text || t).filter(Boolean),
      source: 'DuckDuckGo',
      url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      category: data.Type || 'general'
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error('Search error:', error.message);
    return { abstract: 'Search temporarily unavailable', relatedTopics: [], source: 'fallback' };
  }
}

async function getNews(topic = 'technology') {
  const cacheKey = `news_${topic}`;
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TIME) return data;
  }

  try {
    const fetch = await fetchModule();
    
    if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY.length > 20) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${process.env.NEWS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const articles = data.articles.map(a => ({
            title: a.title,
            description: a.description?.substring(0, 200),
            source: a.source.name,
            url: a.url,
            publishedAt: a.publishedAt
          }));
          cache.set(cacheKey, { data: articles, timestamp: Date.now() });
          return articles;
        }
      } catch {}
    }
    
    // Fallback: Hacker News
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json();
    const top5 = storyIds.slice(0, 5);
    
    const stories = await Promise.all(
      top5.map(async (id) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = await storyRes.json();
        return {
          title: story.title,
          description: `${story.score} points | ${story.descendants || 0} comments`,
          source: 'Hacker News',
          url: story.url || `https://news.ycombinator.com/item?id=${id}`
        };
      })
    );
    
    cache.set(cacheKey, { data: stories, timestamp: Date.now() });
    return stories;
  } catch (error) {
    console.error('News fetch error:', error.message);
    return [];
  }
}

async function quickFact(query) {
  try {
    const fetch = await fetchModule();
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (data.extract) {
      return {
        title: data.title,
        summary: data.extract.substring(0, 500),
        url: data.content_urls?.desktop?.page
      };
    }
    return null;
  } catch {
    return null;
  }
}

module.exports = { searchWeb, getNews, quickFact };
