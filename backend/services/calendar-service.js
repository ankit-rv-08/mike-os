function dayColor(percentage) {
  if (percentage === 100) return "green";
  if (percentage >= 50) return "yellow";
  return "red";
}

function completionFromEvents(events) {
  if (!events.length) return 0;
  const done = events.filter((e) => e.completed).length;
  return Math.round((done / events.length) * 100);
}

module.exports = { dayColor, completionFromEvents };
