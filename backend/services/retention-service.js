function retentionFeedback({ streak = 0, missedYesterday = 0 }) {
  const feedback = [];
  if (missedYesterday > 0) feedback.push(`You missed ${missedYesterday} key items yesterday.`);
  if (streak > 0) feedback.push(`Current streak: ${streak} days. Keep it alive today.`);
  if (missedYesterday === 0) feedback.push("Great continuity. Keep stacking wins.");
  return feedback;
}

module.exports = { retentionFeedback };
