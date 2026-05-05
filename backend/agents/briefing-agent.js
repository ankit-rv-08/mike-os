const { db } = require("../db");
const { toISODate } = require("../utils/date");
const { computeLifeScore } = require("../services/life-score-service");
const { generateInsight } = require("../services/ai-service");
const { retentionFeedback } = require("../services/retention-service");

async function generateDailyBriefing() {
  const today = toISODate();
  const tasks = db.prepare("SELECT * FROM tasks WHERE due_date = ? OR due_date IS NULL").all(today);
  const meetings = db.prepare("SELECT * FROM events WHERE date(start_time) = ?").all(today);
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const perf = db.prepare("SELECT * FROM performance_logs WHERE date = ?").get(today) || {};
  const health = db.prepare("SELECT * FROM health_metrics WHERE date = ?").get(today) || {};

  const score = computeLifeScore({
    focusMinutes: perf.focus_minutes || 0,
    learningMinutes: perf.learning_minutes || 0,
    sleepHours: health.sleep_hours || 0,
    waterLiters: health.water_liters || 0,
    tasksCompleted: completedTasks,
    tasksTotal: Math.max(tasks.length, 1),
    habitsCompleted: perf.habits_completed || 0,
    habitsTotal: 5,
  });

  const insight = await generateInsight({ lifeScore: score.overall });
  const retention = retentionFeedback({ streak: 0, missedYesterday: 1 });

  return {
    date: today,
    summary: {
      tasksDue: tasks.length,
      meetingsToday: meetings.length,
      lifeScore: score.overall,
    },
    breakdown: score,
    insights: [insight],
    suggestions: retention,
    tone: "calm_authoritative",
  };
}

module.exports = { generateDailyBriefing };
