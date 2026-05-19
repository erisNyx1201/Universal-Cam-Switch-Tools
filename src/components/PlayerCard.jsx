import { Trash2 } from "lucide-react";

export default function PlayerCard({
  teamId,
  player,
  onUpdatePlayer,
  onOpenKeybindModal,
  onDeletePlayer,
  playerOptions = [],
  triggerOptions = {},
}) {
  return (
    <div className="w-fit rounded-xl border border-sky-400 p-3">
      <div className="flex items-center gap-2">
        <select
          value={player.name}
          onChange={(e) =>
            onUpdatePlayer(teamId, player.id, "name", e.target.value)
          }
          className="h-10 appearance-none rounded-lg border border-sky-400 bg-black px-4 pr-10 text-sm outline-none"
        >
          {playerOptions.length === 0 ? (
            <option value="">No players loaded</option>
          ) : (
            playerOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))
          )}
        </select>
        {/* <select
          value={player.name}
          onChange={(e) =>
            onUpdatePlayer(teamId, player.id, "name", e.target.value)
          }
          className="h-10 rounded-lg bg-black px-3 outline-none"
        >
          <option value="p1">Player 1</option>
          <option value="p2">Player 2</option>
          <option value="p3">Player 3</option>
          <option value="p4">Player 4</option>
          <option value="p5">Player 5</option>
        </select> */}

        <select
          value={player.camera}
          onChange={(e) =>
            onUpdatePlayer(teamId, player.id, "camera", e.target.value)
          }
          className="h-10 rounded-lg bg-black px-3 text-sm outline-none"
        >
          {Object.keys(triggerOptions).length === 0 ? (
            <option value="">No cams</option>
          ) : (
            Object.keys(triggerOptions).map((camKey) => (
              <option key={camKey} value={camKey}>
                {camKey.replace("cam", "Cam ")}
              </option>
            ))
          )}
        </select>

        <button
          type="button"
          onClick={() => onOpenKeybindModal(teamId, player.id)}
          className="h-10 min-w-[40px] rounded-lg border border-sky-400 px-3 text-sm hover:bg-sky-400/10"
        >
          {player.keybind || "Set Key"}
        </button>

        <button
          type="button"
          onClick={() => onDeletePlayer(teamId, player.id)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-red-300 hover:bg-red-400/10 hover:scale-105 active:scale-95 transition"
          title="Delete player"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
