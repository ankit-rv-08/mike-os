require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── ROUTER LOGIC ─────────────────────────────────────────────────────────────
function isComplexQuery(input) {
  const complexKeywords = ['stock', 'invest', 'market', 'crypto', 'portfolio', 'advice', 'plan', 'strategy', 'optimize'];
  return complexKeywords.some(kw => input.toLowerCase().includes(kw));
}

function needsWebSearch(input) {
  const searchKeywords = ['news', 'latest', 'today', 'happening', 'who won', 'weather', 'current', 'update', 'search for'];
  return searchKeywords.some(kw => input.toLowerCase().includes(kw));
}

// ─── TOOLS ────────────────────────────────────────────────────────────────────
async function searchWeb(query) {
  const key = process.env.SERPER_API_KEY;
  if (!key || key === 'your_serper_key_here') return null;

  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query })
    });
    const data = await res.json();
    
    // Extract top 3 organic search results
    if (data.organic && data.organic.length > 0) {
      return data.organic.slice(0, 3).map(r => `Title: ${r.title}\nInfo: ${r.snippet}`).join('\n\n');
    }
    return "No relevant search results found.";
  } catch (error) {
    console.error("Serper API error:", error);
    return null;
  }
}

async function getStockData(symbol) {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key || key === 'your_alpha_vantage_key_here') return null;
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']).toFixed(2),
      change: parseFloat(quote['09. % change']).toFixed(2),
      high: parseFloat(quote['03. high']).toFixed(2),
      low: parseFloat(quote['04. low']).toFixed(2),
      volume: parseInt(quote['06. volume']).toLocaleString(),
    };
  } catch {
    return null;
  }
}

function extractStockSymbol(input) {
  const knownStocks = {
    'nvidia': 'NVDA', 'apple': 'AAPL', 'microsoft': 'MSFT', 'google': 'GOOGL', 
    'amazon': 'AMZN', 'tesla': 'TSLA', 'meta': 'META', 'tata': 'TCS.BSE', 'infosys': 'INFY'
  };
  const lower = input.toLowerCase();
  for (const [name, symbol] of Object.entries(knownStocks)) {
    if (lower.includes(name)) return symbol;
  }
  const tickerMatch = input.match(/\b[A-Z]{2,5}\b/);
  return tickerMatch ? tickerMatch[0] : null;
}

// ─── AI MODELS ────────────────────────────────────────────────────────────────
async function askGroq(input, conversationHistory = []) {
  const messages = [
    {
      role: "system",
      content: `You are MIKE, an autonomous personal AI system. Keep responses short and action-oriented. You are talking to Ankith.`
    },
    ...conversationHistory.slice(-6),
    { role: "user", content: input }
  ];
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    max_tokens: 512,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || "Done.";
}

async function askGroqPro(input, conversationHistory = [], context = {}) {
  let systemContent = `You are MIKE, an elite personal AI advisor inside MIKE OS.
You specialize in: market education, web research, deep strategy, and life optimization.
User: Ankith RV, 3rd year EEE student at NITK, developer, and founder.
Style: Teach like a mentor. Be direct and intelligent. Never say you're an AI. You are MIKE.`;

  // Inject Live Search Context
  if (context.searchData) {
    systemContent += `\n\nLIVE WEB SEARCH RESULTS:\n${context.searchData}\nUse this real-time information to answer the user accurately. Cite the news briefly.`;
  }

  // Inject Stock Context
  if (context.stockData) {
    systemContent += `\n\nREAL-TIME STOCK DATA:\nSymbol: ${context.stockData.symbol}\nPrice: $${context.stockData.price}\nChange Today: ${context.stockData.change}%`;
  }

  const messages = [
    { role: "system", content: systemContent },
    ...conversationHistory.slice(-6),
    { role: "user", content: input }
  ];
  
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || "Let me think about that.";
}

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────────────────
// Replace your processMessage function with this Triple-Brain logic
async function processMessage(input, conversationHistory = []) {
  const complex = isComplexQuery(input);
  let stockData = null;

  if (complex) {
    const symbol = extractStockSymbol(input);
    if (symbol) stockData = await getStockData(symbol);

    try {
      // Brain 1: Try Gemini First (Deep Thinking / Real-time)
      const response = await askGemini(input, conversationHistory, { stockData });
      return { response, brain: 'gemini', stockData };
    } catch (geminiError) {
      console.error("Gemini failed/rate-limited, falling back to High-IQ Fallback...", geminiError.message);
      
      try {
        // Brain 2: Fallback to Groq 70B or Mistral 
        // (Assuming askGroqPro is your 70B/Mistral fallback function)
        const response = await askGroqPro(input, conversationHistory, { stockData });
        return { response, brain: 'mistral-fallback', stockData };
      } catch (fallbackError) {
        return { response: "System overloaded. Both deep cores are currently offline.", brain: 'error', stockData: null };
      }
    }
  } else {
    // Brain 3: Groq 8B (Lightning fast reflexes for simple tasks)
    const response = await askGroq(input, conversationHistory);
    return { response, brain: 'groq-fast', stockData: null };
  }
}
module.exports = { processMessage };