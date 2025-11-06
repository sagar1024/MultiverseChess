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
    moveCountThisTurn: number; //Total moves this turn
    universesThisTurn: string[]; //List of universe IDs where moves were made
    maxMovesPerTurn: number;

    //Actions
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
