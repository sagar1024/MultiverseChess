// import {Chess} from "chess.js";
// import type {Move, Square} from "chess.js"

// //Checks if a move is legal in the given Chess instance
// export const isMoveLegal = (chess: Chess, from: Square, to: Square) => {
//     const moves = chess.moves({ square: from, verbose: true });
//     return moves.some((m) => m.to === to);
// };

// //Gets all legal moves from the current position
// export const getLegalMoves = (chess: Chess) => {
//     return chess.moves({ verbose: true }) as Move[];
// };

// //Checks game status
// export const getGameStatus = (chess: Chess) => {
//     if (chess.isCheckmate()) return "checkmate";
//     if (chess.isDraw()) return "draw";
//     if (chess.isStalemate()) return "stalemate";
//     if (chess.isThreefoldRepetition()) return "threefold";
//     if (chess.isInsufficientMaterial()) return "insufficient";
//     return "active";
// };

// //Creates a deep copy of a Chess instance
// export const cloneChess = (chess: Chess) => {
//     return new Chess(chess.fen());
// };

// //Generates a unique board ID for branching
// export const generateBoardId = (parentId: string, moveIndex: number) => {
//     return `${parentId}-${moveIndex}`;
// };

import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";

/* =========================
   BASIC MOVE HELPERS
========================= */

// Check if a move is legal
export const isMoveLegal = (chess: Chess, from: Square, to: Square) => {
  const moves = chess.moves({ square: from, verbose: true });
  return moves.some((m) => m.to === to);
};

// Get all legal moves
export const getLegalMoves = (chess: Chess): Move[] => {
  return chess.moves({ verbose: true }) as Move[];
};

// Clone a Chess instance safely
export const cloneChess = (chess: Chess) => {
  return new Chess(chess.fen());
};

/* =========================
   GAME STATUS
========================= */

export type GameStatus =
  | "active"
  | "checkmate"
  | "draw"
  | "stalemate"
  | "threefold"
  | "insufficient";

export const getGameStatus = (chess: Chess): GameStatus => {
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isThreefoldRepetition()) return "threefold";
  if (chess.isInsufficientMaterial()) return "insufficient";
  if (chess.isDraw()) return "draw";
  return "active";
};

/* =========================
   ENGINE (COMPUTER PLAYER)
========================= */

/**
 * VERY SIMPLE ENGINE (v1)
 * Picks a move based on:
 * - captures first
 * - otherwise random
 *
 * You can later replace this with:
 * - Stockfish WASM
 * - Minimax
 * - NNUE
 */
export const getEngineMove = (chess: Chess): Move | null => {
  const moves = chess.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;

  // Prefer captures
  const captures = moves.filter((m) => m.captured);
  if (captures.length > 0) {
    return captures[Math.floor(Math.random() * captures.length)];
  }

  // Otherwise random
  return moves[Math.floor(Math.random() * moves.length)];
};

/* =========================
   MULTI-UNIVERSE ENGINE TURN
========================= */

/**
 * Applies engine move to EVERY active universe
 * (used when it's computer's turn)
 */
export const applyEngineMoveToUniverses = (
  boards: {
    id: string;
    chess: Chess;
    status: string;
    moves: Move[];
  }[]
) => {
  return boards.map((board) => {
    if (board.status !== "active") return board;

    const chessCopy = cloneChess(board.chess);
    const engineMove = getEngineMove(chessCopy);

    if (!engineMove) {
      return {
        ...board,
        status: getGameStatus(chessCopy),
      };
    }

    chessCopy.move(engineMove);

    return {
      ...board,
      chess: chessCopy,
      moves: [...board.moves, engineMove],
      status: getGameStatus(chessCopy),
    };
  });
};

/* =========================
   UNIVERSE / BRANCH UTILS
========================= */

export const generateBoardId = (
  parentId: string,
  branchIndex: number
) => {
  return `${parentId}::${branchIndex}`;
};
