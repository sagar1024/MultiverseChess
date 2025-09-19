import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";

export interface BoardState {
    id: string;
    parentId?: string | null;
    chess: Chess;
    moves: Move[];
}

type Turn = "w" | "b";

export function useChessEngine() {
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTurn, setCurrentTurn] = useState<Turn>("w"); //Here "w" = white to move, "b" = black to move

    //Initialize engine (simulate async initialization; later replace with fetch)
    useEffect(() => {
        const initialBoard: BoardState = {
            id: "root",
            parentId: null,
            chess: new Chess(),
            moves: [],
        };
        setBoards([initialBoard]);
        setActiveBoardId("root");
        setIsLoading(false);
        setCurrentTurn("w");
    }, []);

    // Helper: find board index by id
    const findBoardIndex = (id: string) => boards.findIndex((b) => b.id === id);

    /**
     * makeMove performs the move on the active board and branches a new board.
     * It will reject (no-op) if:
     *  - there is no active board
     *  - the boardId cannot be found
     *  - it's not the game's currentTurn (white/black)
     *  - the move is illegal (chess.js returns null)
     *
     * Returns true if move was made (and currentTurn flipped), false otherwise.
     */
    const makeMove = (from: Square, to: Square): boolean => {
        if (!activeBoardId) return false;

        const boardIndex = findBoardIndex(activeBoardId);
        if (boardIndex === -1) return false;

        const parentBoard = boards[boardIndex];
        // Check the board's internal turn matches global currentTurn
        // chess.turn() returns 'w' or 'b'
        const boardTurn = parentBoard.chess.turn();
        if (boardTurn !== currentTurn) {
            // Not this player's turn according to global state -> reject
            return false;
        }

        //Create a copy to test the move
        const boardCopy = new Chess(parentBoard.chess.fen());
        const moveResult = boardCopy.move({ from, to });

        if (!moveResult) {
            //Illegal move
            return false;
        }

        // Create new board node with parentId linking
        const newBoardId = `${parentBoard.id}-${parentBoard.moves.length + 1}`;
        const newBoard: BoardState = {
            id: newBoardId,
            parentId: parentBoard.id,
            chess: boardCopy,
            moves: [...parentBoard.moves, moveResult],
        };

        // Append new board and set it active
        setBoards((prev) => {
            //Use prev to ensure we append to latest state
            return [...prev, newBoard];
        });
        setActiveBoardId(newBoardId);

        // Flip global turn (white -> black or black -> white)
        setCurrentTurn((prev) => (prev === "w" ? "b" : "w"));

        return true;
    };

    const getActiveBoard = () =>
        boards.find((b) => b.id === activeBoardId) ?? null;

    // Derived position for the active board (FEN)
    const position = getActiveBoard()?.chess.fen() ?? "start";

    /**
     * handleMove is adapted to the chessboard component.
     * It accepts (from, to) both strings and returns boolean to
     * indicate if the drop was accepted.
     */
    const handleMove = (from: string | null, to: string | null): boolean => {
        if (!from || !to) return false;
        //Forward to makeMove, casting to Square (chess.js expects string squares)
        return makeMove(from as Square, to as Square);
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
        currentTurn,
        setCurrentTurn,
    };
}
