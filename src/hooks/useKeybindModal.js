import { useEffect, useState } from "react";

const MODIFIER_KEYS = ["Control", "Shift", "Alt", "Meta"];

export default function useKeybindModal(teams, setTeams) {
  const [keybindModal, setKeybindModal] = useState({
    isOpen: false,
    teamId: null,
    playerId: null,
    pendingKey: "",
    conflictPlayer: null,
    mode: "capture",
  });

  const openKeybindModal = (teamId, playerId) => {
    setKeybindModal({
      isOpen: true,
      teamId,
      playerId,
      pendingKey: "",
      conflictPlayer: null,
      mode: "capture",
    });
  };

  const closeKeybindModal = () => {
    setKeybindModal({
      isOpen: false,
      teamId: null,
      playerId: null,
      pendingKey: "",
      conflictPlayer: null,
      mode: "capture",
    });
  };

  const backToCapture = () => {
    setKeybindModal((prev) => ({
      ...prev,
      pendingKey: "",
      conflictPlayer: null,
      mode: "capture",
    }));
  };

  const findPlayerUsingKey = (key, currentPlayerId) => {
    for (const team of teams) {
      for (const player of team.players) {
        if (player.keybind === key && player.id !== currentPlayerId) {
          return {
            teamId: team.id,
            teamName: team.name,
            playerId: player.id,
            playerName: player.name,
          };
        }
      }
    }
    return null;
  };

  const buildKeyString = (e) => {
    const parts = [];

    if (e.ctrlKey || e.metaKey) parts.push("Cmd/Ctrl");
    if (e.shiftKey) parts.push("Shift");
    if (e.altKey) parts.push("Alt");

    if (MODIFIER_KEYS.includes(e.key)) {
      return null;
    }

    let key = e.key;

    if (key === " ") key = "Space";
    else if (key === "Escape") key = "Esc";
    else if (key === "ArrowUp") key = "Up";
    else if (key === "ArrowDown") key = "Down";
    else if (key === "ArrowLeft") key = "Left";
    else if (key === "ArrowRight") key = "Right";
    else if (key.length === 1) key = key.toUpperCase();

    parts.push(key);
    return parts.join("+");
  };

  useEffect(() => {
    if (!keybindModal.isOpen || keybindModal.mode !== "capture") return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        closeKeybindModal();
        return;
      }

      const nextKey = buildKeyString(e);
      if (!nextKey) return;

      const conflict = findPlayerUsingKey(nextKey, keybindModal.playerId);

      if (conflict) {
        setKeybindModal((prev) => ({
          ...prev,
          pendingKey: nextKey,
          conflictPlayer: conflict,
          mode: "conflict",
        }));
      } else {
        setKeybindModal((prev) => ({
          ...prev,
          pendingKey: nextKey,
          conflictPlayer: null,
          mode: "confirm",
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keybindModal, teams]);

  const confirmKeybind = () => {
    const { teamId, playerId, pendingKey, conflictPlayer } = keybindModal;

    if (!pendingKey) return;

    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        players: team.players.map((player) => {
          if (conflictPlayer && player.id === conflictPlayer.playerId) {
            return { ...player, keybind: "" };
          }

          if (team.id === teamId && player.id === playerId) {
            return { ...player, keybind: pendingKey };
          }

          return player;
        }),
      }))
    );

    closeKeybindModal();
  };

  return {
    keybindModal,
    openKeybindModal,
    closeKeybindModal,
    backToCapture,
    confirmKeybind,
  };
}