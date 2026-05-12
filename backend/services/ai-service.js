require("dotenv").config();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Global fetch handler for Mistral fallback (handles Node.js ESM/CJS compatibility)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DATA_DIR = path.join(__dirname, '../data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PERFORMANCE_FILE = path.join(DATA_DIR, 'performance.json');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const FINANCE_FILE = path.join(DATA_DIR, 'finance.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/**
 * routeBrain handles logic for deciding which model to use.
 * Added safety check to prevent "trim of undefined" crash.
 */
function routeBrain(input) {
  const safeInput = input || ""; // Fallback to empty string if undefined
  const lowerInput = safeInput.trim().toLowerCase();

  // Manual overrides
  if (lowerInput.startsWith('/ghost ') || lowerInput.startsWith('/deep ')) {
    return { 
      useGemini: true, 
      cleanInput: safeInput.replace(/^\/(ghost|deep)\s+/i, '').trim() 
    };
  }

  // Complexity detection
  const isLongPrompt = safeInput.split(' ').length > 25; 
  const complexVerbs = ['analyze', 'compare', 'summarize', 'derive', 'evaluate', 'explain why'];
  const domainTopics = ['stock', 'crypto', 'investment', 'algorithm', 'system design', 'leetcode', 'dsa'];
  
  const needsDeepThought = 
    complexVerbs.some(v => lowerInput.includes(v)) || 
    domainTopics.some(t => lowerInput.includes(t)) || 
    isLongPrompt;

  return { useGemini: needsDeepThought, cleanInput: safeInput };
}

function getSystemPrompt() {
  return `You are MIKE, Ankith RV's autonomous AI Operating System.
Ankith is a 3rd year EEE student at NITK Surathkal and founder of HUDRA.

CRITICAL: To execute system actions, you MUST append these tags at the end of your response:
1. Projects/Execution: [ADD_PROJECT: <Title> | <Description> | <Priority>]
2. Vitals/Logs: [ADD_PERFORMANCE: <Category> | <Hours>]
3. Calendar: [ADD_CALENDAR: <Day Number> | <Title>]
4. Finance: [ADD_EXPENSE: <Amount> | <Category>]
5. Update Vitals: [UPDATE_VITAL: <water/calories/steps/weight> | <New Total Number>]
6. Toggle Habit: [TOGGLE_HABIT: <Habit Name>]

Never say you are an AI. You are MIKE.`;
}

async function askGroq(input, conversationHistory = []) {
  const messages = [
    { role: "system", content: getSystemPrompt() }, 
    ...conversationHistory.slice(-6), 
    { role: "user", content: input }
  ];
  const completion = await groq.chat.completions.create({ 
    model: "llama-3.3-70b-versatile", 
    messages, 
    max_tokens: 1024, 
    temperature: 0.7 
  });
  return completion.choices[0]?.message?.content || "Done.";
}

async function askGemini(input, conversationHistory = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const historyText = conversationHistory.slice(-6).map(m => `${m.role === 'user' ? 'Ankith' : 'MIKE'}: ${m.content}`).join('\n');
  const fullPrompt = `${getSystemPrompt()}\n\nHistory:\n${historyText}\nAnkith: ${input}\nMIKE:`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

async function askMistral(input, conversationHistory = []) {
  const messages = [
    { role: "system", content: getSystemPrompt() }, 
    ...conversationHistory.slice(-6), 
    { role: "user", content: input }
  ];
  
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content || "Done.";
}

async function processMessage(rawInput, conversationHistory = []) {
  // Guard against undefined input causing crashes later
  const inputToProcess = rawInput || "System ping.";
  const { useGemini, cleanInput } = routeBrain(inputToProcess);
  
  let rawResponse;
  let finalBrain = useGemini ? 'gemini' : 'groq';

  try {
    if (useGemini) {
      try {
        rawResponse = await askGemini(cleanInput, conversationHistory);
      } catch (geminiError) {
        console.error("Gemini failed. Auto-falling back to Mistral.", geminiError.message);
        rawResponse = await askMistral(cleanInput, conversationHistory);
        finalBrain = 'mistral (fallback)';
      }
    } else {
      rawResponse = await askGroq(cleanInput, conversationHistory);
    }
  } catch (e) {
    console.error("Total Brain Failure:", e.message);
    return { response: `⚠️ Brain Link Failed: Check API Keys. (${e.message})`, brain: "system" };
  }

  let finalResponse = rawResponse;

  // --- DATA INTERCEPTORS ---

  // 1. ADD_PROJECT
  const projMatch = rawResponse.match(/\[ADD_PROJECT:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/);
  if (projMatch) {
    const db = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
    if (!db.tasks) db.tasks = [];
    db.tasks.push({ 
      id: Date.now().toString(), 
      title: projMatch[1].trim(), 
      desc: projMatch[2].trim(), 
      status: 'To Do', 
      priority: projMatch[3].trim() 
    });
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(db, null, 2));
    finalResponse = finalResponse.replace(projMatch[0], '').trim();
  }

  // 2. MOVE_PROJECT
  const moveMatch = rawResponse.match(/\[MOVE_PROJECT:\s*(.*?)\s*\|\s*(.*?)\]/);
  if (moveMatch) {
    const title = moveMatch[1].toLowerCase(); 
    const newStatus = moveMatch[2];
    const db = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
    db.tasks = db.tasks.map(t => t.title.toLowerCase().includes(title) ? { ...t, status: newStatus } : t);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(db, null, 2));
    finalResponse = finalResponse.replace(moveMatch[0], '').trim();
  }

  // 3. ADD_PERFORMANCE
  const perfMatch = rawResponse.match(/\[ADD_PERFORMANCE:\s*(.*?)\s*\|\s*([\d.]+)\]/);
  if (perfMatch) {
    const perf = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, 'utf-8') || '{"logs":[]}');
    if (!perf.logs) perf.logs = [];
    perf.logs.push({ 
      id: Date.now().toString(), 
      date: new Date().toISOString().split('T')[0], 
      category: perfMatch[1].trim(), 
      hours: parseFloat(perfMatch[2]) 
    });
    fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(perf, null, 2));
    finalResponse = finalResponse.replace(perfMatch[0], '').trim();
  }

  // 4. ADD_CALENDAR
  const calMatch = rawResponse.match(/\[ADD_CALENDAR:\s*(\d+)\s*\|\s*(.*?)\]/);
  if (calMatch) {
    const day = parseInt(calMatch[1]);
    const cal = JSON.parse(fs.readFileSync(CALENDAR_FILE, 'utf-8') || '{}');
    if (!cal[day]) cal[day] = { tasks: [], meetings: [], notes: "", progress: 0 };
    cal[day].tasks.push({ id: Date.now().toString(), title: calMatch[2].trim(), status: 'pending' });
    fs.writeFileSync(CALENDAR_FILE, JSON.stringify(cal, null, 2));
    finalResponse = finalResponse.replace(calMatch[0], '').trim();
  }

  // 5. ADD_EXPENSE
  const expMatch = rawResponse.match(/\[ADD_EXPENSE:\s*(\d+)\s*\|\s*(.*?)\]/);
  if (expMatch) {
    const fin = JSON.parse(fs.readFileSync(FINANCE_FILE, 'utf-8') || '{"income":[],"expenses":[]}');
    if (!fin.expenses) fin.expenses = [];
    fin.expenses.push({ 
      id: Date.now().toString(), 
      category: expMatch[2].trim(), 
      amount: parseInt(expMatch[1]), 
      color: '#ef4444' 
    });
    fs.writeFileSync(FINANCE_FILE, JSON.stringify(fin, null, 2));
    finalResponse = finalResponse.replace(expMatch[0], '').trim();
  }

  // 6. UPDATE_VITAL
  const vitalMatch = rawResponse.match(/\[UPDATE_VITAL:\s*(.*?)\s*\|\s*([\d.]+)\]/);
  if (vitalMatch) {
    const metric = vitalMatch[1].trim().toLowerCase();
    const val = parseFloat(vitalMatch[2]);
    const perf = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, 'utf-8') || '{"logs":[], "vitals": {}, "habits": []}');
    if (!perf.vitals) perf.vitals = {};
    perf.vitals[metric] = val;
    fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(perf, null, 2));
    finalResponse = finalResponse.replace(vitalMatch[0], '').trim();
  }

  // 7. TOGGLE_HABIT
  const habitMatch = rawResponse.match(/\[TOGGLE_HABIT:\s*(.*?)\]/);
  if (habitMatch) {
    const habitName = habitMatch[1].trim().toLowerCase();
    const perf = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, 'utf-8') || '{"logs":[], "vitals": {}, "habits": []}');
    if (perf.habits) {
      perf.habits = perf.habits.map(h => h.task.toLowerCase().includes(habitName) ? { ...h, done: !h.done } : h);
      fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(perf, null, 2));
    }
    finalResponse = finalResponse.replace(habitMatch[0], '').trim();
  }
  
  return { response: finalResponse, brain: finalBrain };
}

module.exports = { processMessage };