const createTask = require("../commands/create-task");

async function routeCommand(input) {
  if (input.toLowerCase().includes("create task")) {
    return await createTask(input);
  }

  return { message: "Command not recognized" };
}

module.exports = { routeCommand };