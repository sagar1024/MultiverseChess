import { create } from "zustand";
import { Chess} from "chess.js";
import type { Move } from "chess.js";

export interface BoardState {
    id: string;
    chess: Chess;
    moves: Move[];
    status: "active" | "checkmate" | "stalemate" | "draw" | "time";
}

interface PlayerInfo {
    id: string;
    name: string;
    timeLeft: number; //Seconds
}

interface GameStore {
    boards: BoardState[];
    activeBoardId: string;
    players: { white: PlayerInfo; black: PlayerInfo };
    activeTurn: "white" | "black";
    gameStatus: "waiting" | "playing" | "finished";

    //Actions
    initGame: (whiteName: string, blackName: string, timePerPlayer: number) => void;
    makeMove: (boardId: string, move: { from: string; to: string }) => void;
    setActiveBoard: (boardId: string) => void;
    endGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    boards: [],
    activeBoardId: "",
    players: {
        white: { id: "p1", name: "White", timeLeft: 300 },
        black: { id: "p2", name: "Black", timeLeft: 300 }
    },
    activeTurn: "white",
    gameStatus: "waiting",

    initGame: (whiteName, blackName, timePerPlayer) => {
        const chess = new Chess();
        set({
            boards: [
                {
                    id: "root",
                    chess,
                    moves: [],
                    status: "active"
                }
            ],
            activeBoardId: "root",
            players: {
                white: { id: "p1", name: whiteName, timeLeft: timePerPlayer },
                black: { id: "p2", name: blackName, timeLeft: timePerPlayer }
            },
            activeTurn: "white",
            gameStatus: "playing"
        });
    },

    makeMove: (boardId, move) => {
        set((state) => {
            const boardIndex = state.boards.findIndex((b) => b.id === boardId);
            if (boardIndex === -1) return state;

            const boardCopy = new Chess(state.boards[boardIndex].chess.fen());
            const moveResult = boardCopy.move(move);
            if (!moveResult) return state; // illegal move

            const newBoardId = `${boardId}-${state.boards[boardIndex].moves.length + 1}`;
            const newBoard: BoardState = {
                id: newBoardId,
                chess: boardCopy,
                moves: [...state.boards[boardIndex].moves, moveResult],
                status: boardCopy.isGameOver()
                    ? boardCopy.isCheckmate()
                        ? "checkmate"
                        : "draw"
                    : "active"
            };

            return {
                boards: [...state.boards, newBoard],
                activeBoardId: newBoardId,
                activeTurn: state.activeTurn === "white" ? "black" : "white"
            };
        });
    },

    setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

    endGame: () => set({ gameStatus: "finished" })
}));
