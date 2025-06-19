import { useState } from "react";
import { exportSettings, importSettings } from "../services/export-settings";
import { useStore } from "../store/store";
import "./setup.css";

interface SetupProps {
  onShouldExit: () => void;
}

export default function Setup({ onShouldExit }: SetupProps) {
  const storyGeminiApiKey = useStore.use.geminiApiKey();
  const storeIntervalMilliseconds = useStore.use.intervalMilliseconds();

  const [intervalMilliseconds, setIntervalMilliseconds] = useState(
    storeIntervalMilliseconds
  );

  const [geminiApiKey, setGeminiApiKey] = useState(storyGeminiApiKey);

  const saveSettings = () => {
    useStore.getState().setGeminiApiKey(geminiApiKey);
    useStore.getState().setIntervalMilliseconds(intervalMilliseconds);
    onShouldExit();
  };

  const cancelSettings = () => {
    onShouldExit();
  };

  return (
    <div className="setup-container">
      <input
        type="password"
        value={geminiApiKey}
        onChange={(e) => setGeminiApiKey(e.target.value)}
      />
      <input
        type="number"
        value={intervalMilliseconds}
        onChange={(e) => setIntervalMilliseconds(Number(e.target.value))}
      />
      <button onClick={exportSettings}>Export Settings</button>
      <button onClick={importSettings}>Import Settings</button>
      <button onClick={saveSettings}>Save Settings</button>
      <button onClick={cancelSettings}>Cancel</button>
    </div>
  );
}
