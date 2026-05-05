const { db } = require("../db");

module.exports = async function createTask(title) {
  if (!title) {
    return { message: "Task title missing." };
  }

  db.prepare(
    "INSERT INTO tasks (title, completed) VALUES (?, 0)"
  ).run(title);

  return {
    message: `✅ Task created: ${title}`,
  };
};