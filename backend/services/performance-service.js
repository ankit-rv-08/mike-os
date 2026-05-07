// performance-service.js - Enhanced with productivity scoring and insights

const { db } = require("../db");
const { toISODate } = require("../utils/date");

function getTodayPerformance() {
  const today = toISODate();
  const log = db.prepare("SELECT * FROM performance_logs WHERE date = ?").get(today) || {};
  const health = db.prepare("SELECT * FROM health_metrics WHERE date = ?").get(today) || {};
  
  // Calculate productivity score
  const productivityScore = calculateProductivity(log, health);
  
  return { date: today, ...log, ...health, productivityScore };
}

function getWeekTrend() {
  const data = db.prepare(`
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
  
  // Add trend analysis
  return data.map((day, index) => ({
    ...day,
    isImproving: index > 0 ? day.focus_minutes > data[index-1].focus_minutes : null,
    dayOfWeek: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));
}

// NEW: Calculate productivity score
function calculateProductivity(log, health) {
  let score = 0;
  
  // Focus time (max 40 points)
  score += Math.min((log.focus_minutes || 0) / 240 * 40, 40);
  
  // Task completion (max 30 points)
  const taskRate = log.tasks_total ? (log.tasks_completed || 0) / log.tasks_total : 0;
  score += taskRate * 30;
  
  // Health (max 20 points)
  const sleepScore = Math.min((health.sleep_hours || 0) / 8 * 10, 10);
  const waterScore = Math.min((health.water_liters || 0) / 3 * 10, 10);
  score += sleepScore + waterScore;
  
  // Steps bonus (max 10 points)
  score += Math.min((log.steps || 0) / 10000 * 10, 10);
  
  return Math.round(score);
}

// NEW: Get best performing day
function getBestDay() {
  const row = db.prepare(`
    SELECT p.date, p.focus_minutes, p.tasks_completed
    FROM performance_logs p
    ORDER BY p.focus_minutes DESC
    LIMIT 1
  `).get();
  
  return row || null;
}

// NEW: Get productivity insights
function getProductivityInsights() {
  const weekData = getWeekTrend();
  
  if (weekData.length === 0) return { message: 'Not enough data for insights' };
  
  const avgFocus = Math.round(weekData.reduce((s, d) => s + (d.focus_minutes || 0), 0) / weekData.length);
  const bestDay = weekData.reduce((best, day) => (day.focus_minutes || 0) > (best.focus_minutes || 0) ? day : best, weekData[0]);
  const improving = weekData.filter(d => d.isImproving === true).length;
  
  return {
    averageFocus: avgFocus,
    bestDay: { date: bestDay.date, minutes: bestDay.focus_minutes },
    trend: improving >= 3 ? 'Strong improvement' : improving >= 1 ? 'Slight improvement' : 'Needs attention',
    suggestion: avgFocus < 60 ? 'Try morning focus blocks' : avgFocus < 120 ? 'Good, aim for 3 hours' : 'Excellent focus!'
  };
}

module.exports = { 
  getTodayPerformance, 
  getWeekTrend, 
  calculateProductivity,
  getBestDay,
  getProductivityInsights 
};