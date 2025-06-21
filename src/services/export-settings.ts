import { Cell, createEmptyCell, StoreState, useStore } from "../store/store";

export function exportSettings() {
  const store = useStore.getState();

  const { cells } = store;

  const json = JSON.stringify({
    cells: Object.values(cells).reduce((acc, cell) => {
      acc[cell.id] = {
        id: cell.id,
        prompt: cell.prompt,
      };
      return acc;
    }, {} as Record<number, Partial<Cell>>),
  });

  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "prompts.json";
  a.click();

  URL.revokeObjectURL(url);
}

export function importSettings() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const json = e.target?.result as string;
      const store = JSON.parse(json) as Partial<StoreState>;
      useStore.setState({
        ...useStore.getState(),
        ...store,
        cells: {
          ...useStore.getState().cells,
          ...Object.entries(store.cells || {}).map(([id, cell]) => ({
            ...createEmptyCell(Number(id)),
            ...cell,
          })),
        },
      });
    });
    reader.readAsText(file);
  });
  input.click();
}
