const { db } = require("../db");
const { toISODate } = require("../utils/date");

function getTodayPerformance() {
  const today = toISODate();
  const log = db.prepare("SELECT * FROM performance_logs WHERE date = ?").get(today) || {};
  const health = db.prepare("SELECT * FROM health_metrics WHERE date = ?").get(today) || {};
  return { date: today, ...log, ...health };
}

function getWeekTrend() {
  return db.prepare(`
    SELECT p.date,
           p.focus_minutes,
           p.tasks_completed,
           p.habits_completed,
           p.steps,
           h.sleep_hours,
           h.water_liters
    FROM performance_logs p
    LEFT JOIN health_metrics h ON h.date = p.date
    ORDER BY p.date DESC
    LIMIT 7
  `).all().reverse();
}

module.exports = { getTodayPerformance, getWeekTrend };
