const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.resolve(__dirname, "database.db"));

// optional safety
db.pragma("journal_mode = WAL");

module.exports = db;