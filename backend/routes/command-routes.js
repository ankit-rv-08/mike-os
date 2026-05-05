const express = require("express");
const router = express.Router();

const { routeCommand } = require("../agents/command-router");

router.post("/command", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "No input" });
    }

    const result = await routeCommand(input);

    return res.json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Command failed",
    });
  }
});

module.exports = router;