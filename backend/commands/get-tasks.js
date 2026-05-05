const { db } = require("../db");

module.exports = {
  name: "get_tasks",
  execute() {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY created_at DESC").all();
    return {
      action: "get_tasks",
      data: { tasks },
      message: "Tasks fetched.",
    };
  },
};
