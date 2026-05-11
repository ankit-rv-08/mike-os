require("dotenv").config();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DATA_DIR = path.join(__dirname, '../data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PERFORMANCE_FILE = path.join(DATA_DIR, 'performance.json');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const FINANCE_FILE = path.join(DATA_DIR, 'finance.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function routeBrain(input) {
  const lowerInput = input.trim().toLowerCase();
  if (lowerInput.startsWith('/ghost ') || lowerInput.startsWith('/deep ')) {
    return { useGemini: true, cleanInput: input.replace(/^\/(ghost|deep)\s+/i, '').trim() };
  }
  const isLongPrompt = input.split(' ').length > 25; 
  const complexVerbs = ['analyze', 'compare', 'summarize', 'derive', 'evaluate', 'explain why'];
  const domainTopics = ['stock', 'crypto', 'investment', 'algorithm', 'system design', 'leetcode', 'dsa'];
  const needsDeepThought = complexVerbs.some(v => lowerInput.includes(v)) || domainTopics.some(t => lowerInput.includes(t)) || isLongPrompt;
  return { useGemini: needsDeepThought, cleanInput: input };
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
  const messages = [{ role: "system", content: getSystemPrompt() }, ...conversationHistory.slice(-6), { role: "user", content: input }];
  const completion = await groq.chat.completions.create({ model: "llama-3.3-70b-versatile", messages, max_tokens: 1024, temperature: 0.7 });
  return completion.choices[0]?.message?.content || "Done.";
}

async function askGemini(input, conversationHistory = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const historyText = conversationHistory.slice(-6).map(m => `${m.role === 'user' ? 'Ankith' : 'MIKE'}: ${m.content}`).join('\n');
  const fullPrompt = `${getSystemPrompt()}\n\nHistory:\n${historyText}\nAnkith: ${input}\nMIKE:`;
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// THE NEW MISTRAL FALLBACK
async function askMistral(input, conversationHistory = []) {
  const messages = [{ role: "system", content: getSystemPrompt() }, ...conversationHistory.slice(-6), { role: "user", content: input }];
  const fetch = (await import('node-fetch')).default;
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
  const { useGemini, cleanInput } = routeBrain(rawInput);
  
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

  // 1. ADD_PROJECT
  const projMatch = rawResponse.match(/\[ADD_PROJECT:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/);
  if (projMatch) {
    const db = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
    if (!db.tasks) db.tasks = [];
    db.tasks.push({ id: Date.now().toString(), title: projMatch[1].trim(), desc: projMatch[2].trim(), status: 'To Do', priority: projMatch[3].trim() });
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(db, null, 2));
    finalResponse = finalResponse.replace(projMatch[0], '').trim();
  }

  // ... (Keep the rest of your interceptors: MOVE_PROJECT, ADD_PERFORMANCE, CALENDAR, FINANCE, VITAL, HABIT exactly as they are) ...
  
  return { response: finalResponse, brain: finalBrain };
}

module.exports = { processMessage };