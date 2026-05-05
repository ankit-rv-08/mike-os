const { db } = require("../db");

module.exports = {
  name: "create_task",
  validate(params) {
    const errors = [];
    if (!params.title) errors.push("title is required");
    return { valid: errors.length === 0, errors };
  },
  execute({ params }) {
    const info = db.prepare(`
      INSERT INTO tasks (title, description, priority, due_date, domain)
      VALUES (@title, @description, @priority, @due_date, @domain)
    `).run({
      title: params.title,
      description: params.description || null,
      priority: params.priority || "medium",
      due_date: params.due_date || null,
      domain: params.domain || "work",
    });

    return {
      action: "create_task",
      data: { id: info.lastInsertRowid },
      message: `Task "${params.title}" created.`,
    };
  },
};
