const { z } = require("zod");

const commandSchema = z.object({
  input: z.string().min(1),
  source: z.enum(["text", "voice"]).default("text"),
});

module.exports = { commandSchema };
