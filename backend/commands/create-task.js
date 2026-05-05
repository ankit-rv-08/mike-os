const db = require("../db");

module.exports = async function createTask(title) {
  const stmt = db.prepare("INSERT INTO tasks (title) VALUES (?)");
  const result = stmt.run(title);

  return { id: result.lastInsertRowid, title };
};