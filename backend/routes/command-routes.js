const express = require("express");
const router = express.Router();
const { processMessage } = require("../services/ai-service");

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
    const result = await processMessage(input.trim(), history);
    history.push({ role: "user", content: input.trim() });
    history.push({ role: "assistant", content: result.response });
    if (history.length > 20) sessions[sid] = history.slice(-20);
    return res.json({
      response: result.response,
      message: result.response,
      result: { message: result.response },
      brain: result.brain,
      stockData: result.data?.stockData || null,
    });
  } catch (err) {
    console.error("Command error:", err.message);
    return res.status(500).json({
      error: "MIKE encountered an error",
      message: err.message,
      response: "Something went wrong.",
      result: { message: "Something went wrong." }
    });
  }
});

router.get("/status", (req, res) => {
  res.json({ status: "online", brain: "Groq LLaMA 3.3 70B", version: "2.0" });
});

module.exports = router;