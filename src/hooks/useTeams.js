import { useEffect, useRef, useState } from "react";
import { electronAPI } from "../lib/electron";

function createDefaultTeams() {
  return [
    {
      id: crypto.randomUUID(),
      name: "Team 1",
      players: [
        {
          id: crypto.randomUUID(),
          name: "",
          camera: "cam1",
          keybind: "",
        },
      ],
    },
  ];
}

export default function useTeams(playerListType) {
  const [teams, setTeams] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  const hasHydratedRef = useRef(false);
  const previousTypeRef = useRef(null);
  const isSwitchingTypeRef = useRef(false);

  const loadTeamsForType = async (type, { createDefault = false } = {}) => {
    if (!type) return;

    isSwitchingTypeRef.current = true; // 👈 block save
    setIsLoadingTeams(true);

    try {
      const savedTeams = await electronAPI.loadTeams(type);

      if (Array.isArray(savedTeams) && savedTeams.length > 0) {
        setTeams(savedTeams);
      } else if (createDefault) {
        setTeams(createDefaultTeams());
      } else {
        setTeams([]);
      }
    } finally {
      setIsLoadingTeams(false);

      setTimeout(() => {
        isSwitchingTypeRef.current = false; // 👈 allow save again
      }, 0);
    }
  };

  useEffect(() => {
    if (!playerListType) return;

    const isFirstLoad = previousTypeRef.current === null;
    previousTypeRef.current = playerListType;

    loadTeamsForType(playerListType, { createDefault: isFirstLoad });
  }, [playerListType]);

  useEffect(() => {

    console.log("AUTO SAVE EFFECT", {
      isSwitching: isSwitchingTypeRef.current,
      isLoadingTeams,
      playerListType,
      teamsLength: teams.length,
    });
    
    if (!playerListType) return;
    if (!hasHydratedRef.current) return;
    if (isLoadingTeams) return;
    if (isSwitchingTypeRef.current) return;

    const persistTeams = async () => {
      await electronAPI.saveTeams(teams, playerListType);
    };

    persistTeams();
  }, [teams, playerListType, isLoadingTeams]);

  const reloadTeams = async () => {
    await loadTeamsForType(playerListType, { createDefault: false });
  };

  const addTeam = () => {
    const newTeam = {
      id: crypto.randomUUID(),
      name: `Team ${teams.length + 1}`,
      players: [],
    };

    setTeams((prev) => [...prev, newTeam]);
  };

  const deleteTeam = (teamId) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
  };

  const updateTeamName = (teamId, value) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, name: value } : team,
      ),
    );
  };

  const addPlayerToTeam = (teamId) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: [
                ...team.players,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  camera: "cam1",
                  keybind: "",
                },
              ],
            }
          : team,
      ),
    );
  };

  const deletePlayerFromTeam = (teamId, playerId) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.filter((player) => player.id !== playerId),
            }
          : team,
      ),
    );
  };

  const updatePlayer = (teamId, playerId, field, value) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player) =>
                player.id === playerId ? { ...player, [field]: value } : player,
              ),
            }
          : team,
      ),
    );
  };

  return {
    teams,
    setTeams,
    addTeam,
    deleteTeam,
    updateTeamName,
    addPlayerToTeam,
    deletePlayerFromTeam,
    updatePlayer,
    reloadTeams,
    isLoadingTeams,
  };
}
