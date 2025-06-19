import { GoogleGenAI } from "@google/genai";
import { useEffect } from "react";
import { Cell, createEmptyCell, useStore } from "../store/store";

const cellUpdatedEvent = new EventTarget();

export function dispatchCellUpdated(cell: Cell) {
  cellUpdatedEvent.dispatchEvent(
    new CustomEvent("cell-updated", { detail: cell })
  );
}

function createCellProcessor(cellId: number, ai: GoogleGenAI) {
  function handleCellUpdated(e: Event) {
    const cell = (e as CustomEvent).detail as Cell;

    if (cell.id === cellId) {
      return;
    }

    useStore.getState().updateCell({
      ...useStore.getState().cells[cellId],
      state: { type: "requesting" },
    });

    if (
      Date.now() - lastCellRequestAt <
      useStore.getState().intervalMilliseconds
    ) {
      nextCellToUpdate = { ...cell };
      return;
    }

    processUpdatedCell(cell);
  }

  cellUpdatedEvent.addEventListener("cell-updated", handleCellUpdated);

  let lastCellRequestAt = Number.NEGATIVE_INFINITY;
  let nextCellToUpdate: Cell | null = null;

  async function processUpdatedCell(updatedCell: Cell) {
    lastCellRequestAt = Date.now();

    const currentCell =
      useStore.getState().cells[cellId] || createEmptyCell(cellId);

    if (currentCell.prompt.trim().length > 0) {
      useStore.getState().updateCell({
        ...currentCell,
        state: { type: "requesting" },
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        config: {
          systemInstruction: `You are embedded in a text editor application and are one of the worlds best, sharpest, and renowned text editors. You provide super speedy edits based on what the user is typing. Always respond without any formatting or commentary. Only ever reply with the requested edit text. You will receive instructions in the form of a prompt and the text to be edited between the markers`,
        },
        contents: currentCell.prompt.replace(
          "%TEXT%",
          `====USERS_TEXT====\n${updatedCell.text}\n====END_OF_USERS_TEXT====`
        ),
      });

      const currentCellState = useStore.getState().cells[cellId];

      if (currentCellState.state.type !== "editing" && response.text) {
        useStore.getState().updateCell({
          ...currentCellState,
          state: { type: "normal" },
          text: response.text,
        });
      }
    }

    if (nextCellToUpdate) {
      if (
        Date.now() - lastCellRequestAt <
        useStore.getState().intervalMilliseconds
      ) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            useStore.getState().intervalMilliseconds -
              (Date.now() - lastCellRequestAt)
          )
        );
      }

      const nextCell = nextCellToUpdate;
      nextCellToUpdate = null;
      processUpdatedCell(nextCell);
    }
  }

  return {
    dispose: () => {
      cellUpdatedEvent.removeEventListener("cell-updated", handleCellUpdated);
    },
  };
}

export function useCellProcessor(cellId: number) {
  const geminiApiKey = useStore.use.geminiApiKey();

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  useEffect(() => {
    const processor = createCellProcessor(cellId, ai);
    return () => processor.dispose();
  }, [cellId, geminiApiKey]);
}
