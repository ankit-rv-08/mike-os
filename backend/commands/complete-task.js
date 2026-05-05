const db = require("../db");

module.exports = async function completeTask(title) {
  const stmt = db.prepare(
    "UPDATE tasks SET completed = 1 WHERE title LIKE ?"
  );

  return stmt.run(`%${title}%`);
};