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
import { useTimer } from "../hooks/useTimer";
import { DEFAULT_TIME_PER_PLAYER } from "../utils/constants";

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
        if (!gameId) navigate("/");
    }, [gameId, navigate]);

    //Hook into chess engine state
    const { boards, getActiveBoard, makeMove, setActiveBoardId, isLoading, currentTurn } =
        useChessEngine();
    const activeBoard = getActiveBoard();

    //Safe position fallback
    const position = activeBoard ? activeBoard.chess.fen() : "start";

    //Timers: use constants (seconds)
    const INITIAL_TIME = DEFAULT_TIME_PER_PLAYER ?? 300;

    //Timer hooks: only run when it's their turn
    const whiteTimer = useTimer({
        initialTime: INITIAL_TIME,
        isRunning: currentTurn === "w",
        onTimeOver: () => handleTimeOver("white"),
    });

    const blackTimer = useTimer({
        initialTime: INITIAL_TIME,
        isRunning: currentTurn === "b",
        onTimeOver: () => handleTimeOver("black"),
    });

    //Called when any player's timer reaches 0
    function handleTimeOver(side: "white" | "black") {
        //Winner is the opposite side
        const winner = side === "white" ? "Guest" : "Host";

        //Basic payload; replace with real board-level computation later
        const hostWins = 0;
        const guestWins = 0;
        const payload: GameOverState = {
            winner: winner as GameOverState["winner"],
            score: `${hostWins} - ${guestWins}`,
            host: {
                wins: hostWins,
                losses: guestWins,
                draws: 0,
                timeLossBoards: side === "white" ? 1 : 0,
            },
            guest: {
                wins: guestWins,
                losses: hostWins,
                draws: 0,
                timeLossBoards: side === "black" ? 1 : 0,
            },
        };

        if (gameId) {
            navigate(`/game/${gameId}/over`, { state: payload });
        }
    }

    //Must return boolean for Chessboard's onMove (accept or reject)
    const handleMove = (from: string, to: string): boolean => {
        if (!activeBoard) return false;

        //Prevent moves if the internal board turn doesn't match currentTurn
        const boardTurn = activeBoard.chess.turn(); //'w' or 'b'
        if (boardTurn !== currentTurn) return false;

        const legal = isMoveLegal(activeBoard.chess, from as Square, to as Square);
        if (!legal) return false;

        const ok = makeMove(from as Square, to as Square);
        return ok;
    };

    //Demo "End Game" button (keeps previous behavior)
    const endGameDemo = () => {
        const payload: GameOverState = {
            winner: "Host",
            score: "7 - 5",
            host: { wins: 7, losses: 5, draws: 2, timeLossBoards: 1 },
            guest: { wins: 5, losses: 7, draws: 2, timeLossBoards: 2 },
        };
        if (gameId) navigate(`/game/${gameId}/over`, { state: payload });
    };

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
                            }
                        >
                            Share Link
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Turn</span>
                        <ActiveTurnIndicator isActive={currentTurn === "w"} />
                    </div>
                </div>

                {/* Main Game Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Chessboard */}
                    <div className="flex-1 flex justify-center items-center p-4">
                        <Chessboard
                            position={position}
                            onMove={handleMove}
                            orientation={currentTurn === "w" ? "white" : "black"}
                            //You may want to disable dragging for non-active players in a multi-user setup.
                            //For local single-machine play we allow dragging but moves will be rejected if not allowed.
                            allowMoves={true}
                        />
                    </div>

                    {/* Right Panel */}
                    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4">
                        <PlayerInfo name="Host" timeRemaining={whiteTimer.time} isActive={currentTurn === "w"} />
                        <div className="my-2" />
                        <PlayerInfo name="Guest" timeRemaining={blackTimer.time} isActive={currentTurn === "b"} />

                        {/* Timeline Tree */}
                        <div className="mt-6 flex-1 overflow-auto">
                            <BoardTimelineTree
                                boards={boards.map((b) => ({
                                    id: b.id,
                                    label: b.moves.length ? b.moves[b.moves.length - 1].san : "Start",
                                    parentId: b.parentId ?? null,
                                    moveSAN: b.moves.length ? b.moves[b.moves.length - 1].san : null,
                                    children: [], //TODO: compute children from boards array for real branching display
                                }))}
                                onSelectBoard={(id) => setActiveBoardId(id)}
                            />
                        </div>

                        {/* TEMP: trigger end game for testing */}
                        <button
                            className="mt-4 bg-purple-600 rounded px-3 py-2 hover:bg-purple-700"
                            onClick={endGameDemo}
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
