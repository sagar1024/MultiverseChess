import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chessboard from "@/components/game/Chessboard";
import TimelineTree from "@/components/game/TimelineTree";
import Loader from "@/components/common/Loader";
import { useGameStore } from "@/store/gameStore";

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const {
    boards,
    activeBoardId,
    turn,
    gameStatus,
    moveCountThisTurn,
    maxMovesPerTurn,
    makePlayerMove,
    createUniverseFrom,
    passTurn,
    engineMoveAllBoards,
    setActiveBoard,
  } = useGameStore();

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const position = activeBoard?.chess.fen() ?? "start";

  /* ================= REDIRECT SAFETY ================= */

  useEffect(() => {
    if (!gameId || boards.length === 0) {
      navigate("/");
    }
  }, [gameId, boards.length, navigate]);

  /* ================= ENGINE TURN ================= */

  useEffect(() => {
    if (turn === "engine" && gameStatus === "playing") {
      const timeout = setTimeout(() => {
        engineMoveAllBoards();
      }, 300); // slight delay for UX

      return () => clearTimeout(timeout);
    }
  }, [turn, gameStatus, engineMoveAllBoards]);

  /* ================= MOVE HANDLER ================= */

  const handleMove = (from: string, to: string): boolean => {
    if (!activeBoard) return false;
    if (turn !== "player") return false;

    return makePlayerMove(activeBoard.id, { from, to });
  };

  if (!activeBoard) return <Loader />;

  /* ================= UI ================= */

  return (
    <div className="bg-gray-950 text-white flex flex-col h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
        <span className="font-semibold">Game ID: {gameId}</span>

        <span
          className={`px-3 py-1 rounded text-sm font-semibold ${
            turn === "player"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {turn === "player" ? "Your Turn" : "Computer Thinking"}
        </span>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Board */}
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="flex flex-col items-center gap-4">
            <Chessboard
              position={position}
              onMove={handleMove}
              allowMoves={turn === "player"}
              orientation="white"
            />

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => createUniverseFrom(activeBoardId)}
                disabled={turn !== "player"}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  turn !== "player"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Create Universe
              </button>

              <button
                onClick={passTurn}
                disabled={turn !== "player" || moveCountThisTurn === 0}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  turn !== "player" || moveCountThisTurn === 0
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                Pass Turn ({moveCountThisTurn}/{maxMovesPerTurn})
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 flex flex-col">
          <TimelineTree
            boards={boards}
            activeBoardId={activeBoardId}
            onSelectBoard={setActiveBoard}
          />
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
