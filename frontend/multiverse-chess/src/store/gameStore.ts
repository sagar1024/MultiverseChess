import { create } from "zustand";
import { Chess } from "chess.js";
import type { Move } from "chess.js";
import { DEFAULT_MAX_MOVES_PER_TURN } from "@/utils/constants";
import { cloneChess } from "@/utils/chessHelpers";

export type EngineLevel = "easy" | "medium" | "hard";

function getBoardStatus(chess: Chess): BoardState["status"] {
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isDraw()) return "draw";
  return "active";
}

/* ================= TYPES ================= */

export interface BoardState {
  id: string;
  chess: Chess;
  moves: Move[];
  status: "active" | "checkmate" | "stalemate" | "draw";
}

interface GameStore {
  boards: BoardState[];
  activeBoardId: string;

  playerColor: "white" | "black";
  turn: "player" | "engine";
  gameStatus: "playing" | "finished";

  moveCountThisTurn: number;
  maxMovesPerTurn: number;

  /* ===== Actions ===== */
  initGame: (playerColor: "white" | "black") => void;

  makePlayerMove: (
    boardId: string,
    move: { from: string; to: string; promotion?: string }
  ) => boolean;

  createUniverseFrom: (boardId: string) => void;
  passTurn: () => void;

  engineMoveAllBoards: () => void;

  setActiveBoard: (boardId: string) => void;
}

/* ================= STORE ================= */

export const useGameStore = create<GameStore>((set, get) => ({
  boards: [],
  activeBoardId: "",
  playerColor: "white",
  turn: "player",
  gameStatus: "playing",

  moveCountThisTurn: 0,
  maxMovesPerTurn: DEFAULT_MAX_MOVES_PER_TURN,

  /* ========= INIT ========= */

  initGame: (playerColor) => {
    const chess = new Chess();

    set({
      boards: [
        {
          id: "U1",
          chess,
          moves: [],
          status: "active",
        },
      ],
      activeBoardId: "U1",
      playerColor,
      turn: playerColor === "white" ? "player" : "engine",
      moveCountThisTurn: 0,
      gameStatus: "playing",
    });
  },

  /* ========= PLAYER MOVE ========= */

  makePlayerMove: (boardId, move) => {
    const { boards, turn, moveCountThisTurn, maxMovesPerTurn } = get();
    if (turn !== "player") return false;

    const board = boards.find((b) => b.id === boardId);
    if (!board || board.status !== "active") return false;

    const chess = cloneChess(board.chess);
    const result = chess.move(move);
    if (!result) return false;

    const updatedBoard: BoardState = {
      ...board,
      chess,
      moves: [...board.moves, result],
      status: getBoardStatus(chess),
    };

    const updatedBoards = boards.map((b) =>
      b.id === boardId ? updatedBoard : b
    );

    const newMoveCount = moveCountThisTurn + 1;
    const shouldEndTurn = newMoveCount >= maxMovesPerTurn;

    set({
      boards: updatedBoards,
      activeBoardId: boardId,
      moveCountThisTurn: shouldEndTurn ? 0 : newMoveCount,
      turn: shouldEndTurn ? "engine" : "player",
    });

    return true;
  },

  /* ========= CREATE UNIVERSE ========= */

  createUniverseFrom: (boardId) => {
    const { boards, moveCountThisTurn, maxMovesPerTurn, turn } = get();
    if (turn !== "player") return;
    if (moveCountThisTurn >= maxMovesPerTurn) return;

    const base = boards.find((b) => b.id === boardId);
    if (!base) return;

    const newId = `U${boards.length + 1}`;

    const newBoard: BoardState = {
      id: newId,
      chess: cloneChess(base.chess),
      moves: [...base.moves],
      status: base.status,
    };

    set({
      boards: [...boards, newBoard],
      activeBoardId: newId,
    });
  },

  /* ========= PASS TURN ========= */

  passTurn: () => {
    const { turn } = get();
    if (turn !== "player") return;

    set({
      turn: "engine",
      moveCountThisTurn: 0,
    });
  },

  /* ========= ENGINE MOVE ========= */

  engineMoveAllBoards: () => {
    const { boards, playerColor } = get();
    const engineColor = playerColor === "white" ? "b" : "w";

    const updatedBoards = boards.map((board) => {
      if (board.status !== "active") return board;

      const chess = cloneChess(board.chess);
      if (chess.turn() !== engineColor) return board;

      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return board;

      // 🚧 TEMP ENGINE: random legal move
      const move = moves[Math.floor(Math.random() * moves.length)];
      const result = chess.move(move);

      return {
        ...board,
        chess,
        moves: [...board.moves, result!],
        status: getBoardStatus(chess),
      };
    });

    set({
      boards: updatedBoards,
      turn: "player",
    });
  },

  setActiveBoard: (boardId) => set({ activeBoardId: boardId }),
}));
