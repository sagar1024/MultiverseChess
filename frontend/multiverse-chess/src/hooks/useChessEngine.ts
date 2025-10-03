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

export interface GameOverInfo {
    isOver: boolean;
    winner: "white" | "black" | "draw" | null;
    reason?: string;
    boardId?: string;
}

export function useChessEngine() {
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTurn, setCurrentTurn] = useState<Turn>("w");
    const [gameOver, setGameOver] = useState<GameOverInfo>({
        isOver: false,
        winner: null,
    });

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
        setGameOver({ isOver: false, winner: null });
    }, []);

    const findBoardIndex = (id: string) => boards.findIndex((b) => b.id === id);

    const makeMove = (from: Square, to: Square): boolean => {
        if (!activeBoardId) return false;

        const idx = findBoardIndex(activeBoardId);
        if (idx === -1) return false;

        const parent = boards[idx];

        //Enforce turn
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

        setBoards((prev) => [...prev, newBoard]);
        setActiveBoardId(newBoardId);

        //Flip turn
        setCurrentTurn(copy.turn());

        //Check for game over
        if (copy.isCheckmate()) {
            setGameOver({
                isOver: true,
                winner: copy.turn() === "w" ? "black" : "white",
                reason: "checkmate",
                boardId: newBoardId,
            });
        } else if (copy.isStalemate()) {
            setGameOver({
                isOver: true,
                winner: "draw",
                reason: "stalemate",
                boardId: newBoardId,
            });
        } else if (copy.isInsufficientMaterial()) {
            setGameOver({
                isOver: true,
                winner: "draw",
                reason: "insufficient material",
                boardId: newBoardId,
            });
        } else if (copy.isThreefoldRepetition()) {
            setGameOver({
                isOver: true,
                winner: "draw",
                reason: "threefold repetition",
                boardId: newBoardId,
            });
        } else if (copy.isDraw()) {
            setGameOver({
                isOver: true,
                winner: "draw",
                reason: "draw",
                boardId: newBoardId,
            });
        }

        return true;
    };

    const getActiveBoard = () =>
        boards.find((b) => b.id === activeBoardId) ?? null;

    const position = getActiveBoard()?.chess.fen() ?? "start";

    const handleMove = (from: string | null, to: string | null): boolean => {
        if (!from || !to) return false;
        return makeMove(from as Square, to as Square);
    };

    const getTimeline = (): TimelineNode[] => {
        const nodeMap = new Map<string, TimelineNode>();

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

        const roots: TimelineNode[] = [];
        for (const node of nodeMap.values()) {
            if (node.parentId && nodeMap.has(node.parentId)) {
                nodeMap.get(node.parentId)!.children!.push(node);
            } else {
                roots.push(node);
            }
        }

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
        gameOver, //New!
    };
}
