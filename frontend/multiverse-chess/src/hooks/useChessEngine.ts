// import { useState } from "react";
// import { Chess } from "chess.js";
// import type { Move, Square } from "chess.js";

// export interface BoardState {
//     id: string;
//     chess: Chess;
//     moves: Move[];
// }

// export function useChessEngine() {
//     const [boards, setBoards] = useState<BoardState[]>([
//         { id: "root", chess: new Chess(), moves: [] }
//     ]);
//     const [activeBoardId, setActiveBoardId] = useState("root");

//     const makeMove = (from: Square, to: Square) => {
//         setBoards((prev) => {
//             const boardIndex = prev.findIndex((b) => b.id === activeBoardId);
//             if (boardIndex === -1) return prev;

//             const boardCopy = new Chess(prev[boardIndex].chess.fen());
//             const move = boardCopy.move({ from, to });

//             if (!move) return prev; // illegal

//             // Branching: create a new board for the alternate timeline
//             const newBoard: BoardState = {
//                 id: `${prev[boardIndex].id}-${prev[boardIndex].moves.length + 1}`,
//                 chess: boardCopy,
//                 moves: [...prev[boardIndex].moves, move]
//             };

//             return [...prev, newBoard];
//         });
//     };

//     const getActiveBoard = () => boards.find((b) => b.id === activeBoardId);

//     // Derived position for the active board
//     const position = getActiveBoard()?.chess.fen() ?? "start";

//     // Adapter for Chessboard component’s onMove
//     const handleMove = (from: string, to: string) => {
//         // chess.js expects Square type, but string is fine if it's a valid square
//         makeMove(from as Square, to as Square);
//     };

//     return {
//         boards,
//         activeBoardId,
//         setActiveBoardId,
//         makeMove,
//         getActiveBoard,
//         position,
//         handleMove
//     };
// }

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";

export interface BoardState {
    id: string;
    chess: Chess;
    moves: Move[];
}

export function useChessEngine() {
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize engine (simulate async for now)
    useEffect(() => {
        // Later: could fetch game state from API here
        const initialBoard: BoardState = {
            id: "root",
            chess: new Chess(),
            moves: [],
        };
        setBoards([initialBoard]);
        setActiveBoardId("root");
        setIsLoading(false);
    }, []);

    const makeMove = (from: Square, to: Square) => {
        setBoards((prev) => {
            if (!activeBoardId) return prev;

            const boardIndex = prev.findIndex((b) => b.id === activeBoardId);
            if (boardIndex === -1) return prev;

            const boardCopy = new Chess(prev[boardIndex].chess.fen());
            const move = boardCopy.move({ from, to });

            if (!move) return prev; // illegal

            // Branching: create a new board for the alternate timeline
            const newBoard: BoardState = {
                id: `${prev[boardIndex].id}-${prev[boardIndex].moves.length + 1}`,
                chess: boardCopy,
                moves: [...prev[boardIndex].moves, move],
            };

            return [...prev, newBoard];
        });
    };

    const getActiveBoard = () =>
        boards.find((b) => b.id === activeBoardId) ?? null;

    // Derived position for the active board
    const position = getActiveBoard()?.chess.fen() ?? "start";

    // Adapter for Chessboard component’s onMove
    const handleMove = (from: string, to: string) => {
        makeMove(from as Square, to as Square);
    };

    return {
        boards,
        activeBoardId,
        setActiveBoardId,
        makeMove,
        getActiveBoard,
        position,
        handleMove,
        isLoading,
    };
}
