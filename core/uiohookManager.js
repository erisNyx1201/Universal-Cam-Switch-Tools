const { uIOhook, UiohookKey } = require("uiohook-napi");

let bindings = [];
let started = false;

const keyMap = {
  F1: UiohookKey.F1,
  F2: UiohookKey.F2,
  F3: UiohookKey.F3,
  F4: UiohookKey.F4,
  F5: UiohookKey.F5,
  F6: UiohookKey.F6,
  F7: UiohookKey.F7,
  F8: UiohookKey.F8,
  F9: UiohookKey.F9,
  F10: UiohookKey.F10,
  F11: UiohookKey.F11,
  F12: UiohookKey.F12,
};

function shortcutToKeycode(shortcut) {
  return keyMap[shortcut];
}

function registerUiohookBindings(nextBindings, onTrigger) {
  bindings = nextBindings
    .map((binding) => ({
      ...binding,
      keycode: shortcutToKeycode(binding.shortcut),
    }))
    .filter((binding) => binding.keycode);

  if (!started) {
    uIOhook.on("keydown", (event) => {
      const matched = bindings.find((binding) => binding.keycode === event.keycode);
      if (matched) {
        onTrigger(matched);
      }
    });

    uIOhook.start();
    started = true;
  }

  return bindings.map((binding) => ({
    shortcut: binding.shortcut,
    success: true,
    binding,
  }));
}

function stopUiohook() {
  if (!started) return;
  uIOhook.stop();
  started = false;
  bindings = [];
}

module.exports = {
  registerUiohookBindings,
  stopUiohook,
};