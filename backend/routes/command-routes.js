const express = require("express");
const router = express.Router();

let tasks = []; // temp memory (we’ll upgrade DB later)

// POST /api/command
router.post("/command", (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.json({ message: "No input provided" });
  }

  const lower = input.toLowerCase();

  // ===== CREATE TASK =====
  if (lower.startsWith("create task")) {
    const title = input.replace(/create task/i, "").trim();

    if (!title) {
      return res.json({ message: "Task title missing" });
    }

    const task = {
      id: Date.now(),
      title,
      completed: false,
    };

    tasks.push(task);

    return res.json({
      result: {
        message: `✅ Task "${title}" created`,
        task,
      },
    });
  }

  // ===== GET TASKS =====
  if (lower.includes("get tasks") || lower.includes("show tasks")) {
    return res.json({
      result: {
        message: `You have ${tasks.length} tasks`,
        tasks,
      },
    });
  }

  // ===== COMPLETE TASK =====
  if (lower.startsWith("complete task")) {
    const title = input.replace(/complete task/i, "").trim();

    const task = tasks.find((t) =>
      t.title.toLowerCase().includes(title.toLowerCase())
    );

    if (!task) {
      return res.json({
        result: { message: "Task not found" },
      });
    }

    task.completed = true;

    return res.json({
      result: {
        message: `✅ Task "${task.title}" completed`,
      },
    });
  }

  // ===== FALLBACK =====
  return res.json({
    result: {
      message: `You said: ${input}`,
    },
  });
});

module.exports = router;