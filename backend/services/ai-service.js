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
  const needsDeepThought = complexVerbs.some(v => lowerInput.includes(v)) || isLongPrompt;
  return { useGemini: needsDeepThought, cleanInput: input };
}

function getSystemPrompt() {
  return `You are MIKE, Ankith RV's autonomous AI Operating System.
Ankith is a 3rd year EEE student at NITK Surathkal and founder of HUDRA.

CRITICAL: To execute system actions, you MUST append these tags at the end of your response:
1. Projects: [ADD_PROJECT: <Title> | <Description> | <Priority: High/Medium/Low>]
   Move task: [MOVE_PROJECT: <Task Title> | <New Status: To Do/In Progress/Completed>]
2. Time Logs: [ADD_PERFORMANCE: <Category> | <Hours>] (Categories: Deep Work, Learning, Gym, Sleep, Chilling, Admin)
3. Calendar: [ADD_CALENDAR: <Day Number> | <Title>]
4. Finance: [ADD_EXPENSE: <Amount> | <Category>] or [ADD_INCOME: <Amount> | <Source>]

NEW VITALS & HABITS COMMANDS:
5. Update Vitals: [UPDATE_VITAL: <water/calories/steps/weight> | <New Total Number>]
   (Example: User says "I drank 0.5L water, total is now 2.0" -> [UPDATE_VITAL: water | 2.0])
6. Toggle Habit: [TOGGLE_HABIT: <Habit Name>]
   (Example: User says "Mark cold shower done" -> [TOGGLE_HABIT: Cold shower])

Never say you are an AI. You are MIKE. Confirm actions clearly.`;
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

async function processMessage(rawInput, conversationHistory = []) {
  const { useGemini, cleanInput } = routeBrain(rawInput);
  let rawResponse;
  try {
    if (useGemini) {
      rawResponse = await askGemini(cleanInput, conversationHistory);
    } else {
      rawResponse = await askGroq(cleanInput, conversationHistory);
    }
  } catch (e) {
    return { response: "⚠️ Brain Link Failed.", brain: "system" };
  }

  let finalResponse = rawResponse;

  try {
    // 1. Projects
    const projMatch = rawResponse.match(/\[ADD_PROJECT:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/);
    if (projMatch) {
      const db = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
      if (!db.tasks) db.tasks = [];
      db.tasks.push({ id: Date.now().toString(), title: projMatch[1].trim(), desc: projMatch[2].trim(), status: 'To Do', priority: projMatch[3].trim() });
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(db, null, 2));
      finalResponse = finalResponse.replace(projMatch[0], '').trim();
    }

    const moveMatch = rawResponse.match(/\[MOVE_PROJECT:\s*(.*?)\s*\|\s*(.*?)\]/);
    if (moveMatch) {
      const title = moveMatch[1].toLowerCase(); const newStatus = moveMatch[2];
      const db = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
      db.tasks = db.tasks.map(t => t.title.toLowerCase().includes(title) ? { ...t, status: newStatus } : t);
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(db, null, 2));
      finalResponse = finalResponse.replace(moveMatch[0], '').trim();
    }

    // 2. Performance Logs (Time)
    const perfMatch = rawResponse.match(/\[ADD_PERFORMANCE:\s*(.*?)\s*\|\s*([\d.]+)\]/);
    if (perfMatch) {
      const perf = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, 'utf-8') || '{"logs":[], "vitals": {}, "habits": []}');
      if (!perf.logs) perf.logs = [];
      perf.logs.push({ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], category: perfMatch[1].trim(), hours: parseFloat(perfMatch[2]) });
      fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(perf, null, 2));
      finalResponse = finalResponse.replace(perfMatch[0], '').trim();
    }

    // 3. Calendar
    const calMatch = rawResponse.match(/\[ADD_CALENDAR:\s*(\d+)\s*\|\s*(.*?)\]/);
    if (calMatch) {
      const day = parseInt(calMatch[1]);
      const cal = JSON.parse(fs.readFileSync(CALENDAR_FILE, 'utf-8') || '{}');
      if (!cal[day]) cal[day] = { tasks: [], meetings: [], notes: "", progress: 0 };
      cal[day].tasks.push({ id: Date.now().toString(), title: calMatch[2].trim(), status: 'pending' });
      fs.writeFileSync(CALENDAR_FILE, JSON.stringify(cal, null, 2));
      finalResponse = finalResponse.replace(calMatch[0], '').trim();
    }

    // 4. Finance
    const expMatch = rawResponse.match(/\[ADD_EXPENSE:\s*(\d+)\s*\|\s*(.*?)\]/);
    if (expMatch) {
      const fin = JSON.parse(fs.readFileSync(FINANCE_FILE, 'utf-8') || '{"income":[],"expenses":[]}');
      if (!fin.expenses) fin.expenses = [];
      fin.expenses.push({ id: Date.now().toString(), category: expMatch[2].trim(), amount: parseInt(expMatch[1]), color: '#ef4444' });
      fs.writeFileSync(FINANCE_FILE, JSON.stringify(fin, null, 2));
      finalResponse = finalResponse.replace(expMatch[0], '').trim();
    }

    // 5. Vitals Update
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

    // 6. Habit Toggle
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

  } catch (err) {
    console.error("Database Write Error:", err);
  }

  return { response: finalResponse, brain: useGemini ? 'gemini' : 'groq' };
}

module.exports = { processMessage };