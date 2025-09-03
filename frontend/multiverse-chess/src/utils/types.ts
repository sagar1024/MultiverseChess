import {Chess} from "chess.js";
import type {Move} from "chess.js";

export type PlayerColor = "white" | "black";

export interface Player {
    id: string;
    name: string;
    timeLeft: number; //In seconds
}

export interface BoardNode {
    id: string;
    parentId?: string;
    chess: Chess;
    moves: Move[];
    status: "active" | "checkmate" | "stalemate" | "draw" | "time";
}

export interface GameState {
    boards: BoardNode[];
    activeBoardId: string;
    players: {
        white: Player;
        black: Player;
    };
    activeTurn: PlayerColor;
    gameStatus: "waiting" | "playing" | "finished";
}
