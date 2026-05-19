// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");

// const { loadConfig, saveConfig } = require("../core/configStore");
// const {
//   testCompanionConnection,
//   triggerCompanionAction,
// } = require("../core/companionClient");
// const {
//   registerShortcuts,
//   unregisterAllShortcuts,
// } = require("../core/shortcutManager");
// const { fetchBroadcastNames } = require("../core/sheetsClient");
// const { loadTeams, saveTeams } = require("../core/teamStore");

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1280,
//     height: 900,
//     minWidth: 1000,
//     minHeight: 700,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   win.loadURL("http://localhost:5173");
// }

// app.whenReady().then(() => {
//   createWindow();

//   ipcMain.handle("config:get", async () => {
//     return loadConfig();
//   });

//   ipcMain.handle("config:save", async (_, config) => {
//     return saveConfig(config);
//   });

//   ipcMain.handle("config:get-triggers", async () => {
//     const config = loadConfig();
//     return config.trigger || {};
//   });

//   ipcMain.handle("companion:test", async (_, { host, port }) => {
//     return await testCompanionConnection(host, port);
//   });

//   ipcMain.handle("companion:trigger", async (_, payload) => {
//     return await triggerCompanionAction(payload);
//   });

//   ipcMain.handle("sheet:get-broadcast-names", async () => {
//     return await fetchBroadcastNames();
//   });

//   ipcMain.handle("teams:load", async (_, type) => {
//     return loadTeams(type);
//   });

//   ipcMain.handle("teams:save", async (_, teams, type) => {
//     return saveTeams(teams, type);
//   });

//   ipcMain.handle("shortcuts:register-all", async (_, bindings) => {
//     try {
//       const results = registerShortcuts(bindings, async (binding) => {
//         const config = loadConfig();

//         const triggerPath = config.trigger?.[binding.camera];

//         if (!triggerPath) {
//           console.warn("No trigger mapping for camera:", binding.camera);
//           return;
//         }

//         const endpoint = `/api/press/${triggerPath}`;

//         const result = await triggerCompanionAction({
//           host: config.companion.host,
//           port: Number(config.companion.port),
//           endpoint,
//         });

//         console.log("Shortcut triggered:", {
//           shortcut: binding.shortcut,
//           camera: binding.camera,
//           endpoint,
//           result,
//         });
//       });

//       return {
//         success: true,
//         results,
//       };
//     } catch (error) {
//       console.error("Failed to register shortcuts:", error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   });

//   ipcMain.handle("shortcuts:clear", async () => {
//     unregisterAllShortcuts();
//     return { success: true };
//   });

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on("will-quit", () => {
//   unregisterAllShortcuts();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { loadConfig, saveConfig } = require("../core/configStore");
const {
  testCompanionConnection,
  triggerCompanionAction,
} = require("../core/companionClient");
const {
  registerShortcuts,
  unregisterAllShortcuts,
} = require("../core/shortcutManager");
const { fetchBroadcastNames } = require("../core/sheetsClient");
const { loadTeams, saveTeams } = require("../core/teamStore");
const { logDebug } = require("../core/debugLogger");
const {
  registerUiohookBindings,
  stopUiohook,
} = require("../core/uiohookManager");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("config:get", async () => {
    return loadConfig();
  });

  ipcMain.handle("config:save", async (_, config) => {
    return saveConfig(config);
  });

  ipcMain.handle("config:get-triggers", async () => {
    const config = loadConfig();
    return config.trigger || {};
  });

  ipcMain.handle("companion:test", async (_, { host, port }) => {
    return await testCompanionConnection(host, port);
  });

  ipcMain.handle("companion:trigger", async (_, payload) => {
    return await triggerCompanionAction(payload);
  });

  ipcMain.handle("sheet:get-broadcast-names", async () => {
    return await fetchBroadcastNames();
  });

  ipcMain.handle("teams:load", async (_, type) => {
    return loadTeams(type);
  });

  ipcMain.handle("teams:save", async (_, teams, type) => {
    return saveTeams(teams, type);
  });

  ipcMain.handle("shortcuts:register-all", async (_, bindings) => {
    try {
      // const results = registerShortcuts(bindings, async (binding) => {
      //   const config = loadConfig();

      //   const triggerPath = config.trigger?.[binding.camera];

      //   if (!triggerPath) {
      //     console.warn("No trigger mapping for camera:", binding.camera);
      //     return;
      //   }

      //   const endpoint = `/api/press/${triggerPath}`;

      //   const result = await triggerCompanionAction({
      //     host: config.companion.host,
      //     port: Number(config.companion.port),
      //     endpoint,
      //   });

      //   console.log("Shortcut triggered:", {
      //     shortcut: binding.shortcut,
      //     camera: binding.camera,
      //     endpoint,
      //     result,
      //   });
      // });

      const results = registerShortcuts(bindings, async (binding) => {
        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send("shortcut:fired", {
            shortcut: binding.shortcut,
            playerName: binding.playerName,
            teamName: binding.teamName,
            camera: binding.camera,
            timestamp: Date.now(),
            status: "fired",
          });
        });

        const config = loadConfig();

        const triggerPath = config.trigger?.[binding.camera];

        if (!triggerPath) {
          BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send("shortcut:fired", {
              shortcut: binding.shortcut,
              playerName: binding.playerName,
              teamName: binding.teamName,
              camera: binding.camera,
              timestamp: Date.now(),
              status: "missing-trigger",
            });
          });

          return;
        }

        const endpoint = `/api/press/${triggerPath}`;

        // BEFORE
        logDebug("shortcut fired (before trigger)", {
          shortcut: binding.shortcut,
          playerName: binding.playerName,
          teamName: binding.teamName,
          camera: binding.camera,
        });

        // CALL
        const result = await triggerCompanionAction({
          host: config.companion.host,
          port: Number(config.companion.port),
          endpoint,
        });

        // AFTER
        logDebug("shortcut result", {
          shortcut: binding.shortcut,
          endpoint,
          success: result?.success,
          statusCode: result?.statusCode,
        });

        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send("shortcut:fired", {
            shortcut: binding.shortcut,
            playerName: binding.playerName,
            teamName: binding.teamName,
            camera: binding.camera,
            endpoint,
            result,
            timestamp: Date.now(),
            status: result?.success ? "success" : "failed",
          });
        });
      });

      return {
        success: true,
        results,
      };
    } catch (error) {
      console.error("Failed to register shortcuts:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  });

  ipcMain.handle("shortcuts:clear", async () => {
    unregisterAllShortcuts();
    return { success: true };
  });

  ipcMain.handle("uiohook:register-all", async (_, bindings) => {
    try {
      const results = registerUiohookBindings(bindings, async (binding) => {
        console.log("uiohook fired:", binding);

        // For first test, only notify UI.
        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send("shortcut:fired", {
            shortcut: binding.shortcut,
            playerName: binding.playerName,
            teamName: binding.teamName,
            camera: binding.camera,
            timestamp: Date.now(),
            status: "uiohook-fired",
          });
        });
      });

      return { success: true, results };
    } catch (error) {
      console.error("Failed to register uiohook:", error);
      return { success: false, error: error.message };
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("will-quit", () => {
  unregisterAllShortcuts();
  stopUiohook();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
