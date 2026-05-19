const fs = require("fs");
const path = require("path");
const { loadConfig } = require("./configStore");

const teamsPath = path.join(__dirname, "../config/teams.json");

function ensureTeamsFile() {
  const configDir = path.dirname(teamsPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(teamsPath)) {
    fs.writeFileSync(teamsPath, JSON.stringify({}, null, 2), "utf-8");
  }
}

function loadAllTeams() {
  try {
    ensureTeamsFile();
    const raw = fs.readFileSync(teamsPath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load teams:", error);
    return {};
  }
}

function loadTeams(type) {
  const allTeams = loadAllTeams();
  return allTeams[type] || [];
}

function saveTeams(teams, type) {
  const allTeams = loadAllTeams();

  allTeams[type] = teams;

  fs.writeFileSync(teamsPath, JSON.stringify(allTeams, null, 2), "utf-8");

  return { success: true };
}

// function loadTeams() {
//   const config = loadConfig();
//   const type = config.sheetParser?.playerListType || "default";

//   const allTeams = loadAllTeams();
//   return allTeams[type] || [];
// }

// function saveTeams(teams) {
//   try {
//     ensureTeamsFile();

//     const config = loadConfig();
//     const type = config.sheetParser?.playerListType || "default";

//     const allTeams = loadAllTeams();

//     allTeams[type] = teams;

//     fs.writeFileSync(teamsPath, JSON.stringify(allTeams, null, 2), "utf-8");

//     return { success: true };
//   } catch (error) {
//     console.error("Failed to save teams:", error);
//     return { success: false, error: error.message };
//   }
// }

module.exports = {
  loadTeams,
  saveTeams,
};