const tasks = [];

module.exports = {
  prepare: (query) => {
    return {
      run: (title) => {
        const task = {
          id: tasks.length + 1,
          title,
          status: "pending",
          created_at: new Date().toISOString(),
        };

        tasks.push(task);

        return {
          lastInsertRowid: task.id,
        };
      },
    };
  },

  _tasks: tasks,
};