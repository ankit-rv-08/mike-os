require("dotenv").config();
const Groq = require("groq-sdk");
const fs = require('fs').promises;
const path = require('path');
const { searchWeb, getNews, quickFact } = require('./webService');
const { readProjectFile, listProjectFiles, writeProjectFile, searchInFiles } = require('./fileService');
const { getRepoInfo, searchRepos, getRecentCommits } = require('./githubService');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── MEMORY SYSTEM (Vercel-safe: uses /tmp in production) ─────────────────
class MemorySystem {
  constructor() {
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    this.memoryPath = isVercel 
      ? '/tmp/mike_memory.json'
      : path.join(__dirname, '..', '..', 'data', 'mike_memory.json');
    
    this.memory = {
      user: {
        name: "Ankith RV",
        education: "3rd year EEE, NITK Surathkal",
        interests: [],
        goals: [],
        preferences: {},
        projects: {}
      },
      knowledge: {
        conversations: [],
        learnedFacts: [],
        fileCache: {}
      },
      stats: {
        totalInteractions: 0,
        lastActive: null,
        commandsRun: 0
      }
    };
    this.initialized = false;
  }

  async init() {
    try {
      const dir = path.dirname(this.memoryPath);
      await fs.mkdir(dir, { recursive: true }).catch(() => {});
      const data = await fs.readFile(this.memoryPath, 'utf8');
      this.memory = { ...this.memory, ...JSON.parse(data) };
    } catch {
      await this.save();
    }
    this.initialized = true;
  }

  async save() {
    try {
      const dir = path.dirname(this.memoryPath);
      await fs.mkdir(dir, { recursive: true }).catch(() => {});
      await fs.writeFile(this.memoryPath, JSON.stringify(this.memory, null, 2));
    } catch (err) {
      console.error('Memory save failed:', err.message);
    }
  }

  async learn(input, response, context = {}) {
    this.memory.stats.totalInteractions++;
    this.memory.stats.lastActive = new Date().toISOString();
    
    this.memory.knowledge.conversations.push({
      timestamp: new Date().toISOString(),
      input: input.substring(0, 300),
      topics: context.topics || [],
      actions: context.actions || []
    });

    if (this.memory.knowledge.conversations.length > 200) {
      this.memory.knowledge.conversations = 
        this.memory.knowledge.conversations.slice(-200);
    }

    if (input.toLowerCase().includes('my project is')) {
      const projectName = input.split('my project is')[1]?.split(/[.,!?]/)[0]?.trim();
      if (projectName) {
        this.memory.user.projects[projectName] = {
          mentioned: new Date().toISOString(),
          context: input
        };
      }
    }

    await this.save();
  }

  getContext() {
    return {
      user: this.memory.user,
      recentTopics: this.memory.knowledge.conversations
        .slice(-10)
        .map(c => c.topics)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i),
      totalInteractions: this.memory.stats.totalInteractions,
      recentConversations: this.memory.knowledge.conversations.slice(-3)
    };
  }
}

const memory = new MemorySystem();

// ─── COMMAND PARSER ────────────────────────────────────────────────────────
function parseCommand(input) {
  const commands = {
    readFile: /read\s+(?:the\s+)?file\s+["']?([^"']+)["']?|show\s+(?:me\s+)?(?:the\s+)?(?:contents?\s+of\s+)?["']?([^"']+)["']?/i,
    listFiles: /list\s+(?:all\s+|my\s+)?(?:project\s+)?files|show\s+(?:me\s+)?(?:all\s+|my\s+)?(?:project\s+)?files|what\s+(?:are\s+)?(?:my\s+)?files/i,
    searchInFiles: /search\s+(?:in\s+)?files?\s+for\s+(.+)|find\s+(.+)\s+in\s+(?:my\s+)?files/i,
    searchRepo: /search\s+(?:my\s+)?(?:github|repo)\s+(?:for\s+)?(.+)|find\s+in\s+(?:my\s+)?repo\s+(.+)/i,
    githubInfo: /(?:show|get|what\s+(?:is|are))\s+(?:my\s+)?(?:github|repo)\s+(?:info|stats|status|details)/i,
    recentCommits: /(?:show|get)\s+(?:recent\s+)?commits|what\s+(?:are|were)\s+(?:the\s+)?(?:recent|latest)\s+commits/i,
    createFile: /create\s+(?:a\s+)?file\s+["']?([^"']+)["']?(?:\s+with\s+(.+))?|write\s+(?:a\s+)?file\s+["']?([^"']+)["']?/i
  };

  for (const [action, pattern] of Object.entries(commands)) {
    const match = input.match(pattern);
    if (match) {
      return {
        action,
        params: match.slice(1).filter(Boolean),
        isCommand: true
      };
    }
  }

  return { isCommand: false };
}

