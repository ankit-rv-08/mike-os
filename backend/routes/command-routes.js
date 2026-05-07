const express = require("express");
const router = express.Router();
const { processMessage } = require("../services/ai-service");

// In-memory conversation history per session
const sessions = {};

router.post("/command", async (req, res) => {
  try {
    const { input, source, sessionId } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({ error: "Input required" });
    }

    const sid = sessionId || "default";
    if (!sessions[sid]) sessions[sid] = [];

    const history = sessions[sid];

    const { response, brain, stockData } = await processMessage(input.trim(), history);

    // Store in history
    history.push({ role: "user", content: input.trim() });
    history.push({ role: "assistant", content: response });

    // Keep last 20 messages only
    if (history.length > 20) sessions[sid] = history.slice(-20);

    return res.json({
      response,
      message: response,
      result: { message: response },
      brain,
      stockData,
    });

  } catch (err) {
    console.error("Command error:", err.message);
    return res.status(500).json({
      error: "MIKE encountered an error",
      message: err.message,
      response: "⚠️ Something went wrong. Check API keys.",
      result: { message: "⚠️ Something went wrong. Check API keys." }
    });
  }
});

router.get("/status", (req, res) => {
  res.json({
    status: "online",
    brain: "Gemini 1.5 Flash + Groq LLaMA 8B",
    version: "2.0"
  });
});

module.exports = router;