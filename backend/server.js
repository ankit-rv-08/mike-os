require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initDb } = require("./db");
const commandRoutes = require("./routes/command-routes");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 INIT DB
initDb();

// ✅ HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// ✅ COMMAND ROUTES
app.use("/api", commandRoutes);

// ===== EXPORT FOR VERCEL =====
module.exports = app;

// ===== LOCAL DEV ONLY
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`Running locally on http://localhost:${PORT}`);
  });
}