const express = require("express");
const router = express.Router();

router.post("/command", (req, res) => {
  const { input } = req.body;

  res.json({
    ok: true,
    message: `You said: ${input}`,
  });
});

module.exports = router;