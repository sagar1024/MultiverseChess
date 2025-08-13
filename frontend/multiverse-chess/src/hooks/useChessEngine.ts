import { useState } from "react";
import { Chess, Move, Square } from "chess.js";

export interface BoardState {
    id: string;
    chess: Chess;
    moves: Move[];
}

export function useChessEngine() {
    const [boards, setBoards] = useState<BoardState[]>([
        { id: "root", chess: new Chess(), moves: [] }
    ]);
    const [activeBoardId, setActiveBoardId] = useState("root");

    const makeMove = (from: Square, to: Square) => {
        setBoards((prev) => {
            const boardIndex = prev.findIndex((b) => b.id === activeBoardId);
            if (boardIndex === -1) return prev;

            const boardCopy = new Chess(prev[boardIndex].chess.fen());
            const move = boardCopy.move({ from, to });

            if (!move) return prev; // illegal

            // Branching: create a new board for the alternate timeline
            const newBoard: BoardState = {
                id: `${prev[boardIndex].id}-${prev[boardIndex].moves.length + 1}`,
                chess: boardCopy,
                moves: [...prev[boardIndex].moves, move]
            };

            return [...prev, newBoard];
        });
    };

    const getActiveBoard = () => boards.find((b) => b.id === activeBoardId);

    return {
        boards,
        activeBoardId,
        setActiveBoardId,
        makeMove,
        getActiveBoard
    };
}
