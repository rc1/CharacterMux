import { useState } from "react";
import { useStore } from "../store/store";
import "./app.css";
import Cell from "./cell";
import Help from "./help";
import Setup from "./setup";

type InterfaceMode = "cells" | "setup" | "help";

export default function App() {
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>("cells");

  const geminiApiKey = useStore.use.geminiApiKey();

  let renderedContent;

  switch (interfaceMode) {
    case "cells": {
      renderedContent = !geminiApiKey ? (
        <Setup onShouldExit={() => setInterfaceMode("cells")} />
      ) : (
        <div className="cell-grid">
          <Cell id={0}></Cell>
          <Cell id={1}></Cell>
          <Cell id={2}></Cell>
          <Cell id={3}></Cell>
          <Cell id={4}></Cell>
          <Cell id={5}></Cell>
        </div>
      );
      break;
    }
    case "setup": {
      renderedContent = (
        <Setup onShouldExit={() => setInterfaceMode("cells")} />
      );
      break;
    }
    case "help": {
      renderedContent = <Help onShouldExit={() => setInterfaceMode("cells")} />;
      break;
    }
  }

  return (
    <>
      <div className="app-container">
        {renderedContent}
        <div className="app-footer">
          <div>
            character-mux<span className="gray-2">.html</span>
          </div>
          <div>
            {!geminiApiKey && "!! Error: Add an valid API Key in setup !!"}
          </div>
          <div>
            <div
              className="button-like"
              onClick={() =>
                setInterfaceMode((value) =>
                  value === "setup" ? "cells" : "setup"
                )
              }
            >
              setup
            </div>
            <div
              className="button-like"
              onClick={() =>
                setInterfaceMode((value) =>
                  value === "help" ? "cells" : "help"
                )
              }
            >
              help
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
