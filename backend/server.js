require("dotenv").config();

const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/command-routes");
const voiceRoutes = require("./routes/voice-routes");
const calendarRoutes = require("./routes/calendar-routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

app.use("/api", commandRoutes);
app.use("/api", voiceRoutes);
app.use("/api", calendarRoutes);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`MIKE OS running on http://localhost:${PORT}`);
  });
}