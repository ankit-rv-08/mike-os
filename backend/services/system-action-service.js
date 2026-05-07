// system-action-service.js - Enhanced with more utilities

const { exec } = require("child_process");
const open = require("open");
const os = require('os');

async function openUrl(url) {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }
  
  await open(url);
  return { type: "url", target: url, opened: true };
}

async function openApp(appName) {
  const apps = {
    vscode: 'code',
    terminal: process.platform === 'win32' ? 'start cmd' : 'open -a Terminal',
    browser: process.platform === 'win32' ? 'start chrome' : 'open -a "Google Chrome"',
    calculator: process.platform === 'win32' ? 'calc' : 'open -a Calculator',
    notes: process.platform === 'win32' ? 'notepad' : 'open -a Notes',
    spotify: process.platform === 'win32' ? 'start spotify:' : 'open -a Spotify'
  };
  
  const command = apps[appName.toLowerCase()];
  if (!command) throw new Error(`Unknown app: ${appName}`);
  
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) reject(err);
      else resolve({ type: "app", target: appName, opened: true });
    });
  });
}

function runSafeCommand(command) {
  const allow = ["dir", "pwd", "whoami", "date", "time", "ls", "echo", "node --version", "npm --version"];
  
  if (!allow.includes(command)) {
    throw new Error(`Command not allowed. Allowed commands: ${allow.join(', ')}`);
  }

  return new Promise((resolve, reject) => {
    exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

// NEW: System info
function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + ' GB',
    freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)) + ' GB',
    uptime: Math.round(os.uptime() / 3600) + ' hours',
    hostname: os.hostname(),
    nodeVersion: process.version
  };
}

// NEW: Clipboard operations (limited)
function getClipboardContent() {
  // This would need clipboardy package
  return { message: 'Clipboard access available in desktop version' };
}

module.exports = { 
  openUrl, 
  runSafeCommand, 
  openApp,
  getSystemInfo,
  getClipboardContent
};