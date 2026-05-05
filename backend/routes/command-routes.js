const express = require("express");
const router = express.Router();

// import your router logic
const routeCommand = require("../agents/command-router");

// ✅ TEST ROUTE (optional but useful)
router.get("/command-test", (req, res) => {
  return res.json({ ok: true, message: "Command route working" });
});

// ✅ MAIN COMMAND ROUTE
router.post("/command", async (req, res) => {
  console.log("🔥 COMMAND HIT:", req.body); // DEBUG LOG

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        ok: false,
        message: "No input provided",
      });
    }

    const result = await routeCommand(input);

    console.log("✅ RESULT:", result); // DEBUG LOG

    return res.json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("❌ COMMAND ERROR:", err);

    return res.status(500).json({
      ok: false,
      message: "Command failed",
    });
  }
});

module.exports = router;