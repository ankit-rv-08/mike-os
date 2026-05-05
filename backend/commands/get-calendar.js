const { db } = require("../db");
const { completionFromEvents, dayColor } = require("../services/calendar-service");

module.exports = {
  name: "get_calendar",
  execute({ params }) {
    const month = params.month || new Date().toISOString().slice(0, 7);
    const events = db.prepare(`
      SELECT id, title, start_time, end_time, event_type
      FROM events
      WHERE strftime('%Y-%m', start_time) = ?
      ORDER BY start_time ASC
    `).all(month);

    const byDay = {};
    for (const event of events) {
      const day = new Date(event.start_time).getDate();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ ...event, completed: event.event_type !== "task" });
    }

    const days = Object.entries(byDay).map(([day, dayEvents]) => {
      const completion = completionFromEvents(dayEvents);
      return {
        day: Number(day),
        completion,
        color: dayColor(completion),
        events: dayEvents,
      };
    });

    return {
      action: "get_calendar",
      data: { month, days },
      message: "Calendar fetched.",
    };
  },
};
