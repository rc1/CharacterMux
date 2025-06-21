import { useState } from "react";
import { exportSettings, importSettings } from "../services/export-settings";
import { useStore } from "../store/store";
import Input from "./form/input";
import HeaderBar from "./header-bar";
import Close from "./icons/close";
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
      <div className="setup-content">
        <HeaderBar
          start={<div className="control"></div>}
          center={<div className="title">Setup</div>}
          end={
            <div className="control" onClick={onShouldExit}>
              <Close />
            </div>
          }
        />
        <div className="form">
          <Input
            label="Gemini API Key"
            inputProps={{
              type: "password",
              value: geminiApiKey,
            }}
            value={geminiApiKey}
            onChange={(value) => setGeminiApiKey(value)}
          ></Input>
          <Input
            label="Delay between request (milliseconds)"
            inputProps={{
              type: "number",
              value: intervalMilliseconds,
            }}
            value={intervalMilliseconds.toString()}
            onChange={(value) => setIntervalMilliseconds(Number(value))}
          ></Input>
          <div>
            Prompts:{" "}
            <div onClick={exportSettings} className="button-like">
              export
            </div>{" "}
            /{" "}
            <div onClick={importSettings} className="button-like">
              import
            </div>
          </div>
          <div className="actions">
            <span className="button-like" onClick={saveSettings}>
              save
            </span>{" "}
            <span className="button-like secondary" onClick={cancelSettings}>
              cancel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
