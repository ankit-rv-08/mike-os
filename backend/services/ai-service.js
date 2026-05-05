async function parseIntentWithAI(input) {
  return {
    action: "get_tasks",
    parameters: {},
    response: `Understood: "${input}". Fetching your tasks.`,
  };
}

async function generateInsight({ lifeScore }) {
  if (lifeScore >= 80) return "Strong execution. Protect momentum with focused mornings.";
  if (lifeScore >= 60) return "Solid baseline. Improve sleep and consistency for stronger output.";
  return "Recovery mode recommended. Finish essentials and rebuild consistency.";
}

module.exports = { parseIntentWithAI, generateInsight };
