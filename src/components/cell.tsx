import { useState } from "react";

import { useCellProcessor } from "../services/text-processor";
import { useCell } from "../store/store";
import "./cell.css";
import CellHeader from "./header-bar";

export default function Cell({ id }: { id: number }) {
  // This needs a better name but its
  // what makes the request
  useCellProcessor(id);

  const { prompt, text, updatePrompt, updateText, setCellState, cellState } =
    useCell(id);
  const [isSetup, setIsSetup] = useState(false);

  const normalContent = () => (
    <textarea
      key="normal"
      value={text}
      onChange={(e) => updateText(e.target.value)}
      onFocus={() => setCellState({ type: "editing" })}
      onBlur={() => setCellState({ type: "normal" })}
    ></textarea>
  );
  const setupContent = () => (
    <>
      <textarea
        key="setup"
        value={prompt}
        onChange={(e) => updatePrompt(e.target.value)}
      ></textarea>
      <div className="gray-2">
        Use %TEXT% in the prompt to indicate where the typed text should be
        inserted
      </div>
    </>
  );

  return (
    <div className="cell">
      <CellHeader
        start={<div className="number">{id + 1}</div>}
        center={isSetup && <div className="title">edit prompt</div>}
        end={
          isSetup ? (
            <div className="control" onClick={() => setIsSetup(false)}>
              x
            </div>
          ) : (
            <div className="control" onClick={() => setIsSetup(true)}>
              {cellState.type === "requesting" ? "loading..." : "s"}
            </div>
          )
        }
      />
      <div className="content">
        {isSetup ? setupContent() : normalContent()}
      </div>
    </div>
  );
}
