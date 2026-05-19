import { Trash2, Plus } from "lucide-react";
import PlayerCard from "./PlayerCard";

export default function TeamCard({
  team,
  onAddPlayer,
  onUpdatePlayer,
  onUpdateTeamName,
  onOpenKeybindModal,
  onDeleteTeam,
  onDeletePlayer,
  playerOptions = [],
  triggerOptions = {},
}) {
  return (
    <div className="rounded-2xl border border-sky-400 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={team.name}
            onChange={(e) => onUpdateTeamName(team.id, e.target.value)}
            className="text-xl font-medium bg-transparent border-b border-sky-400 outline-none px-1"
          />
          {/* <h2 className="text-xl font-medium">{team.name}</h2> */}

          <button
            type="button"
            onClick={() => onAddPlayer(team.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400 hover:bg-sky-400/10"
            title="Add player"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDeleteTeam(team.id)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-red-300 hover:bg-red-400/10 hover:scale-105 active:scale-95 transition"
          title="Delete team"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 justify-items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.players.map((player) => (
          <PlayerCard
            key={player.id}
            teamId={team.id}
            player={player}
            onUpdatePlayer={onUpdatePlayer}
            onOpenKeybindModal={onOpenKeybindModal}
            onDeletePlayer={onDeletePlayer}
            playerOptions={playerOptions}
            triggerOptions={triggerOptions}
          />
        ))}
      </div>
    </div>
  );
}
