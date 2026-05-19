import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import TeamCard from "./components/TeamCard";
import KeybindModal from "./components/KeybindModal";
import SettingsModal from "./components/SettingsModal";

import useConfig from "./hooks/useConfig";
import useTriggers from "./hooks/useTriggers";
import useBroadcastNames from "./hooks/useBroadcastNames";
import useTeams from "./hooks/useTeams";
import useKeybindModal from "./hooks/useKeybindModal";
import { electronAPI } from "./lib/electron";

export default function App() {
  const [lastShortcutEvent, setLastShortcutEvent] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { config, isLoadingConfig, reloadConfig } = useConfig();
  const { triggers } = useTriggers();

  const playerListType = config?.sheetParser?.playerListType || "default";

  const { players: broadcastNames, isLoadingPlayers } =
    useBroadcastNames(playerListType);

  const {
    teams,
    setTeams,
    addTeam,
    deleteTeam,
    addPlayerToTeam,
    deletePlayerFromTeam,
    updatePlayer,
    updateTeamName,
    reloadTeams,
    isLoadingTeams,
  } = useTeams(playerListType);

  const {
    keybindModal,
    openKeybindModal,
    closeKeybindModal,
    backToCapture,
    confirmKeybind,
  } = useKeybindModal(teams, setTeams);

  const handleDeleteTeam = (teamId) => {
    const confirmed = window.confirm("Delete this team?");
    if (!confirmed) return;
    deleteTeam(teamId);
  };

  const handleDeletePlayer = (teamId, playerId) => {
    const confirmed = window.confirm("Delete this player?");
    if (!confirmed) return;
    deletePlayerFromTeam(teamId, playerId);
  };

  useEffect(() => {
    electronAPI.onShortcutFired((payload) => {
      setLastShortcutEvent(payload);
    });
  }, []);

  useEffect(() => {
    if (isLoadingTeams) return;

    const syncShortcuts = async () => {
      const bindings = teams.flatMap((team) =>
        team.players
          .filter((player) => player.keybind)
          .map((player) => ({
            teamId: team.id,
            teamName: team.name,
            playerId: player.id,
            playerName: player.name,
            camera: player.camera,
            shortcut: player.keybind,
          })),
      );

      if (bindings.length === 0) {
        await electronAPI.clearShortcuts();
        return;
      }

      // const result = await electronAPI.registerShortcuts(bindings);
      const result = await electronAPI.registerUiohook(bindings);
      console.log("Shortcut registration result:", result);
    };

    syncShortcuts().catch((error) => {
      console.error("Failed to sync shortcuts:", error);
    });
  }, [teams, isLoadingTeams]);

  if (isLoadingConfig && !config) {
    return (
      <div className="min-h-screen bg-black text-sky-300 flex items-center justify-center">
        Loading config...
      </div>
    );
  }

  // if (isLoadingTeams) {
  //   return (
  //     <div className="min-h-screen bg-black text-sky-300 flex items-center justify-center">
  //       Loading teams...
  //     </div>
  //   );
  // }

  // if (isLoadingPlayers) {
  //   return (
  //     <div className="min-h-screen bg-black text-sky-300 flex items-center justify-center">
  //       Loading players...
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-black text-sky-300 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-sky-400 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Universal Cam Switching Tool
          </h1>
          
          {lastShortcutEvent && (
            <div className="mb-4 rounded-xl border border-pink-400 px-4 py-2 text-sm text-pink-300">
              Last shortcut: {lastShortcutEvent.shortcut} |{" "}
              {lastShortcutEvent.teamName || "-"} /{" "}
              {lastShortcutEvent.playerName || "-"} |{" "}
              {lastShortcutEvent.camera || "-"} | {lastShortcutEvent.status}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-sky-400/10 hover:scale-105 active:scale-95 transition"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <button
          onClick={addTeam}
          className="mb-6 rounded-xl border border-sky-400 px-4 py-2 hover:bg-sky-400/10"
        >
          Add Team
        </button>

        <div key={`${playerListType}-${teams.length}`} className="space-y-6">
          {isLoadingTeams && (
            <p className="text-sky-300 text-sm">Loading teams...</p>
          )}

          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onAddPlayer={addPlayerToTeam}
              onUpdatePlayer={updatePlayer}
              onOpenKeybindModal={openKeybindModal}
              onDeleteTeam={handleDeleteTeam}
              onDeletePlayer={handleDeletePlayer}
              playerOptions={broadcastNames}
              triggerOptions={triggers}
              onUpdateTeamName={updateTeamName}
            />
          ))}
        </div>
        {/* <div key={`${playerListType}-${teams.length}`} className="space-y-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onAddPlayer={addPlayerToTeam}
              onUpdatePlayer={updatePlayer}
              onOpenKeybindModal={openKeybindModal}
              onDeleteTeam={handleDeleteTeam}
              onDeletePlayer={handleDeletePlayer}
              playerOptions={broadcastNames}
              triggerOptions={triggers}
              onUpdateTeamName={updateTeamName}
            />
          ))}
        </div> */}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {}}
        onApplyChanges={async (newType) => {
          await reloadConfig(); // reload config FIRST
          await reloadTeams(); // then reload teams
        }}
      />

      <KeybindModal
        isOpen={keybindModal.isOpen}
        mode={keybindModal.mode}
        pendingKey={keybindModal.pendingKey}
        conflictPlayer={keybindModal.conflictPlayer}
        onClose={closeKeybindModal}
        onConfirm={confirmKeybind}
        onBackToCapture={backToCapture}
      />
    </div>
  );
}
