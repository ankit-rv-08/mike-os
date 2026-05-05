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
  } = payload;

  const mind = clamp((focusMinutes / 240) * 70 + (learningMinutes / 60) * 30);
  const body = clamp((sleepHours / 8) * 60 + (waterLiters / 3) * 40);
  const work = clamp((tasksCompleted / Math.max(1, tasksTotal)) * 100);
  const discipline = clamp((habitsCompleted / Math.max(1, habitsTotal)) * 100);
  const overall = clamp(mind * 0.25 + body * 0.3 + work * 0.3 + discipline * 0.15);

  return { overall, mind, body, work, discipline };
}

module.exports = { computeLifeScore };
