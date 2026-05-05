const express = require("express");
const { routeCommand } = require("../agents/command-router");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.get("/performance", async (_req, res) => {
  try {
    const result = await routeCommand({ action: "get_performance", parameters: {}, context: {} });
    res.json(ok(result));
  } catch (error) {
    res.status(500).json(fail(error.message));
  }
});

module.exports = router;
