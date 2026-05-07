// retention-service.js - Enhanced with motivation and habit science

function retentionFeedback({ streak = 0, missedYesterday = 0, totalCompleted = 0, consistency = 0 }) {
  const feedback = [];
  
  // Streak-based motivation
  if (streak >= 30) feedback.push("🔥 30+ day streak! You're unstoppable!");
  else if (streak >= 14) feedback.push("💪 Two-week streak! Building serious momentum.");
  else if (streak >= 7) feedback.push("⭐ One week streak! You're building habits that last.");
  else if (streak > 0) feedback.push(`Current streak: ${streak} days. Keep the chain alive!`);
  
  // Missed items feedback
  if (missedYesterday > 3) feedback.push(`⚠️ You missed ${missedYesterday} items yesterday. Time to refocus.`);
  else if (missedYesterday > 0) feedback.push(`Missed ${missedYesterday} items yesterday. Today is a fresh start.`);
  
  // Perfect day celebration
  if (missedYesterday === 0 && streak > 0) feedback.push("✨ Perfect consistency! You're building an identity of excellence.");
  
  // Total milestone
  if (totalCompleted >= 100) feedback.push("🏆 100+ tasks completed! Massive productivity.");
  else if (totalCompleted >= 50) feedback.push("🎯 50+ tasks done. Solid execution.");
  
  // Consistency score insights
  if (consistency >= 90) feedback.push("📊 Exceptional consistency score. You show up every day.");
  else if (consistency >= 70) feedback.push("📊 Good consistency. Small improvements compound.");
  else if (consistency > 0) feedback.push("📊 Consistency needs work. Show up even on hard days.");
  
  return feedback.length > 0 ? feedback : ["Ready for a new day. Make it count!"];
}

// NEW: Calculate habit strength
function calculateHabitStrength(history) {
  if (!history || history.length < 7) return { level: 'building', percentage: 0 };
  
  const completedDays = history.filter(d => d.completed).length;
  const percentage = Math.round((completedDays / history.length) * 100);
  
  let level;
  if (percentage >= 90) level = 'automatic';
  else if (percentage >= 70) level = 'strong';
  else if (percentage >= 50) level = 'developing';
  else level = 'building';
  
  const nextMilestone = percentage < 90 ? 90 : 100;
  const daysNeeded = Math.ceil((nextMilestone - percentage) / 100 * 21); // 21 days to form habit
  
  return {
    level,
    percentage,
    nextMilestone,
    estimatedDaysToNextLevel: daysNeeded,
    tip: getHabitTip(level)
  };
}

// NEW: Get personalized habit tips
function getHabitTip(level) {
  const tips = {
    building: 'Start tiny: do just 2 minutes of your habit daily',
    developing: 'Stack it: do your habit right after an existing routine',
    strong: 'Never miss twice: if you skip a day, do it the next day no matter what',
    automatic: 'Level up: increase difficulty or add a complementary habit'
  };
  return tips[level] || 'Stay consistent!';
}

// NEW: Anti-procrastination nudges
function getAntiProcrastinationNudge() {
  const nudges = [
    "Start for just 2 minutes. That's all you need.",
    "What's the ONE thing you're avoiding? Do it first.",
    "Done is better than perfect. Ship it.",
    "5-4-3-2-1-GO! Count down and launch.",
    "Future you will thank present you for starting now.",
    "The hardest part is starting. You've got this."
  ];
  return nudges[Math.floor(Math.random() * nudges.length)];
}

module.exports = { 
  retentionFeedback, 
  calculateHabitStrength, 
  getAntiProcrastinationNudge 
};