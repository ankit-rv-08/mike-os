const express = require("express");
const { z } = require("zod");
const { getPreference, setPreference } = require("../services/mode-service");
const { ok, fail } = require("../utils/response");

const router = express.Router();

const voiceSchema = z.object({
  voiceName: z.string().min(1),
  locale: z.string().default("en-GB"),
  style: z.string().default("british-male"),
});

router.get("/voice-settings", (_req, res) => {
  const voiceName = getPreference("voice_name", "");
  const locale = getPreference("voice_locale", "en-GB");
  const style = getPreference("voice_style", "british-male");
  res.json(ok({ voiceName, locale, style }));
});

router.post("/voice-settings", (req, res) => {
  try {
    const { voiceName, locale, style } = voiceSchema.parse(req.body);
    setPreference("voice_name", voiceName);
    setPreference("voice_locale", locale);
    setPreference("voice_style", style);
    res.json(ok({ voiceName, locale, style }, "voice settings updated"));
  } catch (error) {
    res.status(400).json(fail(error.message));
  }
});

module.exports = router;
