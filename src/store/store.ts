import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { debounce } from "../lib/debounce";
import { dispatchCellUpdated } from "../services/text-processor";
import { createSelectors } from "./create-selectors";

// Types
// =====

export interface CellStateEditing {
  type: "editing";
}

export interface CellStateRequesting {
  type: "requesting";
}

export interface CellStateNormal {
  type: "normal";
}

export type CellState =
  | CellStateEditing
  | CellStateRequesting
  | CellStateNormal;

export interface Cell {
  id: number;
  prompt: string;
  state: CellState;
  text: string;
}

export function createEmptyCell(id: number) {
  return {
    id,
    prompt: "",
    state: { type: "empty" },
    text: "",
  };
}

export interface StoreState {
  geminiApiKey: string;
  intervalMilliseconds: number;
  cells: Record<number, Cell>;

  setGeminiApiKey: (apiKey: string) => void;
  setIntervalMilliseconds: (milliseconds: number) => void;
  updateCell: (cell: Cell) => void;
}

// Store
// =====

const useStoreBase = create<StoreState>()(
  persist(
    (set, get) => ({
      geminiApiKey: "",
      intervalMilliseconds: 1000,
      cells: {},

      setGeminiApiKey: (apiKey: string) => set({ geminiApiKey: apiKey }),
      setIntervalMilliseconds: (milliseconds: number) =>
        set({ intervalMilliseconds: milliseconds }),
      updateCell: (cell: Cell) => {
        const existingCell = get().cells[cell.id] || {};
        set({
          cells: { ...get().cells, [cell.id]: { ...existingCell, ...cell } },
        });
      },
    }),
    {
      name: "store",
    }
  )
);

export const useStore = createSelectors(useStoreBase);

// Hooks
// =====

export function useCell(id: number) {
  const cell = useStore((state) => state.cells[id]) || createEmptyCell(id);

  const debouncedDispatch = useMemo(
    () => debounce(dispatchCellUpdated, 1000),
    []
  );

  return {
    ...cell,
    updateText: (text: string) => {
      useStore.getState().updateCell({ ...cell, text });
      console.log("dispatchCellUpdated");
      debouncedDispatch(cell);
    },
    updatePrompt: (prompt: string) =>
      useStore.getState().updateCell({ ...cell, prompt }),
    setCellState: (state: CellState) =>
      useStore.getState().updateCell({ ...cell, state }),
    cellState: cell.state,
  };
}
