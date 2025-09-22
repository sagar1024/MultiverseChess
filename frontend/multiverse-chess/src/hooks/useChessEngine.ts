// import { useState, useEffect } from "react";
// import { Chess } from "chess.js";
// import type { Move, Square } from "chess.js";

// export interface BoardState {
//     id: string;
//     parentId?: string | null;
//     chess: Chess;
//     moves: Move[];
// }

// type Turn = "w" | "b";

// export function useChessEngine() {
//     const [boards, setBoards] = useState<BoardState[]>([]);
//     const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentTurn, setCurrentTurn] = useState<Turn>("w"); //Here "w" = white to move, "b" = black to move

//     //Initialize engine (simulate async initialization; later replace with fetch)
//     useEffect(() => {
//         const initialBoard: BoardState = {
//             id: "root",
//             parentId: null,
//             chess: new Chess(),
//             moves: [],
//         };
//         setBoards([initialBoard]);
//         setActiveBoardId("root");
//         setIsLoading(false);
//         setCurrentTurn("w");
//     }, []);

//     //Helper: find board index by id
//     const findBoardIndex = (id: string) => boards.findIndex((b) => b.id === id);

//     /**
//      * makeMove performs the move on the active board and branches a new board.
//      * It will reject (no-op) if:
//      *  - there is no active board
//      *  - the boardId cannot be found
//      *  - it's not the game's currentTurn (white/black)
//      *  - the move is illegal (chess.js returns null)
//      *
//      * Returns true if move was made (and currentTurn flipped), false otherwise.
//      */
//     const makeMove = (from: Square, to: Square): boolean => {
//         if (!activeBoardId) return false;

//         const boardIndex = findBoardIndex(activeBoardId);
//         if (boardIndex === -1) return false;

//         const parentBoard = boards[boardIndex];
//         //Check the board's internal turn matches global currentTurn
//         //chess.turn() returns 'w' or 'b'
//         const boardTurn = parentBoard.chess.turn();
//         if (boardTurn !== currentTurn) {
//             //Not this player's turn according to global state -> reject
//             return false;
//         }

//         //Create a copy to test the move
//         const boardCopy = new Chess(parentBoard.chess.fen());
//         const moveResult = boardCopy.move({ from, to });

//         if (!moveResult) {
//             //Illegal move
//             return false;
//         }

//         //Create new board node with parentId linking
//         const newBoardId = `${parentBoard.id}-${parentBoard.moves.length + 1}`;
//         const newBoard: BoardState = {
//             id: newBoardId,
//             parentId: parentBoard.id,
//             chess: boardCopy,
//             moves: [...parentBoard.moves, moveResult],
//         };

//         //Append new board and set it active
//         setBoards((prev) => {
//             //Use prev to ensure we append to latest state
//             return [...prev, newBoard];
//         });
//         setActiveBoardId(newBoardId);

//         //Flip global turn (white -> black or black -> white)
//         setCurrentTurn((prev) => (prev === "w" ? "b" : "w"));
//         return true;
//     };

//     const getActiveBoard = () =>
//         boards.find((b) => b.id === activeBoardId) ?? null;

//     //Derived position for the active board (FEN)
//     const position = getActiveBoard()?.chess.fen() ?? "start";

//     /**
//      * handleMove is adapted to the chessboard component.
//      * It accepts (from, to) both strings and returns boolean to
//      * Indicate if the drop was accepted.
//      */
//     const handleMove = (from: string | null, to: string | null): boolean => {
//         if (!from || !to) return false;
//         //Forward to makeMove, casting to Square (chess.js expects string squares)
//         return makeMove(from as Square, to as Square);
//     };

//     return {
//         boards,
//         activeBoardId,
//         setActiveBoardId,
//         makeMove,
//         getActiveBoard,
//         position,
//         handleMove,
//         isLoading,
//         currentTurn,
//         setCurrentTurn,
//     };
// }

// src/hooks/useChessEngine.ts
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";

export interface BoardState {
    id: string;
    parentId: string | null;
    chess: Chess;
    moves: Move[];
}

type Turn = "w" | "b";

export interface TimelineNode {
    id: string;
    label: string;
    children?: TimelineNode[];
    isActive?: boolean;
    parentId?: string | null;
}

export function useChessEngine() {
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTurn, setCurrentTurn] = useState<Turn>("w");

    useEffect(() => {
        const initialBoard: BoardState = {
            id: "root",
            parentId: null,
            chess: new Chess(),
            moves: [],
        };
        setBoards([initialBoard]);
        setActiveBoardId("root");
        setCurrentTurn("w");
        setIsLoading(false);
    }, []);

    const findBoardIndex = (id: string) => boards.findIndex((b) => b.id === id);

    // makeMove returns boolean (true if move applied)
    const makeMove = (from: Square, to: Square): boolean => {
        if (!activeBoardId) return false;

        const idx = findBoardIndex(activeBoardId);
        if (idx === -1) return false;

        const parent = boards[idx];

        // ensure board internal turn matches global currentTurn
        if (parent.chess.turn() !== currentTurn) return false;

        const copy = new Chess(parent.chess.fen());
        const moveResult = copy.move({ from, to });
        if (!moveResult) return false; // illegal

        const newBoardId = `${parent.id}-${parent.moves.length + 1}`;
        const newBoard: BoardState = {
            id: newBoardId,
            parentId: parent.id,
            chess: copy,
            moves: [...parent.moves, moveResult],
        };

        // append new board
        setBoards((prev) => [...prev, newBoard]);
        setActiveBoardId(newBoardId);

        // flip turn
        setCurrentTurn((t) => (t === "w" ? "b" : "w"));

        return true;
    };

    const getActiveBoard = () =>
        boards.find((b) => b.id === activeBoardId) ?? null;

    const position = getActiveBoard()?.chess.fen() ?? "start";

    // Chessboard adapter
    const handleMove = (from: string | null, to: string | null): boolean => {
        if (!from || !to) return false;
        return makeMove(from as Square, to as Square);
    };

    /**
     * Build timeline tree from flat boards[]
     * Returns an array of root TimelineNodes (usually just root)
     */
    const getTimeline = (): TimelineNode[] => {
        const nodeMap = new Map<string, TimelineNode>();

        // create nodes for every board
        for (const b of boards) {
            const label = b.moves.length ? b.moves[b.moves.length - 1].san : "Start";
            nodeMap.set(b.id, {
                id: b.id,
                label,
                children: [],
                isActive: b.id === activeBoardId,
                parentId: b.parentId ?? null,
            });
        }

        // attach children
        const roots: TimelineNode[] = [];
        for (const node of nodeMap.values()) {
            if (node.parentId && nodeMap.has(node.parentId)) {
                nodeMap.get(node.parentId)!.children!.push(node);
            } else {
                roots.push(node);
            }
        }

        // Optionally sort children by creation order (boards array order)
        // Ensure order is consistent with the boards array
        const sortChildren = (n: TimelineNode) => {
            if (!n.children || n.children.length === 0) return;
            n.children.sort((a, b) => {
                const ai = boards.findIndex((x) => x.id === a.id);
                const bi = boards.findIndex((x) => x.id === b.id);
                return ai - bi;
            });
            n.children.forEach(sortChildren);
        };
        roots.forEach(sortChildren);

        return roots;
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
        getTimeline,
    };
}
