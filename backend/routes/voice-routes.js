const express = require("express");
const { z } = require("zod");
const { getPreference, setPreference } = require("../services/mode-service");
const { processVoice } = require("../services/voice-service");
const { processMessage } = require("../services/ai-service");
const { ok, fail } = require("../utils/response");

const router = express.Router();

const voiceSettingsSchema = z.object({
  voiceName: z.string().min(1),
  locale: z.string().default("en-GB"),
  style: z.string().default("british-male"),
});

const voiceCommandSchema = z.object({
  transcript: z.string().min(1),
  voice: z.string().default("indian-british"),
});

// GET voice settings
router.get("/voice-settings", (_req, res) => {
  const voiceName = getPreference("voice_name", "");
  const locale = getPreference("voice_locale", "en-GB");
  const style = getPreference("voice_style", "indian-british");
  res.json(ok({ voiceName, locale, style }));
});

// POST update voice settings
router.post("/voice-settings", (req, res) => {
  try {
    const { voiceName, locale, style } = voiceSettingsSchema.parse(req.body);
    setPreference("voice_name", voiceName);
    setPreference("voice_locale", locale);
    setPreference("voice_style", style);
    res.json(ok({ voiceName, locale, style }, "Voice settings updated"));
  } catch (error) {
    res.status(400).json(fail(error.message));
  }
});

// POST voice command processing
router.post("/voice-command", async (req, res) => {
  try {
    const { transcript, voice } = voiceCommandSchema.parse(req.body);
    
    // Process through voice service for JARVIS response
    const voiceResult = await processVoice({
      transcript,
      parser: async (text) => {
        // Use the main AI processor
        const result = await processMessage(text);
        return result.response || result.result?.message || 'Command processed.';
      }
    });
    
    res.json(ok({
      ...voiceResult,
      voice
    }, "Voice command processed"));
  } catch (error) {
    res.status(400).json(fail(error.message));
  }
});

module.exports = router;