// ─── STOCK DATA ────────────────────────────────────────────────────────────
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
    'nvidia': 'NVDA', 'nvda': 'NVDA',
    'apple': 'AAPL', 'aapl': 'AAPL',
    'microsoft': 'MSFT', 'msft': 'MSFT',
    'google': 'GOOGL', 'googl': 'GOOGL', 'alphabet': 'GOOGL',
    'amazon': 'AMZN', 'amzn': 'AMZN',
    'tesla': 'TSLA', 'tsla': 'TSLA',
    'meta': 'META', 'facebook': 'META',
    'netflix': 'NFLX', 'nflx': 'NFLX',
    'tata': 'TCS.BSE', 'infosys': 'INFY',
    'reliance': 'RELIANCE.BSE', 'zomato': 'ZOMATO.BSE',
  };

  const lower = input.toLowerCase();
  for (const [name, symbol] of Object.entries(knownStocks)) {
    if (lower.includes(name)) return symbol;
  }

  const tickerMatch = input.match(/\b[A-Z]{2,5}\b/);
  return tickerMatch ? tickerMatch[0] : null;
}

// ─── ROUTER ────────────────────────────────────────────────────────────────
function analyzeQuery(input) {
  const lower = input.toLowerCase();
  
  const topics = {
    stocks: ['stock', 'invest', 'market', 'crypto', 'bitcoin', 'portfolio', 'nvidia', 'apple', 'tesla', 'trading'],
    coding: ['code', 'function', 'refactor', 'debug', 'architecture', 'react', 'node', 'javascript', 'python', 'api', 'component'],
    productivity: ['plan', 'goal', 'habit', 'routine', 'focus', 'improve', 'life', 'schedule', 'deadline'],
    research: ['explain', 'why', 'how', 'what is', 'research', 'analyze', 'compare', 'difference'],
    news: ['news', 'latest', 'today', 'happening', 'current', 'recent', 'update'],
    personal: ['my', 'remember', 'preference', 'about me', 'ankith'],
    files: ['file', 'read', 'write', 'create', 'folder', 'directory', 'project files'],
    github: ['github', 'repo', 'repository', 'commit', 'push', 'pull', 'branch']
  };

  const detected = [];
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(kw => lower.includes(kw))) {
      detected.push(topic);
    }
  }

  return {
    topics: detected,
    isComplex: detected.length > 0 || input.length > 50,
    needsSearch: detected.includes('research') || detected.includes('news'),
    needsFiles: detected.includes('files'),
    needsGithub: detected.includes('github'),
    needsContext: detected.includes('personal')
  };
}

