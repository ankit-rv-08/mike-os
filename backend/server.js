require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require('fs'); // ONLY ONE OF THESE
const path = require('path');
const commandRoutes = require("./routes/command-routes");

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// --- PASTE THE CALENDAR ROUTE HERE ---
app.get('/api/calendar', (req, res) => {
  try {
    const calendarFile = path.join(__dirname, '../data/calendar.json');
    const tasksFile = path.join(__dirname, '../data/tasks.json');
    
    let rawEvents = [];
    if (fs.existsSync(calendarFile)) {
      rawEvents = [...rawEvents, ...JSON.parse(fs.readFileSync(calendarFile, 'utf8'))];
    }
    if (fs.existsSync(tasksFile)) {
      rawEvents = [...rawEvents, ...JSON.parse(fs.readFileSync(tasksFile, 'utf8'))];
    }

    const daysMap = {};
    rawEvents.forEach(ev => {
      const date = new Date(ev.start_time || Date.now());
      const dayKey = date.getDate();
      if (!daysMap[dayKey]) daysMap[dayKey] = { day: dayKey, completion: 0, events: [] };
      
      daysMap[dayKey].events.push({
        title: ev.title,
        start_time: date.toISOString(),
        event_type: ev.type || 'task',
        completed: ev.status === 'completed'
      });
      const completedCount = daysMap[dayKey].events.filter(e => e.completed).length;
      daysMap[dayKey].completion = Math.round((completedCount / daysMap[dayKey].events.length) * 100) || 10;
    });

    res.json({ data: { days: Object.values(daysMap) } });
  } catch (error) {
    res.status(500).json({ data: { days: [] } });
  }
});

app.use("/api", commandRoutes);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`MIKE OS running on http://localhost:${PORT}`);
  });
}