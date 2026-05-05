const commands = {
  create_task: require("../commands/create-task"),
  complete_task: require("../commands/complete-task"),
  get_tasks: require("../commands/get-tasks"),
  create_event: require("../commands/create-event"),
  get_calendar: require("../commands/get-calendar"),
  get_performance: require("../commands/get-performance"),
  fetch_news: require("../commands/fetch-news"),
  fetch_crypto: require("../commands/fetch-crypto"),
  open_app: require("../commands/open-app"),
};

async function routeCommand({ action, parameters, context }) {
  const cmd = commands[action];
  if (!cmd) throw new Error(`Unknown action: ${action}`);

  if (cmd.validate) {
    const result = cmd.validate(parameters || {});
    if (!result.valid) throw new Error(`Validation failed: ${result.errors.join(", ")}`);
  }

  return cmd.execute({ params: parameters || {}, context });
}

module.exports = { routeCommand };
