const express = require("express");
const router = express.Router();

const { routeCommand } = require("../agents/command-router");

router.post("/command", async (req, res) => {
  try {
    const { input, source } = req.body;

    if (!input) {
      return res.status(400).json({
        ok: false,
        error: "No input provided",
      });
    }

    const result = await routeCommand(input);

    res.json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("Command error:", err);

    res.status(500).json({
      ok: false,
      error: "Command execution failed",
    });
  }
});

module.exports = router;