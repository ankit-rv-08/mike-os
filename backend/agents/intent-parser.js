const { parseIntentWithAI } = require("../services/ai-service");

const simpleRules = [
  { test: /create task|add task/i, action: "create_task" },
  { test: /complete task|done task/i, action: "complete_task" },
  { test: /show tasks|get tasks|my tasks/i, action: "get_tasks" },
  { test: /create event|schedule/i, action: "create_event" },
  { test: /calendar|events today/i, action: "get_calendar" },
  { test: /performance|life score|health/i, action: "get_performance" },
  { test: /news/i, action: "fetch_news" },
  { test: /crypto|bitcoin|eth/i, action: "fetch_crypto" },
  { test: /open app|open url|launch/i, action: "open_app" },
];

function extractSimpleParameters(action, input) {
  if (action === "create_task") {
    const title = input.replace(/create task|add task/gi, "").trim() || "Untitled Task";
    return { title };
  }
  if (action === "complete_task") {
    const idMatch = input.match(/\d+/);
    return { id: idMatch ? Number(idMatch[0]) : null };
  }
  return {};
}

async function parseIntent(input) {
  const rule = simpleRules.find((r) => r.test.test(input));
  if (rule) {
    return {
      action: rule.action,
      parameters: extractSimpleParameters(rule.action, input),
      response: "Parsed with rule engine.",
      parser: "rule",
    };
  }

  const ai = await parseIntentWithAI(input);
  return { ...ai, parser: "ai" };
}

module.exports = { parseIntent };
