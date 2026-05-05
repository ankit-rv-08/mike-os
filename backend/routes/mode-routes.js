const express = require("express");
const { z } = require("zod");
const { getMode, setMode } = require("../services/mode-service");
const { ok, fail } = require("../utils/response");

const router = express.Router();
const modeSchema = z.object({
  mode: z.enum(["normal", "focus", "deadline", "completed", "hacker"]),
});

router.get("/mode", (_req, res) => {
  res.json(ok({ mode: getMode() }));
});

router.post("/mode", (req, res) => {
  try {
    const { mode } = modeSchema.parse(req.body);
    const savedMode = setMode(mode);
    res.json(ok({ mode: savedMode }, "mode updated"));
  } catch (error) {
    res.status(400).json(fail(error.message));
  }
});

module.exports = router;
