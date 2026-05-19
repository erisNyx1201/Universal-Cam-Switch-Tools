export default function KeybindModal({
  isOpen,
  mode,
  pendingKey,
  conflictPlayer,
  onClose,
  onConfirm,
  onBackToCapture,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-md rounded-2xl border border-sky-400 bg-[#151007] p-8 text-sky-300 shadow-2xl">
        {mode === "capture" && (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <p className="mb-10 text-xl">
              Please click on the newly assigned key.
            </p>

            <div className="flex h-40 w-32 items-end justify-center rounded-2xl border border-sky-400">
              <div className="mb-4 flex gap-3">
                <span className="h-5 w-5 rounded-full border border-sky-400" />
                <span className="h-5 w-5 rounded-full border border-sky-400" />
                <span className="h-5 w-5 rounded-full border border-sky-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-xl border border-sky-400 px-5 py-2 hover:bg-sky-400/10"
            >
              Cancel
            </button>
          </div>
        )}

        {mode === "confirm" && (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <p className="mb-6 text-xl">Confirm this key binding?</p>

            <div className="mb-8 inline-flex min-h-[128px] min-w-[128px] w-fit items-center justify-center rounded-2xl border border-sky-400 px-6 text-3xl text-center">
              {pendingKey}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBackToCapture}
                className="rounded-xl border border-sky-400 px-5 py-2 hover:bg-sky-400/10"
              >
                Back
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="rounded-xl border border-sky-400 px-5 py-2 hover:bg-sky-400/10"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {mode === "conflict" && (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <p className="mb-3 text-xl">This key is already in use!</p>
            <p className="mb-8 text-lg">
              Are you sure you want to override it?
            </p>

            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border border-sky-400 text-4xl">
              {pendingKey}
            </div>

            {conflictPlayer && (
              <p className="mb-6 text-sm text-sky-200/80">
                Currently assigned to {conflictPlayer.playerName} in{" "}
                {conflictPlayer.teamName}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBackToCapture}
                className="rounded-xl border border-sky-400 px-5 py-2 hover:bg-sky-400/10"
              >
                Back
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="rounded-xl border border-sky-400 px-5 py-2 hover:bg-sky-400/10"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
