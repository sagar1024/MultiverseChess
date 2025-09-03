import { create } from "zustand";

interface SettingsStore {
    theme: "dark" | "light";
    boardStyle: "classic" | "modern" | "wood";
    maxMovesPerTurn: number;
    timePerPlayer: number; //Seconds

    setTheme: (theme: "dark" | "light") => void;
    setBoardStyle: (style: "classic" | "modern" | "wood") => void;
    setMaxMovesPerTurn: (moves: number) => void;
    setTimePerPlayer: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    theme: "dark",
    boardStyle: "classic",
    maxMovesPerTurn: 3,
    timePerPlayer: 300, // default 5 min

    setTheme: (theme) => set({ theme }),
    setBoardStyle: (style) => set({ boardStyle: style }),
    setMaxMovesPerTurn: (moves) => set({ maxMovesPerTurn: moves }),
    setTimePerPlayer: (seconds) => set({ timePerPlayer: seconds })
}));
