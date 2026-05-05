const express = require("express");
const { routeCommand } = require("../agents/command-router");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.get("/calendar", async (req, res) => {
  try {
    const result = await routeCommand({
      action: "get_calendar",
      parameters: { month: req.query.month },
      context: {},
    });
    res.json(ok(result));
  } catch (error) {
    res.status(500).json(fail(error.message));
  }
});

module.exports = router;
