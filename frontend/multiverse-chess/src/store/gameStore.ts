// import { create } from "zustand";
// import { Chess } from "chess.js";
// import type { Move } from "chess.js";
// import { DEFAULT_MAX_MOVES_PER_TURN } from "@/utils/constants";

// export interface BoardState {
//     id: string;
//     parentId?: string;
//     children: string[];
//     label: string;
//     chess: Chess;
//     moves: Move[];
//     status: "active" | "checkmate" | "stalemate" | "draw" | "time";
// }

// interface PlayerInfo {
//     id: string;
//     name: string;
//     timeLeft: number;
// }

// interface GameStore {
//     boards: BoardState[];
//     activeBoardId: string;
//     players: { white: PlayerInfo; black: PlayerInfo };
//     activeTurn: "white" | "black";
//     gameStatus: "waiting" | "playing" | "finished";
//     moveCountThisTurn: number; //Total moves this turn
//     universesThisTurn: string[]; //List of universe IDs where moves were made
//     maxMovesPerTurn: number;

//     //Actions
//     initGame: (whiteName: string, blackName: string, timePerPlayer: number) => void;
//     makeMove: (boardId: string, move: { from: string; to: string }) => boolean;
//     createNewUniverse: (boardId: string) => void;
//     passTurn: () => void;
//     setActiveBoard: (boardId: string) => void;
//     endGame: () => void;
// }

// export const useGameStore = create<GameStore>((set, get) => ({
//     boards: [],
//     activeBoardId: "",
//     players: {
//         white: { id: "p1", name: "White", timeLeft: 300 },
//         black: { id: "p2", name: "Black", timeLeft: 300 },
//     },
//     activeTurn: "white",
//     gameStatus: "waiting",
//     moveCountThisTurn: 0,
//     universesThisTurn: [],
//     maxMovesPerTurn: DEFAULT_MAX_MOVES_PER_TURN,

//     // Initialize game
//     initGame: (whiteName, blackName, timePerPlayer) => {
//         const chess = new Chess();
//         set({
//             boards: [
//                 {
//                     id: "root",
//                     chess,
//                     moves: [],
//                     label: "Board 1",
//                     children: [],
//                     status: "active",
//                 },
//             ],
//             activeBoardId: "root",
//             players: {
//                 white: { id: "p1", name: whiteName, timeLeft: timePerPlayer },
//                 black: { id: "p2", name: blackName, timeLeft: timePerPlayer },
//             },
//             activeTurn: "white",
//             gameStatus: "playing",
//             moveCountThisTurn: 0,
//             universesThisTurn: [],
//         });
//     },

//     // Make a move
//     makeMove: (boardId, move) => {
//         const state = get();
//         const board = state.boards.find((b) => b.id === boardId);
//         if (!board) return false;

//         const chessCopy = new Chess(board.chess.fen());
//         const moveResult = chessCopy.move(move);
//         if (!moveResult) return false; // illegal move

//         const updatedBoard: BoardState = {
//             ...board,
//             chess: chessCopy,
//             moves: [...board.moves, moveResult],
//             status: chessCopy.isGameOver()
//                 ? chessCopy.isCheckmate()
//                     ? "checkmate"
//                     : "draw"
//                 : "active",
//         };

//         // Update store
//         const updatedBoards = state.boards.map((b) =>
//             b.id === boardId ? updatedBoard : b
//         );

//         // Update move tracking
//         const alreadyPlayedInThisUniverse = state.universesThisTurn.includes(boardId);
//         const newUniversesThisTurn = alreadyPlayedInThisUniverse
//             ? state.universesThisTurn
//             : [...state.universesThisTurn, boardId];

//         const newMoveCount = state.moveCountThisTurn + 1;
//         const maxUniverses = newUniversesThisTurn.length;

//         // Pass turn only when player used all moves or moved once in each created universe
//         let shouldPassTurn = false;
//         if (
//             newMoveCount >= state.maxMovesPerTurn ||
//             (maxUniverses > 1 && newMoveCount >= maxUniverses)
//         ) {
//             shouldPassTurn = true;
//         }

//         set({
//             boards: updatedBoards,
//             activeBoardId: boardId,
//             moveCountThisTurn: shouldPassTurn ? 0 : newMoveCount,
//             universesThisTurn: shouldPassTurn ? [] : newUniversesThisTurn,
//             activeTurn: shouldPassTurn
//                 ? state.activeTurn === "white"
//                     ? "black"
//                     : "white"
//                 : state.activeTurn,
//         });

//         return true;
//     },

//     // Create a new universe (duplicate current board state)
//     createNewUniverse: (boardId) => {
//         const state = get();
//         const baseBoard = state.boards.find((b) => b.id === boardId);
//         if (!baseBoard) return;

//         // Limit universes to maxMovesPerTurn (usually 3)
//         const universesCreated = state.universesThisTurn.length;

//         if (universesCreated >= state.maxMovesPerTurn) return;

//         const newId = `${baseBoard.id}-U${baseBoard.children.length + 1}`;
//         const clonedChess = new Chess(baseBoard.chess.fen());

//         const newBoard: BoardState = {
//             id: newId,
//             parentId: baseBoard.id,
//             children: [],
//             label: `Board ${state.boards.length + 1}`,
//             chess: clonedChess,
//             moves: [...baseBoard.moves],
//             status: "active",
//         };

//         const updatedBoards = state.boards.map((b) =>
//             b.id === boardId ? { ...b, children: [...b.children, newId] } : b
//         );

//         set({
//             boards: [...updatedBoards, newBoard],
//             activeBoardId: newId,
//             universesThisTurn: [...state.universesThisTurn, newId],
//         });
//     },

//     // Manually pass turn early
//     passTurn: () => {
//         const state = get();
//         set({
//             activeTurn: state.activeTurn === "white" ? "black" : "white",
//             moveCountThisTurn: 0,
//             universesThisTurn: [],
//         });
//     },

//     setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

//     endGame: () => set({ gameStatus: "finished" }),
// }));

import { create } from "zustand";
import { Chess } from "chess.js";
import type { Move } from "chess.js";
import { DEFAULT_MAX_MOVES_PER_TURN } from "@/utils/constants";
import { cloneChess } from "@/utils/chessHelpers";

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
      // status: chess.isGameOver()
      //   ? chess.isCheckmate()
      //     ? "checkmate"
      //     : "draw"
      //   : "active",
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
