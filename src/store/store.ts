import { create } from "zustand";
import { persist } from "zustand/middleware";

import { dispatchCellUpdated } from "../services/cell-rewriter";
import { createSelectors } from "./create-selectors";
import defaultPrompts from "./default-prompts.json";

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
      intervalMilliseconds: 12000,

      // Load the default settings
      cells: Object.values(defaultPrompts.cells).reduce((acc, cell) => {
        acc[cell.id] = {
          id: cell.id,
          prompt: cell.prompt,
          state: { type: "normal" },
          text: "",
        };
        return acc;
      }, {} as Record<number, Cell>),

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
      partialize: (state) => ({
        geminiApiKey: state.geminiApiKey,
        intervalMilliseconds: state.intervalMilliseconds,
        cells: Object.values(state.cells).reduce((acc, cell) => {
          acc[cell.id] = {
            id: cell.id,
            prompt: cell.prompt,
            state: { type: "normal" },
            text: cell.text,
          };
          return acc;
        }, {} as Record<number, Cell>),
      }),
    }
  )
);

export const useStore = createSelectors(useStoreBase);

// Hooks
// =====

export function useCell(id: number) {
  const cell = useStore((state) => state.cells[id]) || createEmptyCell(id);

  return {
    ...cell,
    updateText: (text: string) => {
      const nextCell = { ...cell, text };
      useStore.getState().updateCell(nextCell);
      dispatchCellUpdated(nextCell);
    },
    updatePrompt: (prompt: string) =>
      useStore.getState().updateCell({ ...cell, prompt }),
    setCellState: (state: CellState) =>
      useStore.getState().updateCell({ ...cell, state }),
    cellState: cell.state,
  };
}
