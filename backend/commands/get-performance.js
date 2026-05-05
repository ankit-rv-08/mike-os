const { db } = require("../db");
const { getTodayPerformance, getWeekTrend } = require("../services/performance-service");
const { computeLifeScore } = require("../services/life-score-service");

module.exports = {
  name: "get_performance",
  execute() {
    const today = getTodayPerformance();
    const trend = getWeekTrend();
    const taskCounts = db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        COUNT(*) as total
      FROM tasks
    `).get();

    const lifeScore = computeLifeScore({
      focusMinutes: today.focus_minutes || 0,
      learningMinutes: today.learning_minutes || 0,
      sleepHours: today.sleep_hours || 0,
      waterLiters: today.water_liters || 0,
      tasksCompleted: taskCounts.completed || 0,
      tasksTotal: taskCounts.total || 1,
      habitsCompleted: today.habits_completed || 0,
      habitsTotal: 5,
    });

    return {
      action: "get_performance",
      data: { today, trend, lifeScore },
      message: "Performance fetched.",
    };
  },
};
