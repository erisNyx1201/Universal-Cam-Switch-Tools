const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "../config/shortcut-debug.log");

function logDebug(message, data = {}) {
  const line = `[${new Date().toISOString()}] ${message} ${JSON.stringify(data)}\n`;
  fs.appendFileSync(logPath, line, "utf-8");
}

module.exports = {
  logDebug,
};