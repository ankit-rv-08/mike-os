const express = require("express");
const { generateDailyBriefing } = require("../agents/briefing-agent");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.get("/briefing", async (_req, res) => {
  try {
    const briefing = await generateDailyBriefing();
    res.json(ok({ briefing }));
  } catch (error) {
    res.status(500).json(fail(error.message));
  }
});

module.exports = router;
