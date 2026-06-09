console.log("✅ preload loaded");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  notifyTrigger: (payload) =>
  ipcRenderer.invoke("socket:trigger", payload),
  
  getTriggers: () => ipcRenderer.invoke("config:get-triggers"),

  getConfig: () => ipcRenderer.invoke("config:get"),
  saveConfig: (config) => ipcRenderer.invoke("config:save", config),

  testCompanion: (host, port) =>
    ipcRenderer.invoke("companion:test", { host, port }),

  triggerCompanion: (payload) =>
    ipcRenderer.invoke("companion:trigger", payload),

  registerShortcuts: (bindings) =>
    ipcRenderer.invoke("shortcuts:register-all", bindings),

  clearShortcuts: () => ipcRenderer.invoke("shortcuts:clear"),

  getBroadcastNames: () => ipcRenderer.invoke("sheet:get-broadcast-names"),

  loadTeams: (type) => ipcRenderer.invoke("teams:load", type),
  saveTeams: (teams, type) => ipcRenderer.invoke("teams:save", teams, type),

  onShortcutFired: (callback) =>
    ipcRenderer.on("shortcut:fired", (_, payload) => callback(payload)),

  registerUiohook: (bindings) =>
  ipcRenderer.invoke("uiohook:register-all", bindings),
});
