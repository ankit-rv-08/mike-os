const { exec } = require("child_process");
const open = require("open");

async function openUrl(url) {
  await open(url);
  return { type: "url", target: url };
}

function runSafeCommand(command) {
  const allow = ["dir", "pwd", "whoami", "date", "time"];
  if (!allow.includes(command)) throw new Error("Command not allowed");

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

module.exports = { openUrl, runSafeCommand };
