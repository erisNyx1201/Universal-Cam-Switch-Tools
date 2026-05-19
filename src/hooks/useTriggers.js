import { useEffect, useState } from "react";
import { electronAPI } from "../lib/electron";

export default function useTriggers() {
  const [triggers, setTriggers] = useState({});

  const loadTriggers = async () => {
    try {
      const result = await electronAPI.getTriggers();
      setTriggers(result || {});
    } catch (err) {
      console.error("Failed to load triggers:", err);
      setTriggers({});
    }
  };

  useEffect(() => {
    loadTriggers();
  }, []);

  return {
    triggers,
    reloadTriggers: loadTriggers,
  };
}