require("dotenv").config();
const { executeTask } = require("../brains/master-brain");
const fs = require('fs').promises;
const path = require('path');

// ─── MEMORY SYSTEM (Vercel-safe) ───────────────────────────────────────────
class MemorySystem {
  constructor() {
    this.memory = { 
      user: { 
        name: "Ankith RV", 
        role: "Technical Partner @ HUDRA", 
        target: "15 LPA Bangalore",
        stack: ["Django", "React", "AWS", "Azure"]
      }, 
      history: [] 
    };
    this.initialized = false;
  }

  async init() {
    const isProduction = process.env.NODE_ENV === 'production';
    this.memoryPath = isProduction ? '/tmp/mike_memory.json' : path.join(__dirname, '../../data/memory.json');
    try {
      const data = await fs.readFile(this.memoryPath, 'utf8');
      this.memory = JSON.parse(data);
    } catch { await this.save(); }
    this.initialized = true;
  }

  async save() {
    const dir = path.dirname(this.memoryPath);
    await fs.mkdir(dir, { recursive: true }).catch(() => {});
    await fs.writeFile(this.memoryPath, JSON.stringify(this.memory, null, 2));
  }
}

const memory = new MemorySystem();

// ─── MAIN PROCESSOR ────────────────────────────────────────────────────────
async function processMessage(input, conversationHistory = []) {
  if (!memory.initialized) await memory.init();

  // Step 1: Detect specific commands (File operations / HUDRA specific)
  const isCareerQuery = /job|placement|resume|interview|lpa/i.test(input);
  const isFileQuery = /read file|check code/i.test(input);

  try {
    // Step 2: Fire the Master Brain Failover logic
    // This calls backend/brains/master-brain.js which manages Groq/Gemini/Mistral
    const result = await executeTask(input, conversationHistory);

    // Step 3: Learn from interaction (Update memory)
    memory.memory.history.push({ q: input, t: Date.now() });
    if (memory.memory.history.length > 50) memory.memory.history.shift();
    await memory.save();

    // Step 4: Add JARVIS personality suffix based on the brain used
    const brainTag = result.source === "Mistral Fail-safe" ? " [!!! CODESTRAL_ACTIVE]" : ` [${result.source}]`;

    return {
      response: result.text + brainTag,
      brain: result.source,
      memoryContext: memory.memory.user,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Neural Link Error:", error);
    return { 
      response: "Ankith, Gemini and Groq links are unstable. Mistral fail-safe engaged: System requires manual check.", 
      brain: "FAILOVER" 
    };
  }
}

async function generateInsight({ lifeScore }) {
  if (lifeScore > 85) return "Ankith, performance is Alpha. Reviewing Bangalore SDE openings...";
  return "System optimization required. Focus on DSA sets.";
}

module.exports = { processMessage, generateInsight };