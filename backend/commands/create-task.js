const db = require("../db");

function createTask(input) {
  const title = input.replace("create task", "").trim();

  const stmt = db.prepare(`
    INSERT INTO tasks (title, status)
    VALUES (?, 'pending')
  `);

  const result = stmt.run(title);

  return {
    message: `Task created: ${title}`,
    taskId: result.lastInsertRowid,
  };
}

module.exports = createTask;