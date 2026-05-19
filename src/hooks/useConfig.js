import { useEffect, useState } from "react";
import { electronAPI } from "../lib/electron";

export default function useConfig() {
  const [config, setConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const loadConfig = async () => {
    try {
      setIsLoadingConfig(true);
      const result = await electronAPI.getConfig();
      setConfig(result);
    } catch (err) {
      console.error("Failed to load config:", err);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoadingConfig,
    reloadConfig: loadConfig,
  };
}