module.exports = async function createTask(input) {
  const task = input.replace(/create task/i, "").trim();

  // TEMP: no DB (Vercel-safe)
  return {
    message: `Task created: ${task}`,
  };
};