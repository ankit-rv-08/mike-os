// calendar-service.js - Enhanced with streak calculations
function dayColor(percentage) {
  if (percentage === 100) return "green";
  if (percentage >= 75) return "light-green";
  if (percentage >= 50) return "yellow";
  if (percentage >= 25) return "orange";
  return "red";
}

function completionFromEvents(events) {
  if (!events || !events.length) return 0;
  const done = events.filter((e) => e.completed).length;
  return Math.round((done / events.length) * 100);
}

// New: Calculate streaks
function calculateStreak(dailyData) {
  if (!dailyData || !dailyData.length) return { current: 0, longest: 0 };
  
  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  
  for (const day of dailyData) {
    if (day.completionRate >= 80) { // 80% completion counts as "completed day"
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Get current streak (from end)
  current = tempStreak;
  
  return { current, longest };
}

// New: Weekly summary
function getWeeklySummary(weekData) {
  if (!weekData || !weekData.length) return null;
  
  const avgCompletion = Math.round(
    weekData.reduce((sum, day) => sum + day.completionRate, 0) / weekData.length
  );
  
  const bestDay = weekData.reduce((best, day) => 
    day.completionRate > best.completionRate ? day : best
  );
  
  return {
    averageCompletion: avgCompletion,
    bestDay: bestDay.date,
    bestDayScore: bestDay.completionRate,
    totalTasks: weekData.reduce((sum, day) => sum + (day.totalTasks || 0), 0),
    trend: avgCompletion > 70 ? 'improving' : 'needs work'
  };
}

module.exports = { dayColor, completionFromEvents, calculateStreak, getWeeklySummary };