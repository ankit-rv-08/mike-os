require("dotenv").config();

const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/command-routes");
const voiceRoutes = require("./routes/voice-routes");

const app = express();

// Simple CORS
app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// routes
app.use("/api", commandRoutes);
app.use("/api", voiceRoutes);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`MIKE OS running on http://localhost:${PORT}`);
  });
}
