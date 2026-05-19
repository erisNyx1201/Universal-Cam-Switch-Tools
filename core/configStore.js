const fs = require("fs");
const path = require("path");
const defaultConfig = require("./defaultConfig");

const configPath = path.join(__dirname, "../config/appConfig.json");

function ensureConfigFile() {
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(defaultConfig, null, 2),
      "utf-8"
    );
  }
}

function mergeConfig(base, incoming) {
  return {
    ...base,
    ...incoming,
    sheetParser: {
      ...(base.sheetParser || {}),
      ...(incoming.sheetParser || {}),
    },
    google: {
      ...(base.google || {}),
      ...(incoming.google || {}),
    },
    companion: {
      ...(base.companion || {}),
      ...(incoming.companion || {}),
    },
    frame: {
      ...(base.frame || {}),
      ...(incoming.frame || {}),
    },
    trigger: {
      ...(base.trigger || {}),
      ...(incoming.trigger || {}),
    },
  };
}

function loadConfig() {
  try {
    ensureConfigFile();

    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw);

    return mergeConfig(defaultConfig, parsed);
  } catch (error) {
    console.error("Failed to load config:", error);
    return defaultConfig;
  }
}

function saveConfig(newConfig) {
  try {
    ensureConfigFile();

    const currentConfig = loadConfig();
    const merged = mergeConfig(currentConfig, newConfig);

    fs.writeFileSync(configPath, JSON.stringify(merged, null, 2), "utf-8");

    return {
      success: true,
      config: merged,
    };
  } catch (error) {
    console.error("Failed to save config:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  loadConfig,
  saveConfig,
};