require("dotenv").config();
const Groq = require("groq-sdk");
const fs = require('fs').promises;
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const TASKS_FILE = path.join(__dirname, '../../data/tasks.json');

// ─── TOOL 1: WEB SEARCH ──────────────────────────────────────────────────────
async function performWebSearch(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey.includes('your_')) return null;

  console.log(`[MIKE] Searching the web for: "${query}"...`);
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query: query, search_depth: "basic", include_answer: true })
    });
    const data = await response.json();
    return data.answer || "Search completed.";
  } catch (err) {
    return null;
  }
}

// ─── TOOL 2: TASK EXECUTION ──────────────────────────────────────────────────
async function manageTask(intent, taskName = "") {
  try {
    let tasks = [];
    
    // 1. Safely read the file, creating it if it doesn't exist
    try {
      const data = await fs.readFile(TASKS_FILE, 'utf8');
      if (data.trim() !== "") {
        tasks = JSON.parse(data);
      }
    } catch (readError) {
      // If file doesn't exist, we just start with an empty array.
      if (readError.code !== 'ENOENT') {
        console.error("[MIKE] Error reading tasks:", readError);
      }
    }

    if (intent === 'create') {
      // Clean up the task name string (sometimes the LLM includes quotes)
      const cleanTaskName = taskName.replace(/^["']|["']$/g, '').trim();
      
      const newTask = { 
        id: Date.now(), 
        name: cleanTaskName, 
        status: 'pending', 
        date: new Date().toISOString() 
      };
      
      tasks.push(newTask);
      
      // Save the updated array back to the file
      await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
      console.log(`[MIKE] Task created: ${cleanTaskName}`);
      return `Task "${cleanTaskName}" has been successfully added to the system database.`;
    }
    
    if (intent === 'read') {
      if (tasks.length === 0) return "There are no pending tasks in the system.";
      // Format the output so MIKE can read it easily
      const taskList = tasks.map((t, index) => `${index + 1}. [${t.status.toUpperCase()}] ${t.name}`).join('\n');
      return "Current tasks in database:\n" + taskList;
    }
  } catch (error) {
    console.error("[MIKE] Task System Critical Error:", error);
    return "System Error: Failed to access or modify task database.";
  }
}
// ─── ROUTER & INTENT ENGINE ──────────────────────────────────────────────────
async function processMessage(input, conversationHistory = []) {
  let systemContent = `You are MIKE, an elite personal AI advisor inside MIKE OS.
ABOUT ANKITH: 3rd year EEE student at NITK Surathkal, Tech Lead at HUDRA. Goal: 15 LPA software job in Bangalore by Dec 2026.
YOUR STYLE: Direct, intelligent, mentor-like. Be concise. Never say you are an AI. You are MIKE.`;

  let activeBrain = "groq-70b";
  let contextData = "";

  const lowerInput = input.toLowerCase();

  // 1. Detect Web Search Intent
  if (lowerInput.match(/news|latest|today|happening|current|price|stock|market/)) {
    const searchResult = await performWebSearch(input);
    if (searchContext) {
      contextData += `\n\n[LIVE WEB DATA]:\n${searchResult}`;
      activeBrain = "groq-70b + web-search";
    }
  }

  // 2. Detect Task Creation Intent
  if (lowerInput.match(/create a task|remind me to|add task|new task/)) {
    // Extract everything after the keyword roughly
    const taskText = input.replace(/create a task|remind me to|add task|new task/i, '').trim();
    const taskResult = await manageTask('create', taskText);
    contextData += `\n\n[SYSTEM ACTION TAKEN]:\n${taskResult}`;
    activeBrain = "groq-70b + execution";
  }

  // 3. Detect Task Reading Intent
  if (lowerInput.match(/what are my tasks|show tasks|pending tasks/)) {
    const taskResult = await manageTask('read');
    contextData += `\n\n[SYSTEM DATA - PENDING TASKS]:\n${taskResult}`;
    activeBrain = "groq-70b + execution";
  }

  if (contextData) {
    systemContent += `\n\nUse the following system context to answer the user appropriately:${contextData}`;
  }

  // Execute Neural Processing
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...conversationHistory.slice(-6),
        { role: "user", content: input }
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return { 
      response: completion.choices[0]?.message?.content, 
      brain: activeBrain,
      stockData: null 
    };
  } catch (error) {
    return { response: "⚠️ Neural link unstable.", brain: "error" };
  }
}

module.exports = { processMessage };