const { globalShortcut } = require("electron");

let registeredShortcuts = [];

function unregisterAllShortcuts() {
  globalShortcut.unregisterAll();
  registeredShortcuts = [];
}

function registerShortcuts(bindings, onTrigger) {
  unregisterAllShortcuts();

  const results = [];

  for (const binding of bindings) {
    const shortcut = binding?.shortcut;

    if (!shortcut) continue;

    const success = globalShortcut.register(shortcut, () => {
      onTrigger(binding);
    });

    if (success) {
      registeredShortcuts.push(shortcut);
    }

    results.push({
      shortcut,
      success,
      binding,
    });
  }

  return results;
}

function getRegisteredShortcuts() {
  return [...registeredShortcuts];
}

module.exports = {
  registerShortcuts,
  unregisterAllShortcuts,
  getRegisteredShortcuts,
};