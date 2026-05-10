require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const commandRoutes = require("./routes/command-routes");

const app = express();
app.use(cors());
app.use(express.json());

// Absolute paths to your data storage
const DATA_DIR = path.join(process.cwd(), 'data');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists so it doesn't crash on local startup
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true, 
    status: "online", 
    system: "MIKE OS v2.0",
    time: new Date().toISOString() 
  });
});

// CALENDAR HEATMAP ROUTE
app.get('/api/calendar', (req, res) => {
  try {
    let allEntries = [];
    
    // Read Calendar Data
    if (fs.existsSync(CALENDAR_FILE)) {
      const calData = JSON.parse(fs.readFileSync(CALENDAR_FILE, 'utf8'));
      allEntries = [...allEntries, ...calData];
    }
    
    // Read Tasks Data (to show task completion on heatmap)
    if (fs.existsSync(TASKS_FILE)) {
      const taskData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
      allEntries = [...allEntries, ...taskData];
    }

    // Group by Day for the Heatmap logic
    const daysMap = {};
    allEntries.forEach(entry => {
      const date = new Date(entry.start_time || entry.id); // fallback to ID if no start_time
      if (isNaN(date)) return; // skip invalid dates

      const dayNum = date.getDate();
      if (!daysMap[dayNum]) {
        daysMap[dayNum] = { day: dayNum, completion: 0, events: [] };
      }
      
      daysMap[dayNum].events.push(entry);
      
      // Heatmap color logic: 
      // If any event is completed, or if multiple events exist, increase intensity
      if (entry.completed) {
        daysMap[dayNum].completion = 100;
      } else if (daysMap[dayNum].completion < 100) {
        daysMap[dayNum].completion = Math.min(daysMap[dayNum].completion + 25, 75);
      }
    });

    res.json({ 
      success: true,
      data: { days: Object.values(daysMap) } 
    });
  } catch (err) {
    console.error("Calendar Route Error:", err);
    res.status(500).json({ error: "Failed to fetch calendar data", data: { days: [] } });
  }
});

// Main AI Command Route
app.use("/api", commandRoutes);

// Export for Vercel
module.exports = app;

// Local Development Server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`
    ⚡ MIKE OS BACKEND ONLINE
    📡 URL: http://localhost:${PORT}
    🧠 MODE: Dual-Brain (Groq/Gemini)
    `);
  });
}