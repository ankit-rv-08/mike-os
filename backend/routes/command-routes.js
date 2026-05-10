const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { processMessage } = require("../services/ai-service");

const sessions = {};
const CALENDAR_FILE = path.join(__dirname, '../data/calendar.json');

// Safely read events and ensure the file exists
function getEvents() {
  try {
    if (!fs.existsSync(path.dirname(CALENDAR_FILE))) {
      fs.mkdirSync(path.dirname(CALENDAR_FILE), { recursive: true });
    }
    if (fs.existsSync(CALENDAR_FILE)) {
      const data = fs.readFileSync(CALENDAR_FILE, 'utf-8');
      return data ? JSON.parse(data) : [];
    }
  } catch (err) {
    console.error("Error reading calendar:", err);
  }
  return [];
}

// Helper to save new events
function saveToCalendar(title, type) {
  const events = getEvents();
  const newEvent = {
    id: Date.now(),
    title: title.replace(/MIKE Command: |schedule a |create a |create an /gi, '').trim(),
    type: type, 
    status: "pending",
    start_time: new Date().toISOString(),
    completed: false
  };

  events.push(newEvent);
  fs.writeFileSync(CALENDAR_FILE, JSON.stringify(events, null, 2));
  return newEvent;
}

// 👉 THE FIX FOR THE 500 ERROR: Serve the calendar data to the frontend
router.get("/calendar", (req, res) => {
  try {
    const events = getEvents();
    res.json(events); // Send back the array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read calendar data" });
  }
});

// Intercept chat commands to add events
router.post("/command", async (req, res) => {
  try {
    const { input, source, sessionId } = req.body;
    if (!input || !input.trim()) return res.status(400).json({ error: "Input required" });
    
    const sid = sessionId || "default";
    if (!sessions[sid]) sessions[sid] = [];
    const history = sessions[sid];

    // Execution Layer: Intercept calendar commands
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("schedule") || lowerInput.includes("meeting") || lowerInput.includes("task") || lowerInput.includes("event")) {
       saveToCalendar(input.trim(), lowerInput.includes("task") ? "task" : "calendar");
    }

    const { response, brain, stockData } = await processMessage(input.trim(), history);

    history.push({ role: "user", content: input.trim() });
    history.push({ role: "assistant", content: response });
    if (history.length > 20) sessions[sid] = history.slice(-20);

    return res.json({ response, message: response, result: { message: response }, brain, stockData });
  } catch (err) {
    console.error("Command error:", err.message);
    return res.status(500).json({ error: "MIKE encountered an error", message: err.message, response: "⚠️ Something went wrong." });
  }
});

router.get("/status", (req, res) => {
  res.json({ status: "online", brain: "Gemini + Groq", version: "2.0" });
});

module.exports = router;