import { Chess, Move, Square } from "chess.js";

/**
 * Checks if a move is legal in the given Chess instance
 */
export const isMoveLegal = (chess: Chess, from: Square, to: Square) => {
    const moves = chess.moves({ square: from, verbose: true });
    return moves.some((m) => m.to === to);
};

/**
 * Gets all legal moves from the current position
 */
export const getLegalMoves = (chess: Chess) => {
    return chess.moves({ verbose: true }) as Move[];
};

/**
 * Checks game status
 */
export const getGameStatus = (chess: Chess) => {
    if (chess.isCheckmate()) return "checkmate";
    if (chess.isDraw()) return "draw";
    if (chess.isStalemate()) return "stalemate";
    if (chess.isThreefoldRepetition()) return "threefold";
    if (chess.isInsufficientMaterial()) return "insufficient";
    return "active";
};

/**
 * Creates a deep copy of a Chess instance
 */
export const cloneChess = (chess: Chess) => {
    return new Chess(chess.fen());
};

/**
 * Generates a unique board ID for branching
 */
export const generateBoardId = (parentId: string, moveIndex: number) => {
    return `${parentId}-${moveIndex}`;
};
