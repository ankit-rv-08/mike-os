const createTask = require("../commands/create-task");
const getTasks = require("../commands/get-tasks");
const completeTask = require("../commands/complete-task");
const createEvent = require("../commands/create-event");
const getCalendar = require("../commands/get-calendar");

async function routeCommand(input) {
  const text = input.toLowerCase();

  // CREATE TASK
  if (text.includes("create task") || text.includes("add task")) {
    const title = input.replace(/create task|add task/i, "").replace(/:/g, "").trim();
    if (!title) return { message: "Please provide a task name." };
    const result = await createTask(title);
    return { message: `Task created: ${title}`, data: result };
  }

  // CREATE EVENT
  if (text.includes("create event") || text.includes("add event") || text.includes("schedule")) {
    const cleaned = input.replace(/create event|add event|schedule/i, "").replace(/:/g, "").trim();
    if (!cleaned) return { message: "Please provide an event name." };
    const result = await createEvent({ title: cleaned, date: new Date().toISOString().slice(0, 10) });
    return { message: `Event created: ${cleaned}`, data: result };
  }

  // GET TASKS
  if (text.includes("show tasks") || text.includes("get tasks") || text.includes("list tasks")) {
    const tasks = await getTasks();
    if (!tasks.length) return { message: "No tasks found." };
    return { message: "Your Tasks:\n" + tasks.map((t, i) => `${i + 1}. ${t.title}`).join("\n"), data: tasks };
  }

  // GET CALENDAR
  if (text.includes("show calendar") || text.includes("get calendar") || text.includes("my schedule") || text.includes("calendar")) {
    const events = await getCalendar();
    if (!events || !events.length) return { message: "No events scheduled." };
    return { message: "Your Calendar:\n" + events.map(e => `${e.date} ${e.time || ''}: ${e.title}`).join("\n"), data: events };
  }

  // COMPLETE TASK
  if (text.includes("complete task") || text.includes("done task")) {
    const title = input.replace(/complete task|done task/i, "").replace(/:/g, "").trim();
    const result = await completeTask(title);
    return { message: `Task completed: ${title}`, data: result };
  }

  return { message: `I didn't understand: "${input}". Try "create task", "add event", or "show calendar".` };
}

module.exports = routeCommand;