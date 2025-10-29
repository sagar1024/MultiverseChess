// import { create } from "zustand";
// import { Chess } from "chess.js";
// import type { Move } from "chess.js";
// import { DEFAULT_MAX_MOVES_PER_TURN } from "@/utils/constants";

// export interface BoardState {
//     id: string;
//     parentId?: string; //For timeline tree
//     children: string[]; //Child board IDs (branches)
//     label: string; //"Board 1", "Board 1.1", etc.
//     chess: Chess;
//     moves: Move[];
//     status: "active" | "checkmate" | "stalemate" | "draw" | "time";
// }

// interface PlayerInfo {
//     id: string;
//     name: string;
//     timeLeft: number; //Seconds
// }

// interface GameStore {
//     boards: BoardState[];
//     activeBoardId: string;
//     players: { white: PlayerInfo; black: PlayerInfo };
//     activeTurn: "white" | "black";
//     gameStatus: "waiting" | "playing" | "finished";
//     moveCountThisTurn: number;
//     maxMovesPerTurn: number;

//     //Actions
//     initGame: (whiteName: string, blackName: string, timePerPlayer: number) => void;
//     makeMove: (boardId: string, move: { from: string; to: string }) => boolean;
//     passTurn: () => void;
//     setActiveBoard: (boardId: string) => void;
//     endGame: () => void;
//     createNewUniverse: (boardId: string) => void;
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
//     maxMovesPerTurn: DEFAULT_MAX_MOVES_PER_TURN,

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
//         });
//     },

//     makeMove: (boardId, move) => {
//         let moveSuccess = false;

//         set((state) => {
//             const boardIndex = state.boards.findIndex((b) => b.id === boardId);

//             if (boardIndex === -1) return state;

//             const boardCopy = new Chess(state.boards[boardIndex].chess.fen());
//             const moveResult = boardCopy.move(move);

//             if (!moveResult) return state; //Illegal move

//             moveSuccess = true;

//             //Create a new timeline branch automatically on each move
//             const newBoardId = `${boardId}-${state.boards[boardIndex].moves.length + 1}`;
//             const newLabel = `${state.boards[boardIndex].label}.${state.boards[boardIndex].children.length + 1}`;

//             const newBoard: BoardState = {
//                 id: newBoardId,
//                 parentId: boardId,
//                 children: [],
//                 label: newLabel,
//                 chess: boardCopy,
//                 moves: [...state.boards[boardIndex].moves, moveResult],
//                 status: boardCopy.isGameOver()
//                     ? boardCopy.isCheckmate()
//                         ? "checkmate"
//                         : "draw"
//                     : "active",
//             };

//             const updatedBoards = state.boards.map((b) =>
//                 b.id === boardId ? { ...b, children: [...b.children, newBoardId] } : b
//             );

//             const newMoveCount = state.moveCountThisTurn + 1;
//             const nextTurn =
//                 newMoveCount >= state.maxMovesPerTurn
//                     ? state.activeTurn === "white"
//                         ? "black"
//                         : "white"
//                     : state.activeTurn;

//             return {
//                 boards: [...updatedBoards, newBoard],
//                 activeBoardId: newBoardId,
//                 activeTurn: nextTurn,
//                 moveCountThisTurn:
//                     newMoveCount >= state.maxMovesPerTurn ? 0 : newMoveCount,
//             };
//         });

//         return moveSuccess;
//     },

//     passTurn: () => {
//         set((state) => ({
//             activeTurn: state.activeTurn === "white" ? "black" : "white",
//             moveCountThisTurn: 0,
//         }));
//     },

//     setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

//     endGame: () => set({ gameStatus: "finished" }),

//     //Create a new branch (duplicate board as a new universe)
//     createNewUniverse: (boardId) => {
//         set((state) => {
//             const baseBoard = state.boards.find((b) => b.id === boardId);
//             if (!baseBoard) return state;

//             const siblings = state.boards.filter((b) => b.parentId === boardId);
//             const newChildIndex = siblings.length + 1;

//             const newId = `${boardId}-${newChildIndex}`;
//             const newLabel = `${baseBoard.label}.${newChildIndex}`;
//             const clonedChess = new Chess(baseBoard.chess.fen());
//             const newBoard: BoardState = {
//                 id: newId,
//                 parentId: baseBoard.id,
//                 children: [],
//                 label: newLabel,
//                 chess: clonedChess,
//                 moves: [...baseBoard.moves],
//                 status: "active",
//             };

//             const updatedBoards = state.boards.map((b) =>
//                 b.id === boardId ? { ...b, children: [...b.children, newId] } : b
//             );

//             return {
//                 boards: [...updatedBoards, newBoard],
//                 activeBoardId: newId, //Auto switch to new branch
//             };
//         });
//     },
// }));

import { create } from "zustand";
import { Chess } from "chess.js";
import type { Move } from "chess.js";
import { DEFAULT_MAX_MOVES_PER_TURN } from "@/utils/constants";

