import { useState, useEffect } from "react";
import { RefreshCcw, X, ChevronDown } from "lucide-react";
import { electronAPI } from "../lib/electron";

const tabs = [
  { key: "sheet-parser", label: "Sheet Parser" },
  { key: "companion", label: "Companion" },
  { key: "frame", label: "Frame" },
];

const defaultForm = {
  sheetParser: {
    googleSheetId: "",
    playerListType: "marvel-rivals",
  },
  companion: {
    host: "127.0.0.1",
    port: 8000,
  },
  frame: {
    width: 1920,
    height: 1080,
  },
};

export default function SettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
  onApplyChanges,
}) {
  const [activeTab, setActiveTab] = useState("sheet-parser");
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setSaveMessage("");
        setTestMessage("");

        const config = await electronAPI.getConfig();

        setForm({
          sheetParser: {
            googleSheetId: config?.sheetParser?.googleSheetId ?? "",
            playerListType:
              config?.sheetParser?.playerListType ?? "marvel-rivals",
          },
          companion: {
            host: config?.companion?.host ?? "127.0.0.1",
            port: config?.companion?.port ?? 8000,
          },
          frame: {
            width: config?.frame?.width ?? 1920,
            height: config?.frame?.height ?? 1080,
          },
        });
      } catch (error) {
        console.error("Failed to load config:", error);
        setSaveMessage("Failed to load config.");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [isOpen]);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRefresh = async () => {
    try {
      setSaveMessage("");
      setTestMessage("");
      setIsLoading(true);

      const config = await electronAPI.getConfig();

      setForm({
        sheetParser: {
          googleSheetId: config?.sheetParser?.googleSheetId ?? "",
          playerListType:
            config?.sheetParser?.playerListType ?? "marvel-rivals",
        },
        companion: {
          host: config?.companion?.host ?? "127.0.0.1",
          port: config?.companion?.port ?? 8000,
        },
        frame: {
          width: config?.frame?.width ?? 1920,
          height: config?.frame?.height ?? 1080,
        },
      });

      setSaveMessage("Settings refreshed.");
    } catch (error) {
      console.error("Failed to refresh config:", error);
      setSaveMessage("Failed to refresh config.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveMessage("");
      setTestMessage("");

      const payload = {
        sheetParser: {
          googleSheetId: form.sheetParser.googleSheetId,
          playerListType: form.sheetParser.playerListType,
        },
        companion: {
          host: form.companion.host,
          port: Number(form.companion.port),
        },
        frame: {
          width: Number(form.frame.width),
          height: Number(form.frame.height),
        },
      };

      const result = await electronAPI.saveConfig(payload);

      if (result?.success) {
        setSaveMessage("Settings saved (not applied).");
        // await onSettingsSaved?.(form.sheetParser.playerListType);
      } else {
        setSaveMessage(result?.error || "Failed to save settings.");
      }
    } catch (error) {
      console.error("Failed to save config:", error);
      setSaveMessage("Failed to save settings.");
    }
  };

  const handleApply = async () => {
    await onApplyChanges?.(form.sheetParser.playerListType);
    setSaveMessage("Changes applied.");
  };

  const handleTestCompanion = async () => {
    try {
      setTestMessage("Testing...");

      const result = await electronAPI.testCompanion(
        form.companion.host,
        Number(form.companion.port),
      );

      if (result?.success) {
        setTestMessage(`Connected. Status: ${result.statusCode}`);
      } else {
        setTestMessage(result?.error || "Connection failed.");
      }
    } catch (error) {
      console.error("Failed to test companion:", error);
      setTestMessage("Connection failed.");
    }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    if (activeTab === "sheet-parser") {
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="block text-md text-sky-300">
              GOOGLE SHEET ID
            </label>
            <input
              type="text"
              value={form.sheetParser.googleSheetId}
              onChange={(e) =>
                updateSection("sheetParser", "googleSheetId", e.target.value)
              }
              className="h-12 w-full max-w-xl rounded-2xl border border-sky-400 bg-transparent px-6 py-4 text-md text-sky-300 outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-md text-sky-300">
              PLAYER LIST TYPE
            </label>
            <div className="relative w-full max-w-md">
              <select
                value={form.sheetParser.playerListType}
                onChange={(e) =>
                  updateSection("sheetParser", "playerListType", e.target.value)
                }
                className="h-12 w-full appearance-none rounded-2xl border border-sky-400 bg-transparent px-6 pr-16 text-md text-sky-300 outline-none"
              >
                <option value="marvel-rivals" className="bg-black">
                  MARVEL RIVALS
                </option>
                <option value="valorant" className="bg-black">
                  VALORANT
                </option>
                <option value="delta-force" className="bg-black">
                  DELTA FORCE
                </option>
                <option value="call-of-duty" className="bg-black">
                  CALL OF DUTY
                </option>
                <option value="pubg" className="bg-black">
                  PUBG
                </option>
                <option value="mlbb" className="bg-black">
                  MOBILE LEGENDS BANG BANG
                </option>
                <option value="coc" className="bg-black">
                  CLASH OF CLANS
                </option>
              </select>

              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-xl text-sky-300">
                <ChevronDown size={16} />
              </span>
            </div>
          </div>

          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleSave}
              className="h-12 min-w-[100px] rounded-2xl border border-sky-400 px-8 py-2 text-md text-sky-300 hover:bg-sky-400/10"
            >
              SAVE
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="h-12 min-w-[120px] rounded-2xl border border-pink-400 px-8 py-2 text-md text-pink-300 hover:bg-pink-400/10"
            >
              APPLY
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-12 min-w-[70px] items-center justify-center rounded-2xl border border-sky-400 px-4 py-4 text-sky-300 hover:bg-sky-400/10"
              title="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "companion") {
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="block text-md text-sky-300">COMPANION HOST</label>
            <input
              type="text"
              value={form.companion.host}
              onChange={(e) =>
                updateSection("companion", "host", e.target.value)
              }
              className="h-12 w-full max-w-xl rounded-2xl border border-sky-400 bg-transparent px-6 py-4 text-md text-sky-300 outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-md text-sky-300">COMPANION PORT</label>
            <input
              type="number"
              value={form.companion.port}
              onChange={(e) =>
                updateSection("companion", "port", e.target.value)
              }
              className="h-12 w-full max-w-xl rounded-2xl border border-sky-400 bg-transparent px-6 py-4 text-md text-sky-300 outline-none"
            />
          </div>

          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleSave}
              className="h-12 min-w-[100px] rounded-2xl border border-sky-400 px-8 py-2 text-md text-sky-300 hover:bg-sky-400/10"
            >
              SAVE
            </button>

            <button
              type="button"
              onClick={handleTestCompanion}
              className="h-12 min-w-[150px] rounded-2xl border border-sky-400 px-6 py-2 text-md text-sky-300 hover:bg-sky-400/10"
            >
              TEST
            </button>
          </div>

          {testMessage && (
            <p className="text-sm text-sky-200/80">{testMessage}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <label className="block text-md text-sky-300">FRAME WIDTH</label>
          <input
            type="number"
            value={form.frame.width}
            onChange={(e) => updateSection("frame", "width", e.target.value)}
            className="h-12 w-full max-w-xl rounded-2xl border border-sky-400 bg-transparent px-6 py-4 text-md text-sky-300 outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-md text-sky-300">FRAME HEIGHT</label>
          <input
            type="number"
            value={form.frame.height}
            onChange={(e) => updateSection("frame", "height", e.target.value)}
            className="h-12 w-full max-w-xl rounded-2xl border border-sky-400 bg-transparent px-6 py-4 text-md text-sky-300 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-12 min-w-[100px] rounded-2xl border border-sky-400 px-8 py-2 text-md text-sky-300 hover:bg-sky-400/10"
        >
          SAVE
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6">
      <div className="relative max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-sky-400 bg-[#151007] px-8 py-6 text-sky-300 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400 hover:bg-sky-400/10"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-8 border-b border-sky-400 pb-6 pr-16">
          {tabs.map((tab, index) => (
            <div key={tab.key} className="flex items-center gap-8">
              <button
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setSaveMessage("");
                  setTestMessage("");
                }}
                className={`text-xl transition ${
                  activeTab === tab.key ? "text-pink-300" : "text-sky-300"
                }`}
              >
                {tab.label.toUpperCase()}
              </button>

              {index !== tabs.length - 1 && (
                <span className="text-sm text-sky-300">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-12">
          {isLoading ? <p className="text-md">Loading...</p> : renderContent()}

          {saveMessage && (
            <p className="mt-4 text-sm text-sky-200/80">{saveMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
