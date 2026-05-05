require("dotenv").config();

const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/command-routes");

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// routes
app.use("/api", commandRoutes);

// export for vercel
module.exports = app;

// local run only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
}