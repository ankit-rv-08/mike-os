const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { processMessage } = require("../services/ai-service");

const sessions = {};
const DATA_DIR = path.join(__dirname, '../data');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const FINANCE_FILE = path.join(DATA_DIR, 'finance.json');
const PERFORMANCE_FILE = path.join(DATA_DIR, 'performance.json'); // New

// --- AI CHAT ---
router.post("/command", async (req, res) => {
  try {
    const { input, sessionId } = req.body;
    const sid = sessionId || "default";
    if (!sessions[sid]) sessions[sid] = [];
    const { response, brain } = await processMessage(input.trim(), sessions[sid]);
    sessions[sid].push({ role: "user", content: input.trim() }, { role: "assistant", content: response });
    if (sessions[sid].length > 20) sessions[sid] = sessions[sid].slice(-20);
    return res.json({ response, brain });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ response: "⚠️ Backend Error.", brain: "system" });
  }
});

// --- CALENDAR ROUTES ---
router.get("/calendar", (req, res) => {
  try {
    if (!fs.existsSync(CALENDAR_FILE)) return res.json({});
    res.json(JSON.parse(fs.readFileSync(CALENDAR_FILE, 'utf-8') || '{}'));
  } catch (e) { res.json({}); }
});
router.post("/calendar", (req, res) => {
  try {
    if (!req.body.error) fs.writeFileSync(CALENDAR_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Fail" }); }
});

// --- FINANCE ROUTES ---
router.get("/finance", (req, res) => {
  try {
    if (!fs.existsSync(FINANCE_FILE)) return res.json({ income: [], expenses: [] });
    res.json(JSON.parse(fs.readFileSync(FINANCE_FILE, 'utf-8') || '{"income":[],"expenses":[]}'));
  } catch (e) { res.json({ income: [], expenses: [] }); }
});
router.post("/finance", (req, res) => {
  try {
    if (!req.body.error) fs.writeFileSync(FINANCE_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Fail" }); }
});

// --- PERFORMANCE ROUTES ---
router.get("/performance", (req, res) => {
  try {
    if (!fs.existsSync(PERFORMANCE_FILE)) return res.json({ logs: [] });
    res.json(JSON.parse(fs.readFileSync(PERFORMANCE_FILE, 'utf-8') || '{"logs":[]}'));
  } catch (e) { res.json({ logs: [] }); }
});
router.post("/performance", (req, res) => {
  try {
    if (!req.body.error) fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Fail" }); }
});
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure projects file exists
if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify({ tasks: [] }, null, 2));
}



router.get("/projects", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8') || '{"tasks":[]}');
    res.json(data);
  } catch (e) {
    res.json({ tasks: [] });
  }
});

router.post("/projects", (req, res) => {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to save projects" });
  }
});

module.exports = router;