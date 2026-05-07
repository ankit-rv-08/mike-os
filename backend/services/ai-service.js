require("dotenv").config();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── ROUTER — decides which brain to use ─────────────────────────────────────

function isComplexQuery(input) {
  const complexKeywords = [
    'stock', 'invest', 'market', 'crypto', 'bitcoin', 'ethereum', 'portfolio',
    'should i', 'advice', 'recommend', 'analyze', 'analysis', 'research',
    'explain', 'why', 'how does', 'what is', 'teach', 'learn',
    'news', 'latest', 'today', 'happening', 'compare',
    'plan', 'strategy', 'goal', 'improve', 'optimize'
  ];
  const lower = input.toLowerCase();
  return complexKeywords.some(kw => lower.includes(kw));
}

// ─── FAST BRAIN — Groq LLaMA 8B for simple tasks ────────────────────────────

async function askGroq(input, conversationHistory = []) {
  const messages = [
    {
      role: "system",
      content: `You are MIKE, a sharp personal AI assistant built into MIKE OS — a personal operating system for high-performance living. 
      
You help with: creating tasks, logging health data, checking progress, quick answers, and daily management.

Keep responses concise and action-oriented. You are talking to Ankith, a 3rd year engineering student and developer.
If the user wants to create a task, confirm it clearly.
If they ask about their day/progress, give a motivating summary.
Never say you're an AI. You are MIKE.`
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

// ─── MAIN BRAIN — Gemini 1.5 Pro for complex reasoning ───────────────────────

async function askGemini(input, conversationHistory = [], context = {}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let systemContext = `You are MIKE, an elite personal AI assistant and life advisor inside MIKE OS.

You specialize in: stock market education, financial advice for beginners, deep research, strategic planning, and life optimization.

User profile: Ankith RV, 3rd year EEE student at NITK, developer, building startups, learning investing as a beginner.

Your style:
- Teach like a mentor, not a textbook
- Give actionable insights, not just information  
- For stocks: always explain WHY, give beginner context, mention risks
- Be direct and intelligent
- Never say you're an AI. You are MIKE.`;

  if (context.stockData) {
    systemContext += `\n\nReal-time stock data available:\n${JSON.stringify(context.stockData, null, 2)}`;
  }

  if (context.news) {
    systemContext += `\n\nLatest news context:\n${context.news}`;
  }

  const historyText = conversationHistory.slice(-6)
    .map(m => `${m.role === 'user' ? 'Ankith' : 'MIKE'}: ${m.content}`)
    .join('\n');

  const fullPrompt = `${systemContext}

${historyText ? `Recent conversation:\n${historyText}\n` : ''}
Ankith: ${input}
MIKE:`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// ─── STOCK DATA — Alpha Vantage ───────────────────────────────────────────────

async function getStockData(symbol) {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key || key === 'your_alpha_vantage_key_here') {
    return null;
  }

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

// ─── EXTRACT STOCK SYMBOL from message ───────────────────────────────────────

function extractStockSymbol(input) {
  const knownStocks = {
    'nvidia': 'NVDA', 'nvda': 'NVDA',
    'apple': 'AAPL', 'aapl': 'AAPL',
    'microsoft': 'MSFT', 'msft': 'MSFT',
    'google': 'GOOGL', 'googl': 'GOOGL', 'alphabet': 'GOOGL',
    'amazon': 'AMZN', 'amzn': 'AMZN',
    'tesla': 'TSLA', 'tsla': 'TSLA',
    'meta': 'META', 'facebook': 'META',
    'netflix': 'NFLX', 'nflx': 'NFLX',
    'tata': 'TCS.BSE', 'infosys': 'INFY', 'reliance': 'RELIANCE.BSE',
    'zomato': 'ZOMATO.BSE',
  };

  const lower = input.toLowerCase();
  for (const [name, symbol] of Object.entries(knownStocks)) {
    if (lower.includes(name)) return symbol;
  }

  const tickerMatch = input.match(/\b[A-Z]{2,5}\b/);
  return tickerMatch ? tickerMatch[0] : null;
}

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────────────────

async function processMessage(input, conversationHistory = []) {
  const complex = isComplexQuery(input);
  let stockData = null;

  if (complex) {
    const symbol = extractStockSymbol(input);
    if (symbol) {
      stockData = await getStockData(symbol);
    }
    const response = await askGemini(input, conversationHistory, { stockData });
    return { response, brain: 'gemini', stockData };
  } else {
    const response = await askGroq(input, conversationHistory);
    return { response, brain: 'groq', stockData: null };
  }
}

async function generateInsight({ lifeScore }) {
  if (lifeScore >= 80) return "Strong execution. Protect momentum with focused mornings.";
  if (lifeScore >= 60) return "Solid baseline. Improve sleep and consistency for stronger output.";
  return "Recovery mode. Finish essentials and rebuild consistency.";
}

module.exports = { processMessage, generateInsight };