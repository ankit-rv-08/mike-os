const db = require("../db");

module.exports = async function getTasks() {
  const stmt = db.prepare("SELECT * FROM tasks ORDER BY id DESC");
  return stmt.all();
};