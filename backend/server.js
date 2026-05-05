require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROUTES
========================= */

// test route
app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "MIKE OS API working",
  });
});

// health route (IMPORTANT)
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    service: "MIKE OS backend",
  });
});

// command route
const commandRoutes = require("./routes/command-routes");
app.use("/api", commandRoutes);

/* =========================
   EXPORT (must be after routes)
========================= */

module.exports = app;

/* =========================
   LOCAL DEV ONLY
========================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`Running locally on http://localhost:${PORT}`);
  });
}