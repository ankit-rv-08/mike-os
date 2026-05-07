// mode-service.js - Enhanced with theme support and smart defaults

const { db } = require("../db");

// UI Modes
function getMode() {
  const row = db.prepare("SELECT value FROM user_preferences WHERE key = ?").get("ui_mode");
  return row?.value || "normal";
}

function setMode(mode) {
  const validModes = ["normal", "focus", "zen", "terminal", "minimal"];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid mode. Choose from: ${validModes.join(', ')}`);
  }
  
  db.prepare(`
    INSERT INTO user_preferences (key, value)
    VALUES ('ui_mode', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(mode);
  
  return { mode, settings: getModeSettings(mode) };
}

// NEW: Mode-specific settings
function getModeSettings(mode) {
  const settings = {
    normal: { animations: true, sounds: true, notifications: true, background: 'default' },
    focus: { animations: false, sounds: false, notifications: false, background: 'dark' },
    zen: { animations: false, sounds: false, notifications: false, background: 'minimal' },
    terminal: { animations: false, sounds: true, notifications: true, background: 'terminal' },
    minimal: { animations: false, sounds: false, notifications: true, background: 'white' }
  };
  return settings[mode] || settings.normal;
}

// Generic preferences
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

// NEW: Get all preferences at once
function getAllPreferences() {
  const rows = db.prepare("SELECT key, value FROM user_preferences").all();
  const prefs = {};
  rows.forEach(row => { prefs[row.key] = row.value; });
  return prefs;
}

// NEW: Reset to defaults
function resetPreferences() {
  db.prepare("DELETE FROM user_preferences").run();
  return { message: 'All preferences reset to default' };
}

// NEW: Smart mode suggestion based on time
function suggestMode() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 9) return 'focus';     // Morning deep work
  if (hour >= 9 && hour < 17) return 'normal';    // Work hours
  if (hour >= 17 && hour < 21) return 'minimal';  // Evening wind-down
  return 'zen';                                    // Night calm
}

module.exports = { 
  getMode, setMode, 
  getPreference, setPreference, 
  getAllPreferences, resetPreferences,
  getModeSettings, suggestMode 
};