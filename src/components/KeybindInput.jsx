import { useState } from "react";

export default function KeybindInput({ value, onChange }) {
  const [isListening, setIsListening] = useState(false);

  const handleKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const parts = [];

    if (e.ctrlKey) parts.push("CTRL");
    if (e.shiftKey) parts.push("SHIFT");
    if (e.altKey) parts.push("ALT");

    const ignoredKeys = ["Control", "Shift", "Alt"];
    if (!ignoredKeys.includes(e.key)) {
      parts.push(e.key.toUpperCase());
    }

    const finalKey = parts.join("+");
    onChange(finalKey);
    setIsListening(false);
  };

  return (
    <button
      type="button"
      onClick={() => setIsListening(true)}
      onKeyDown={isListening ? handleKeyDown : undefined}
      className="min-w-[90px] rounded-lg border border-sky-400 px-3 py-2 text-center hover:bg-sky-400/10"
    >
      {isListening ? "Press key..." : value || "Set Key"}
    </button>
  );
}