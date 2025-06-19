import { useState } from "react";
import { useStore } from "../store/store";
import "./app.css";
import Cell from "./cell";
import Setup from "./setup";

export default function App() {
  const [showSetup, setShowSetup] = useState(false);

  const geminiApiKey = useStore.use.geminiApiKey();

  const renderSetup = () => <Setup onShouldExit={() => setShowSetup(false)} />;

  const renderCells = () => (
    <div className="cell-grid">
      <Cell id={0}></Cell>
      <Cell id={1}></Cell>
      <Cell id={2}></Cell>
      <Cell id={3}></Cell>
      <Cell id={4}></Cell>
      <Cell id={5}></Cell>
    </div>
  );

  return (
    <>
      <div className="app-container">
        {showSetup ? renderSetup() : renderCells()}
        <div className="app-footer">
          <div>
            character-mux<span className="gray-2">.html</span>
          </div>
          <div>
            {!geminiApiKey && "!! Error: Add an valid API Key in setup !!"}
          </div>
          <div>
            <div className="underline" onClick={() => setShowSetup(true)}>
              setup
            </div>
            <div className="underline">help</div>
          </div>
        </div>
      </div>
    </>
  );
}
