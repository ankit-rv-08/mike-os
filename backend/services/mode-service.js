const { db } = require("../db");

function getMode() {
  const row = db.prepare("SELECT value FROM user_preferences WHERE key = ?").get("ui_mode");
  return row?.value || "normal";
}

function setMode(mode) {
  db.prepare(`
    INSERT INTO user_preferences (key, value)
    VALUES ('ui_mode', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(mode);
  return mode;
}

function getPreference(key, defaultValue = null) {
  const row = db.prepare("SELECT value FROM user_preferences WHERE key = ?").get(key);
  return row?.value ?? defaultValue;
}

function setPreference(key, value) {
  db.prepare(`
    INSERT INTO user_preferences (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
  return value;
}

module.exports = { getMode, setMode, getPreference, setPreference };
