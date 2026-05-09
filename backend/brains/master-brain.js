const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Mistral } = require("@mistralai/mistralai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

async function executeTask(input, history) {
  // 1. IS IT SIMPLE? -> Use Groq Llama 3 (Ultra Fast)
  const isComplex = /code|dsa|stock|research|analyze|plan/i.test(input) || input.length > 80;

  if (!isComplex) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama-3.1-8b-instant",
      });
      return { text: completion.choices[0].message.content, source: "Groq Reflex" };
    } catch (e) { console.error("Groq down, jumping to Gemini..."); }
  }

  // 2. IS IT COMPLEX? -> Try Gemini 2.5 Flash
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(input);
    return { text: result.response.text(), source: "Gemini Strategic" };
  } catch (err) {
    // 3. GEMINI LIMIT HIT? -> Use Mistral Codestral (Fail-safe)
    console.log("Gemini throttled. Initiating Mistral Failover...");
    try {
      const response = await mistral.chat.complete({
        model: "codestral-latest",
        messages: [{ role: "user", content: input }],
      });
      return { text: response.choices[0].message.content, source: "Mistral Fail-safe" };
    } catch (fatal) {
      return { text: "Critical Brain Failure. Check API keys.", source: "ERROR" };
    }
  }
}

module.exports = { executeTask };