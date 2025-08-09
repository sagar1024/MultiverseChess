import create from "zustand";
import { Board } from "../types/types";
import { v4 as uuidv4 } from "uuid";

interface GameState {
  boards: Record<string, Board>;
  currentTurn: "white" | "black";
  initGame: () => void;
  // TODO: branchBoard, makeMove, endTurn...
}

export const useGameStore = create<GameState>((set, get) => ({
  boards: {},
  currentTurn: "white",
  initGame: () => {
    const rootId = uuidv4();
    const rootBoard: Board = {
      id: rootId,
      fen: "start", // replace with actual FEN from chess.js if desired
      children: [],
      result: "in_progress",
    };
    set({ boards: { [rootId]: rootBoard }, currentTurn: "white" });
  },
}));
