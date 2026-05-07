// life-score-service.js - Enhanced with trends, badges, and recommendations

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeLifeScore(payload) {
  const {
    focusMinutes = 0,
    learningMinutes = 0,
    sleepHours = 0,
    waterLiters = 0,
    tasksCompleted = 0,
    tasksTotal = 1,
    habitsCompleted = 0,
    habitsTotal = 1,
    exercise = 0, // minutes
    meditation = 0, // minutes
    screenTime = 0, // hours outside work
  } = payload;

  const mind = clamp((focusMinutes / 240) * 60 + (learningMinutes / 60) * 30 + (meditation / 15) * 10);
  const body = clamp((sleepHours / 8) * 50 + (waterLiters / 3) * 30 + (exercise / 30) * 20);
  const work = clamp((tasksCompleted / Math.max(1, tasksTotal)) * 100);
  const discipline = clamp((habitsCompleted / Math.max(1, habitsTotal)) * 100);
  const balance = clamp(100 - (screenTime / 12) * 100); // Reduce score for excessive screen time
  
  const overall = clamp(mind * 0.25 + body * 0.25 + work * 0.25 + discipline * 0.15 + balance * 0.10);

  return { overall, mind, body, work, discipline, balance };
}

// NEW: Get personalized badges based on scores
function getBadges(scores) {
  const badges = [];
  
  if (scores.overall >= 90) badges.push({ name: 'Elite Performer', emoji: '👑', description: 'Top 1% performance day' });
  else if (scores.overall >= 80) badges.push({ name: 'High Achiever', emoji: '⭐', description: 'Excellent day' });
  
  if (scores.mind >= 90) badges.push({ name: 'Deep Focus', emoji: '🧠', description: 'Exceptional mental performance' });
  if (scores.body >= 85) badges.push({ name: 'Peak Physical', emoji: '💪', description: 'Great health metrics' });
  if (scores.work === 100) badges.push({ name: 'Task Master', emoji: '✅', description: 'All tasks completed' });
  if (scores.discipline === 100) badges.push({ name: 'Discipline King', emoji: '🎯', description: 'All habits done' });
  if (scores.balance >= 90) badges.push({ name: 'Digital Balance', emoji: '⚖️', description: 'Healthy screen time' });
  
  return badges;
}

// NEW: Generate personalized recommendations
function getRecommendations(scores) {
  const recommendations = [];
  
  if (scores.mind < 50) recommendations.push({ area: 'mind', tip: 'Try 25-min Pomodoro sessions for better focus', priority: 'high' });
  if (scores.body < 50) {
    if (scores.body < 30) recommendations.push({ area: 'body', tip: 'Start with a 10-min walk and drink 1 glass of water now', priority: 'critical' });
    else recommendations.push({ area: 'body', tip: 'Aim for 7+ hours sleep tonight', priority: 'medium' });
  }
  if (scores.work < 40) recommendations.push({ area: 'work', tip: 'Break down your biggest task into 3 small steps', priority: 'high' });
  if (scores.discipline < 50) recommendations.push({ area: 'discipline', tip: 'Focus on just ONE habit today. Make it non-negotiable.', priority: 'medium' });
  if (scores.balance < 40) recommendations.push({ area: 'balance', tip: 'Take a 15-min screen break every 2 hours', priority: 'high' });
  
  return recommendations;
}

// NEW: Calculate weekly trends
function getWeeklyTrend(history) {
  if (!history || history.length < 2) return { direction: 'stable', change: 0 };
  
  const recent = history.slice(-7);
  const firstHalf = recent.slice(0, 3);
  const secondHalf = recent.slice(-3);
  
  const avg1 = firstHalf.reduce((s, d) => s + d.overall, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((s, d) => s + d.overall, 0) / secondHalf.length;
  const change = Math.round(avg2 - avg1);
  
  return {
    direction: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
    change,
    trendEmoji: change > 5 ? '📈' : change < -5 ? '📉' : '➡️'
  };
}

module.exports = { computeLifeScore, getBadges, getRecommendations, getWeeklyTrend };