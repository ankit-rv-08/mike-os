require("dotenv").config();
const { executeTask } = require("../brains/master-brain");
const fs = require('fs').promises;
const path = require('path');

// ─── MEMORY SYSTEM (Vercel-safe) ───────────────────────────────────────────
class MemorySystem {
  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    this.memoryPath = isProduction ? '/tmp/mike_memory.json' : path.join(__dirname, '../../data/memory.json');
    this.memory = { user: { name: "Ankith RV", goals: ["15 LPA Bangalore"] }, history: [] };
  }

  async init() {
    try {
      const data = await fs.readFile(this.memoryPath, 'utf8');
      this.memory = JSON.parse(data);
    } catch { await this.save(); }
  }

  async save() {
    const dir = path.dirname(this.memoryPath);
    await fs.mkdir(dir, { recursive: true }).catch(() => {});
    await fs.writeFile(this.memoryPath, JSON.stringify(this.memory, null, 2));
  }
}

const memory = new MemorySystem();

// ─── COMMAND PARSER ────────────────────────────────────────────────────────
function parseIntent(input) {
  const lower = input.toLowerCase();
  if (lower.includes("read file")) return "FILE_OPERATIONS";
  if (lower.includes("analyze") || lower.includes("stock")) return "STRATEGIC_RESEARCH";
  if (lower.includes("code") || lower.includes("dsa")) return "ENGINEERING_LOGIC";
  return "GENERAL_REFLEX";
}

// ─── MAIN PROCESSOR ────────────────────────────────────────────────────────
async function processMessage(input, conversationHistory = []) {
  if (!memory.initialized) await memory.init();

  const intent = parseIntent(input);
  
  try {
    // Firing the Master Brain (Groq/Gemini/Mistral Failover)
    const result = await executeTask(input, conversationHistory);

    // Contextual Memory Update
    this.memory?.history?.push({ q: input, a: result.text, t: Date.now() });
    if (this.memory?.history?.length > 50) this.memory.history.shift();
    await memory.save();

    return {
      response: result.text,
      brain: result.source,
      intent: intent,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Neural Link Error:", error);
    return { response: "Ankith, the link is dropping. Switching to local fail-safe...", brain: "LOCAL" };
  }
}

async function generateInsight({ lifeScore }) {
  if (lifeScore > 80) return "Momentum optimal. Execute DSA sets now.";
  return "System recovery required. Prioritize sleep/focus protocols.";
}

module.exports = { processMessage, generateInsight };