try {
  const app = require("../server");
  module.exports = app;
} catch (error) {
  console.error("Failed to load server:", error.message);
  // Create a minimal fallback
  const express = require("express");
  const fallback = express();
  fallback.get("/api/health", (req, res) => {
    res.json({ ok: false, error: error.message });
  });
  module.exports = fallback;
}
