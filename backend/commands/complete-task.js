const { db } = require("../db");

module.exports = {
  name: "complete_task",
  validate(params) {
    const errors = [];
    if (!params.id) errors.push("id is required");
    return { valid: errors.length === 0, errors };
  },
  execute({ params }) {
    db.prepare(`
      UPDATE tasks
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(params.id);

    return {
      action: "complete_task",
      data: { id: params.id },
      message: `Task #${params.id} marked complete.`,
    };
  },
};
