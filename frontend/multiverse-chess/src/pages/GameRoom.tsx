import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import Chessboard from "../components/game/Chessboard";
import BoardTimelineTree from "../components/game/BoardTimelineTree";
import PlayerInfo from "../components/game/PlayerInfo";
import ActiveTurnIndicator from "../components/game/ActiveTurnIndicator";
import Loader from "../components/common/Loader";

import { useChessEngine } from "../hooks/useChessEngine";
import { isMoveLegal } from "../utils/chessHelpers";
import type { Square } from "chess.js";

type GameOverState = {
    winner: "Host" | "Guest" | "Draw";
    score: string;
    host: { wins: number; losses: number; draws: number; timeLossBoards: number };
    guest: { wins: number; losses: number; draws: number; timeLossBoards: number };
};

const GameRoom: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    //Redirect to home if no gameId in URL
    useEffect(() => {
        if (!gameId) {
            navigate("/");
        }
    }, [gameId, navigate]);

    //Hook into chess engine state
    const { boards, getActiveBoard, makeMove, setActiveBoardId, isLoading, currentTurn } =
        useChessEngine();
    const activeBoard = getActiveBoard();

    //Track initial clock (e.g., 5 minutes each)
    const INITIAL_TIME = 300;

    //Safe position fallback
    const position = activeBoard ? activeBoard.chess.fen() : "start";

    //Must return boolean for Chessboard's onMove
    const handleMove = (from: string, to: string): boolean => {
        if (!activeBoard) return false;

        const legal = isMoveLegal(activeBoard.chess, from as Square, to as Square);
        if (!legal) return false;

        makeMove(from as Square, to as Square);
        return true;
    };

    //Game Over navigation
    const endGameWith = (payload: GameOverState) => {
        if (gameId) {
            navigate(`/game/${gameId}/over`, { state: payload });
        }
    };

    //Demo "End Game" button
    const endGame = () => {
        const state: GameOverState = {
            winner: "Host",
            score: "7 - 5",
            host: { wins: 7, losses: 5, draws: 2, timeLossBoards: 1 },
            guest: { wins: 5, losses: 7, draws: 2, timeLossBoards: 2 },
        };
        endGameWith(state);
    };

    //Show loader if engine still initializing
    if (isLoading || !gameId) {
        return <Loader />;
    }

    return (
        <PageWrapper>
            <div className="bg-gray-950 text-white flex flex-col h-screen">
                {/* Top Bar */}
                <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">Game ID: {gameId}</span>
                        <button
                            className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 transition"
                            onClick={() =>
                                navigator.clipboard.writeText(`${window.location.origin}/game/${gameId}`)
                            }>
                            Share Link
                        </button>
                    </div>
                    {/* show who is active */}
                    <ActiveTurnIndicator isActive={currentTurn === "w"} />
                </div>

                {/* Main Game Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Chessboard */}
                    <div className="flex-1 flex justify-center items-center p-4">
                        <Chessboard
                            position={position}
                            onMove={handleMove}
                            orientation={currentTurn === "w" ? "white" : "black"}
                        />
                    </div>

                    {/* Right Panel */}
                    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4">
                        <PlayerInfo
                            name="Host"
                            timeRemaining={INITIAL_TIME}
                            isActive={currentTurn === "w"}
                        />
                        <PlayerInfo
                            name="Guest"
                            timeRemaining={INITIAL_TIME}
                            isActive={currentTurn === "b"}
                        />

                        {/* Timeline Tree */}
                        <div className="mt-6 flex-1 overflow-auto">
                            <BoardTimelineTree
                                boards={boards.map((b) => ({
                                    id: b.id,
                                    label: b.moves.length
                                        ? b.moves[b.moves.length - 1].san
                                        : "Start",
                                    parentId: null, //TODO: wire to actual parent board when branching
                                    moveSAN: b.moves.length
                                        ? b.moves[b.moves.length - 1].san
                                        : null,
                                    children: [], //TODO: wire children for timeline tree
                                }))}
                                onSelectBoard={(id) => setActiveBoardId(id)}
                            />
                        </div>

                        {/* TEMP: trigger end game for testing */}
                        <button
                            className="mt-4 bg-purple-600 rounded px-3 py-2 hover:bg-purple-700"
                            onClick={endGame}
                        >
                            End Game (Demo)
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default GameRoom;
