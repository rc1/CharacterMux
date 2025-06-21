import { GoogleGenAI } from "@google/genai";
import { useEffect } from "react";
import { debounce } from "../lib/debounce";
import { Cell, createEmptyCell, useStore } from "../store/store";

const EVENT_NAME = "cell-dispatched-update";

const cellUpdatedEvent = new EventTarget();

const dispatch = (cell: Cell) =>
  cellUpdatedEvent.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cell }));

const debouncedDispatch = debounce((cell: Cell) => {
  dispatch(cell);
}, 1000);

export function dispatchCellUpdated(cell: Cell) {
  if (cell.text === "") {
    dispatch(cell);
  } else {
    console.log("Will debounce", cell.text, cell.id);
    debouncedDispatch(cell);
  }
}

function createCellRewriter(cellId: number, ai: GoogleGenAI) {
  let lastRewriteAt = Number.NEGATIVE_INFINITY;
  //let nextRewriteSourceCell: Cell | null = null;
  let nextTextToRewrite: string | null = null;
  let didClear = false;

  cellUpdatedEvent.addEventListener(EVENT_NAME, handleCellDispatchedUpdated);

  // Handle cell updates from other cells

  function handleCellDispatchedUpdated(e: Event) {
    const updatedCell = (e as CustomEvent).detail as Cell;

    if (updatedCell.id === cellId) {
      return;
    }

    if (useStore.getState().cells[cellId].prompt.trim() === "") {
      // nothing to do
      return;
    }

    if (updatedCell.text === "") {
      nextTextToRewrite = null;
      updateCellWithText(cellId, "");
      didClear = true;
      return;
    }

    didClear = false;

    useStore.getState().updateCell({
      ...useStore.getState().cells[cellId],
      state: { type: "requesting" },
    });

    if (Date.now() - lastRewriteAt < useStore.getState().intervalMilliseconds) {
      nextTextToRewrite = updatedCell.text;
      return;
    } else {
      requestRewrite(updatedCell.text);
    }
  }

  // Handle cell updates from other cells

  async function requestRewrite(text: string) {
    lastRewriteAt = Date.now();
    nextTextToRewrite = null;

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
          `====USERS_TEXT====\n${text}\n====END_OF_USERS_TEXT====`
        ),
      });

      if (response.text && !didClear) {
        updateCellWithText(cellId, response.text);
      }
    }

    if (nextTextToRewrite) {
      // Do we still have to wait? if so, wait...
      if (
        Date.now() - lastRewriteAt <
        useStore.getState().intervalMilliseconds
      ) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            useStore.getState().intervalMilliseconds -
              (Date.now() - lastRewriteAt)
          )
        );
      }

      if (nextTextToRewrite !== null) {
        const nextText = nextTextToRewrite;
        nextTextToRewrite = null;
        requestRewrite(nextText);
      }
    }
  }

  return {
    dispose: () => {
      cellUpdatedEvent.removeEventListener(
        EVENT_NAME,
        handleCellDispatchedUpdated
      );
    },
  };
}

export function useCellProcessor(cellId: number) {
  const geminiApiKey = useStore.use.geminiApiKey();

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  useEffect(() => {
    const processor = createCellRewriter(cellId, ai);
    return () => processor.dispose();
  }, [cellId, geminiApiKey]);
}

function updateCellWithText(cellId: number, text: string) {
  useStore.getState().updateCell({
    ...useStore.getState().cells[cellId],
    state: { type: "normal" },
    text,
  });
}