export interface BoardState {
    id: string;
    parentId?: string;
    children: string[];
    label: string;
    chess: Chess;
    moves: Move[];
    status: "active" | "checkmate" | "stalemate" | "draw" | "time";
}

interface PlayerInfo {
    id: string;
    name: string;
    timeLeft: number;
}

interface GameStore {
    boards: BoardState[];
    activeBoardId: string;
    players: { white: PlayerInfo; black: PlayerInfo };
    activeTurn: "white" | "black";
    gameStatus: "waiting" | "playing" | "finished";
    moveCountThisTurn: number; // total moves this turn
    universesThisTurn: string[]; // list of universe IDs where moves were made
    maxMovesPerTurn: number;

    // Actions
    initGame: (whiteName: string, blackName: string, timePerPlayer: number) => void;
    makeMove: (boardId: string, move: { from: string; to: string }) => boolean;
    createNewUniverse: (boardId: string) => void;
    passTurn: () => void;
    setActiveBoard: (boardId: string) => void;
    endGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    boards: [],
    activeBoardId: "",
    players: {
        white: { id: "p1", name: "White", timeLeft: 300 },
        black: { id: "p2", name: "Black", timeLeft: 300 },
    },
    activeTurn: "white",
    gameStatus: "waiting",
    moveCountThisTurn: 0,
    universesThisTurn: [],
    maxMovesPerTurn: DEFAULT_MAX_MOVES_PER_TURN,

    // Initialize game
    initGame: (whiteName, blackName, timePerPlayer) => {
        const chess = new Chess();
        set({
            boards: [
                {
                    id: "root",
                    chess,
                    moves: [],
                    label: "Board 1",
                    children: [],
                    status: "active",
                },
            ],
            activeBoardId: "root",
            players: {
                white: { id: "p1", name: whiteName, timeLeft: timePerPlayer },
                black: { id: "p2", name: blackName, timeLeft: timePerPlayer },
            },
            activeTurn: "white",
            gameStatus: "playing",
            moveCountThisTurn: 0,
            universesThisTurn: [],
        });
    },

    // Make a move
    makeMove: (boardId, move) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return false;

        const chessCopy = new Chess(board.chess.fen());
        const moveResult = chessCopy.move(move);
        if (!moveResult) return false; // illegal move

        const updatedBoard: BoardState = {
            ...board,
            chess: chessCopy,
            moves: [...board.moves, moveResult],
            status: chessCopy.isGameOver()
                ? chessCopy.isCheckmate()
                    ? "checkmate"
                    : "draw"
                : "active",
        };

        // Update store
        const updatedBoards = state.boards.map((b) =>
            b.id === boardId ? updatedBoard : b
        );

        // Update move tracking
        const alreadyPlayedInThisUniverse = state.universesThisTurn.includes(boardId);
        const newUniversesThisTurn = alreadyPlayedInThisUniverse
            ? state.universesThisTurn
            : [...state.universesThisTurn, boardId];

        const newMoveCount = state.moveCountThisTurn + 1;
        const maxUniverses = newUniversesThisTurn.length;

        // Pass turn only when player used all moves or moved once in each created universe
        let shouldPassTurn = false;
        if (
            newMoveCount >= state.maxMovesPerTurn ||
            (maxUniverses > 1 && newMoveCount >= maxUniverses)
        ) {
            shouldPassTurn = true;
        }

        set({
            boards: updatedBoards,
            activeBoardId: boardId,
            moveCountThisTurn: shouldPassTurn ? 0 : newMoveCount,
            universesThisTurn: shouldPassTurn ? [] : newUniversesThisTurn,
            activeTurn: shouldPassTurn
                ? state.activeTurn === "white"
                    ? "black"
                    : "white"
                : state.activeTurn,
        });

        return true;
    },

    // Create a new universe (duplicate current board state)
    createNewUniverse: (boardId) => {
        const state = get();
        const baseBoard = state.boards.find((b) => b.id === boardId);
        if (!baseBoard) return;

        // Limit universes to maxMovesPerTurn (usually 3)
        const universesCreated = state.universesThisTurn.length;
        
        if (universesCreated >= state.maxMovesPerTurn) return;

        const newId = `${baseBoard.id}-U${baseBoard.children.length + 1}`;
        const clonedChess = new Chess(baseBoard.chess.fen());

        const newBoard: BoardState = {
            id: newId,
            parentId: baseBoard.id,
            children: [],
            label: `Board ${state.boards.length + 1}`,
            chess: clonedChess,
            moves: [...baseBoard.moves],
            status: "active",
        };

        const updatedBoards = state.boards.map((b) =>
            b.id === boardId ? { ...b, children: [...b.children, newId] } : b
        );

        set({
            boards: [...updatedBoards, newBoard],
            activeBoardId: newId,
            universesThisTurn: [...state.universesThisTurn, newId],
        });
    },

    // Manually pass turn early
    passTurn: () => {
        const state = get();
        set({
            activeTurn: state.activeTurn === "white" ? "black" : "white",
            moveCountThisTurn: 0,
            universesThisTurn: [],
        });
    },

    setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

    endGame: () => set({ gameStatus: "finished" }),
}));
