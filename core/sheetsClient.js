const { loadConfig } = require("./configStore");

async function fetchSheetValues() {
  const config = loadConfig();

  const spreadsheetId = config.sheetParser?.googleSheetId;
  const sheetName = config.sheetParser?.sheetName || "Teams";
  const apiKey = config.google?.apiKey;

  if (!spreadsheetId) {
    return { success: false, error: "Missing Google Sheet ID." };
  }

  if (!apiKey) {
    return { success: false, error: "Missing Google API key." };
  }

  const range = encodeURIComponent(`${sheetName}!A:Z`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}` +
    `?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.error?.message || "Failed to fetch sheet values.",
      };
    }

    return {
      success: true,
      values: data.values || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function fetchBroadcastNames() {
  const config = loadConfig();
  const headerName = config.sheetParser?.broadcastNameColumn || "Broadcast Name";

  const result = await fetchSheetValues();
  if (!result.success) return result;

  const rows = result.values || [];
  if (rows.length === 0) {
    return { success: true, players: [] };
  }

  const headers = rows[0];
  const broadcastNameIndex = headers.findIndex(
    (header) => String(header).trim().toLowerCase() === headerName.trim().toLowerCase()
  );

  if (broadcastNameIndex === -1) {
    return {
      success: false,
      error: `Column "${headerName}" not found.`,
    };
  }

  const players = rows
    .slice(1)
    .map((row) => row[broadcastNameIndex])
    .filter((name) => typeof name === "string" && name.trim() !== "")
    .map((name) => name.trim());

  return {
    success: true,
    players,
  };
}

module.exports = {
  fetchSheetValues,
  fetchBroadcastNames,
};