// ─── FAST BRAIN ────────────────────────────────────────────────────────────
async function askGroqFast(input, conversationHistory = []) {
  const messages = [
    {
      role: "system",
      content: `You are MIKE, a sharp personal AI assistant inside MIKE OS. 
You help with: creating tasks, logging health data, checking progress, quick answers. 
Keep responses short and action-oriented. User is Ankith.
You have access to his files and projects.
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

// ─── MAIN BRAIN ────────────────────────────────────────────────────────────
async function askGroqSmart(input, conversationHistory = [], context = {}) {
  const memoryContext = context.memory || {};
  
  let systemContent = `You are MIKE, an elite personal AI advisor inside MIKE OS.
Powered by Llama 3.3 70B intelligence.

YOUR CAPABILITIES:
- Real-time stock analysis and market education
- Code review, debugging, architecture advice
- File system access to user's projects
- GitHub repository analysis
- Web search for current information
- Personal memory of user preferences

USER PROFILE:
Name: ${memoryContext.user?.name || 'Ankith RV'}
Education: ${memoryContext.user?.education || 'Student at NITK Surathkal'}
Projects: ${Object.keys(memoryContext.user?.projects || {}).join(', ') || 'No projects tracked yet'}
Recent topics: ${memoryContext.recentTopics?.join(', ') || 'General assistance'}
Total conversations: ${memoryContext.totalInteractions || 0}

${context.stockData ? `📈 LIVE MARKET DATA:
${context.stockData.symbol}: $${context.stockData.price}
Change Today: ${context.stockData.change}%
Day Range: $${context.stockData.low} - $${context.stockData.high}
Volume: ${context.stockData.volume}` : ''}

${context.news && context.news.length > 0 ? `📰 LATEST NEWS:
${context.news.map(n => `• ${n.title}`).join('\n')}` : ''}

${context.webResults?.abstract ? `🔍 WEB SEARCH:
${context.webResults.abstract}` : ''}

${context.fileContents ? `📁 FILE CONTENTS (${context.fileName}):
\`\`\`
${context.fileContents}
\`\`\`` : ''}

${context.fileList ? `📂 PROJECT FILES:
${context.fileList.map(f => `• ${f.name} (${f.type})`).join('\n')}` : ''}

${context.githubInfo ? `🔗 GITHUB:
${JSON.stringify(context.githubInfo, null, 2)}` : ''}

RESPONSE STYLE:
- Mentor tone: teach, don't just tell
- Actionable insights: always suggest next steps
- Context-aware: reference user's projects and preferences
- Practical: give working code, real examples
- Never say you're an AI. You are MIKE.`;

  const messages = [
    { role: "system", content: systemContent },
    ...conversationHistory.slice(-10),
    { role: "user", content: input }
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 2048,
    temperature: 0.6,
  });

  return completion.choices[0]?.message?.content || "Let me analyze that...";
}

// ─── MAIN PROCESSOR ────────────────────────────────────────────────────────
async function processMessage(input, conversationHistory = []) {
  if (!memory.initialized) await memory.init();

  const command = parseCommand(input);
  let commandResult = null;

  if (command.isCommand) {
    try {
      switch (command.action) {
        case 'readFile':
          const fileName = command.params[0];
          const fileData = await readProjectFile(fileName);
          commandResult = {
            fileContents: fileData.contents,
            fileName: fileName,
            action: 'file_read'
          };
          break;
        
        case 'listFiles':
          const files = await listProjectFiles();
          commandResult = {
            fileList: files,
            action: 'file_list'
          };
          break;
        
        case 'searchInFiles':
          const searchQuery = command.params[0];
          const searchResults = await searchInFiles(searchQuery);
          commandResult = {
            searchResults,
            action: 'file_search'
          };
          break;
        
        case 'searchRepo':
          const searchTerm = command.params[0];
          const repos = await searchRepos(searchTerm);
          commandResult = {
            githubInfo: repos,
            action: 'github_search'
          };
          break;
        
        case 'githubInfo':
          const repoInfo = await getRepoInfo();
          commandResult = {
            githubInfo: repoInfo,
            action: 'github_info'
          };
          break;
        
        case 'recentCommits':
          const commits = await getRecentCommits();
          commandResult = {
            githubInfo: { recentCommits: commits },
            action: 'github_commits'
          };
          break;
        
        case 'createFile':
          const newFileName = command.params[0];
          const content = command.params[1] || '';
          await writeProjectFile(newFileName, content);
          commandResult = {
            action: 'file_created',
            fileName: newFileName
          };
          break;
      }
    } catch (error) {
      console.error('Command error:', error.message);
      commandResult = { error: error.message };
    }
  }

  const analysis = analyzeQuery(input);
  let stockData = null;
  let news = null;
  let webResults = null;

  if (analysis.topics.includes('stocks') || analysis.needsSearch) {
    const symbol = extractStockSymbol(input);
    if (symbol) stockData = await getStockData(symbol);
  }

  if (analysis.needsSearch) {
    [news, webResults] = await Promise.all([
      getNews(analysis.topics[0] || 'general'),
      searchWeb(input)
    ]);
    
    if (!webResults?.abstract && (input.toLowerCase().startsWith('what is') || input.toLowerCase().startsWith('who is'))) {
      const factQuery = input.replace(/^(what|who) is /i, '').trim();
      const fact = await quickFact(factQuery);
      if (fact) {
        webResults = {
          abstract: fact.summary,
          relatedTopics: [],
          source: 'Wikipedia',
          url: fact.url
        };
      }
    }
  }

  const memoryContext = memory.getContext();

  const context = {
    stockData,
    news,
    webResults,
    memory: memoryContext,
    ...commandResult
  };

  let response;
  if (analysis.isComplex || command.isCommand) {
    response = await askGroqSmart(input, conversationHistory, context);
  } else {
    response = await askGroqFast(input, conversationHistory);
  }

  await memory.learn(input, response, {
    topics: analysis.topics,
    actions: command.isCommand ? [command.action] : []
  });

  return {
    response,
    brain: (analysis.isComplex || command.isCommand) ? 'groq-smart' : 'groq-fast',
    data: { stockData, news, webResults, ...commandResult },
    command: command.isCommand ? command.action : null
  };
}

async function generateInsight({ lifeScore }) {
  if (lifeScore >= 80) return "Strong execution. Protect momentum with focused mornings.";
  if (lifeScore >= 60) return "Solid baseline. Improve sleep and consistency for stronger output.";
  return "Recovery mode. Finish essentials and rebuild consistency.";
}

module.exports = { processMessage, generateInsight };