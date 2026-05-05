const { db } = require("../db");

module.exports = {
  name: "create_event",
  validate(params) {
    const errors = [];
    if (!params.title) errors.push("title is required");
    if (!params.start_time) errors.push("start_time is required");
    return { valid: errors.length === 0, errors };
  },
  execute({ params }) {
    const info = db.prepare(`
      INSERT INTO events (title, start_time, end_time, event_type, linked_task_id)
      VALUES (@title, @start_time, @end_time, @event_type, @linked_task_id)
    `).run({
      title: params.title,
      start_time: params.start_time,
      end_time: params.end_time || null,
      event_type: params.event_type || "meeting",
      linked_task_id: params.linked_task_id || null,
    });

    return {
      action: "create_event",
      data: { id: info.lastInsertRowid },
      message: "Event created.",
    };
  },
};
