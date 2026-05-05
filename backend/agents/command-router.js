const createTask = require("../commands/create-task");
const getTasks = require("../commands/get-tasks");
const completeTask = require("../commands/complete-task");

async function routeCommand(input) {
  const text = input.toLowerCase();

  // ✅ CREATE TASK
  if (text.startsWith("create task")) {
    const title = input.replace(/create task/i, "").trim();

    if (!title) {
      return { message: "Please provide a task name." };
    }

    const result = await createTask(title);

    return {
      message: `✅ Task created: ${title}`,
      data: result,
    };
  }

  // ✅ GET TASKS
  if (text.includes("show tasks") || text.includes("get tasks")) {
    const tasks = await getTasks();

    if (!tasks.length) {
      return { message: "No tasks found." };
    }

    return {
      message:
        "📋 Your Tasks:\n" +
        tasks.map((t, i) => `${i + 1}. ${t.title}`).join("\n"),
      data: tasks,
    };
  }

  // ✅ COMPLETE TASK
  if (text.startsWith("complete task")) {
    const title = input.replace(/complete task/i, "").trim();

    const result = await completeTask(title);

    return {
      message: `✅ Task completed: ${title}`,
      data: result,
    };
  }

  // ❌ FALLBACK
  return {
    message: `🤖 I didn’t understand: "${input}"`,
  };
}

module.exports = routeCommand;