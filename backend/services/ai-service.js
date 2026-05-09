require("dotenv").config();
const Groq = require("groq-sdk");
const fs = require('fs').promises;
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const TASKS_FILE = path.join(__dirname, '../../data/tasks.json');
const CALENDAR_FILE = path.join(__dirname, '../../data/calendar.json');

async function checkGitHubActivity() {
  const token = process.env.GITHUB_TOKEN;
  const username = "ankit-rv-08"; 
  if (!token || token.includes('your_')) return "Token missing.";
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: { "Authorization": `token ${token}`, "User-Agent": "MIKE-OS" }
    });
    if (!response.ok) return "GitHub Auth Failed. Token might be expired.";
    const events = await response.json();
    const today = new Date().toISOString().split('T')[0];
    const todaysPushes = events.filter(e => e.type === 'PushEvent' && e.created_at.startsWith(today));
    return todaysPushes.length > 0 ? `Push count today: ${todaysPushes.length}` : "No commits found for today.";
  } catch (err) { return "GitHub API Error."; }
}

async function manageData(type, intent, text = "") {
  const FILE = type === 'task' ? TASKS_FILE : CALENDAR_FILE;
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    let items = [];
    try { items = JSON.parse(await fs.readFile(FILE, 'utf8')); } catch (e) {}

    if (intent === 'create') {
      items.push({ id: Date.now(), title: text, type: type === 'task' ? 'task' : 'meeting', status: 'pending', start_time: new Date().toISOString() });
      await fs.writeFile(FILE, JSON.stringify(items, null, 2));
      return `Added to ${type}s.`;
    }
  } catch (error) { return "File error."; }
}

async function processMessage(input, conversationHistory = []) {
  let systemContent = `You are MIKE, Ankith's elite JARVIS OS. Be direct.`;
  let activeBrain = "groq-70b";
  let contextData = "";
  const lowerInput = input.toLowerCase();

  try {
    if (lowerInput.match(/github|commit/)) {
      const git = await checkGitHubActivity();
      contextData += `\n[GITHUB]: ${git}`;
      activeBrain = "groq + github";
    }
    if (lowerInput.match(/task|schedule|meeting/)) {
      const res = await manageData(lowerInput.includes('task') ? 'task' : 'calendar', 'create', input);
      contextData += `\n[ACTION]: ${res}`;
      activeBrain = "groq + execution";
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemContent + contextData }, ...conversationHistory.slice(-6), { role: "user", content: input }],
      max_tokens: 500,
    });

    return { response: completion.choices[0]?.message?.content, brain: activeBrain };
  } catch (error) {
    return { response: "Neural link error.", brain: "error" };
  }
}

module.exports = { processMessage };