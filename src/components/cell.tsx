import { useEffect, useMemo, useRef, useState } from "react";

import { useTemporal } from "../lib/use-temporal";
import { useCellProcessor } from "../services/cell-rewriter";
import { useCell } from "../store/store";
import "./cell.css";
import CellHeader from "./header-bar";
import Close from "./icons/close";
import More from "./icons/more";
import Spin from "./icons/spin";

export default function Cell({ id }: { id: number }) {
  // This needs a better name but its
  // what makes the request
  useCellProcessor(id);

  const { prompt, text, updatePrompt, updateText, setCellState, cellState } =
    useCell(id);
  const [isSetup, setIsSetup] = useState(false);

  // Has copied text to clipboard
  const [hasCopied, setCopied] = useTemporal(false);

  // Are we on a touch device and should show a copy button
  const isTouchDevice = navigator.maxTouchPoints > 0;

  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const touchHeaderTitle = useMemo(() => {
    if (!isTouchDevice) {
      return null;
    }
    return (
      <div className="title touch-header-title">
        <div
          onClick={() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.select();
            }
          }}
        >
          select all
        </div>
        |
        <div
          onClick={() => {
            navigator.clipboard.readText().then((text) => {
              updateText(text);
            });
          }}
        >
          paste
        </div>
        |
        <div
          onClick={() => {
            setCopied(true, 2333);
            navigator.clipboard.writeText(text);
          }}
        >
          copy
        </div>
      </div>
    );
  }, [isTouchDevice]);

  // Handle keyboard shortcut for copying cell content
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === String(id + 1)) {
        e.preventDefault();
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopied(true, 2333);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, text]);

  const normalContent = () => (
    <textarea
      ref={textareaRef}
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
      {/* <div className="gray-2">
        Use %TEXT% in the prompt to indicate where the typed text should be
        inserted
      </div> */}
    </>
  );

  return (
    <div className="cell">
      <CellHeader
        start={<div className="number">{id + 1}</div>}
        center={
          isSetup ? (
            <div className="title">edit prompt</div>
          ) : hasCopied ? (
            <div className="title">copied</div>
          ) : (
            touchHeaderTitle
          )
        }
        end={
          isSetup ? (
            <div className="control" onClick={() => setIsSetup(false)}>
              <Close />
            </div>
          ) : (
            <div className="control" onClick={() => setIsSetup(true)}>
              {cellState.type === "requesting" ? (
                <Spin className="spin" />
              ) : (
                <More />
              )}
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
