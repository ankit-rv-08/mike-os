require("dotenv").config();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Redis } = require("@upstash/redis");

// Initialize Brains and Memory
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Master System Prompt
const SYSTEM_PROMPT = `You are MIKE, an autonomous AI operating system. You are Ankith's JARVIS.
ABOUT ANKITH: 3rd year EEE student at NITK Surathkal. Tech Lead at HUDRA. Goal: 15 LPA software job in Bangalore by Dec 2026.
YOUR CAPABILITIES: Expert in DSA, system design, full-stack, and personal productivity.
YOUR STYLE: Direct, concise, action-oriented. Talk like a sharp mentor. NEVER say "I'm an AI". You are MIKE.`;

// ─── ROUTER LOGIC ─────────────────────────────────────────────
function requiresDeepThinking(input) {
  const complexKeywords = ['plan', 'analyze', 'strategy', 'code', 'debug', 'explain', 'why', 'research', 'dsa', 'system design'];
  const lowerInput = input.toLowerCase();
  return complexKeywords.some(kw => lowerInput.includes(kw));
}

// ─── MEMORY MANAGEMENT ─────────────────────────────────────────
async function getMemory(sessionId) {
  try {
    const memory = await redis.lrange(`session:${sessionId}`, 0, 9); // Get last 10 messages
    return memory ? memory.reverse() : [];
  } catch (error) {
    console.error("Memory retrieval failed:", error);
    return [];
  }
}

async function saveToMemory(sessionId, role, content) {
  try {
    await redis.lpush(`session:${sessionId}`, JSON.stringify({ role, content }));
    await redis.ltrim(`session:${sessionId}`, 0, 19); // Keep only last 20 messages to save space
  } catch (error) {
    console.error("Memory save failed:", error);
  }
}

// ─── GROQ (FAST BRAIN) ─────────────────────────────────────────
async function askGroq(input, history) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(msg => (typeof msg === 'string' ? JSON.parse(msg) : msg)),
    { role: "user", content: input }
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || "Command executed.";
}

// ─── GEMINI (DEEP BRAIN) ───────────────────────────────────────
async function askGemini(input, history) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  let formattedHistory = history
    .map(msg => typeof msg === 'string' ? JSON.parse(msg) : msg)
    .map(msg => `${msg.role === 'user' ? 'Ankith' : 'MIKE'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${SYSTEM_PROMPT}\n\nRecent context:\n${formattedHistory}\n\nAnkith: ${input}\nMIKE:`;
  
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// ─── MAIN ENTRY POINT ─────────────────────────────────────────
async function processMessage(input, sessionId = "default") {
  // 1. Fetch past memory
  const history = await getMemory(sessionId);

  // 2. Route to the right brain
  const isComplex = requiresDeepThinking(input);
  let responseText = "";
  let activeBrain = "";

  try {
    if (isComplex) {
      responseText = await askGemini(input, history);
      activeBrain = "gemini";
    } else {
      responseText = await askGroq(input, history);
      activeBrain = "groq";
    }
  } catch (error) {
    console.error(`Error with ${activeBrain}:`, error);
    responseText = "⚠️ Neural link interrupted. Retrying with backup systems...";
    activeBrain = "error";
  }

  // 3. Save new interaction to memory
  await saveToMemory(sessionId, "user", input);
  await saveToMemory(sessionId, "assistant", responseText);

  return { response: responseText, brain: activeBrain };
}

module.exports = { processMessage };