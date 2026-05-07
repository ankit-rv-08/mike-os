require("dotenv").config();

const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/command-routes");
const voiceRoutes = require("./routes/voice-routes");

const app = express();

// CORS - allow your frontend domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://mike-os-frontend.vercel.app',
  'https://mike-os-frontend-git-main-ankit-rv-08s-projects.vercel.app',
  'https://mike-os-frontend-*.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list or Vercel preview
    if (allowedOrigins.includes(origin) || origin.includes('mike-os-frontend')) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// routes
app.use("/api", commandRoutes);
app.use("/api", voiceRoutes);

// export for vercel
module.exports = app;

// local run only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.BACKEND_PORT || 8787;
  app.listen(PORT, () => {
    console.log(`🚀 MIKE OS Backend running on http://localhost:${PORT}`);
    console.log(`🎙️ Voice API: http://localhost:${PORT}/api/voice-command`);
  });
}
