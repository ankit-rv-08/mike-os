const createTask = require("../commands/create-task");
const getTasks = require("../commands/get-tasks");

async function routeCommand(input) {
  const text = input.toLowerCase();

  // CREATE TASK
  if (text.startsWith("create task")) {
    const title = input.replace(/create task/i, "").trim();

    return await createTask(title);
  }

  // SHOW TASKS
  if (text.includes("show tasks") || text.includes("get tasks")) {
    return await getTasks();
  }

  return {
    message: `I understand: "${input}" but no command matched.`,
  };
}

module.exports = { routeCommand };