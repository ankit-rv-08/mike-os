const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("/tmp/mike-os.db");

function initDb() {
  const schema = fs.readFileSync(
    __dirname + "/schema.sql",
    "utf-8"
  );

  db.exec(schema);
}

module.exports = { db, initDb };