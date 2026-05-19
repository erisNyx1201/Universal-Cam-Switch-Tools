import { useEffect, useState } from "react";
import { electronAPI } from "../lib/electron";

export default function useBroadcastNames(playerListType) {
  const [players, setPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [playersError, setPlayersError] = useState("");

  const loadPlayers = async () => {
    try {
      setIsLoadingPlayers(true);
      setPlayersError("");
      setPlayers([]);

      const result = await electronAPI.getBroadcastNames();
      console.log("Sheet result:", result);

      if (result?.success) {
        setPlayers(result.players || []);
      } else {
        setPlayers([]);
        setPlayersError(result?.error || "Failed to load players.");
      }
    } catch (error) {
      setPlayers([]);
      setPlayersError(error.message || "Failed to load players.");
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [playerListType]);

  return {
    players,
    isLoadingPlayers,
    playersError,
    reloadPlayers: loadPlayers,
  };
}
