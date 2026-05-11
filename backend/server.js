require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const commandRoutes = require("./routes/command-routes");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online", system: "MIKE OS v2.0" });
});

// All API logic goes to the router!
app.use("/api", commandRoutes);

module.exports = app;

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