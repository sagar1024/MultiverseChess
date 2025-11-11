import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import Chessboard from "../components/game/Chessboard";
import TimelineTree from "../components/game/TimelineTree";
import PlayerInfo from "../components/game/PlayerInfo";
import ActiveTurnIndicator from "../components/game/ActiveTurnIndicator";
import Loader from "../components/common/Loader";
import { useTimer } from "../hooks/useTimer";
import { DEFAULT_TIME_PER_PLAYER } from "../utils/constants";
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

  //Zustand Store
  const {
    boards,
    activeBoardId,
    activeTurn,
    players,
    makeMove,
    createNewUniverse,
    setActiveBoard,
    gameStatus,
    endGame,
  } = useGameStore();

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const position = activeBoard ? activeBoard.chess.fen() : "start";

  //Redirect logic
  useEffect(() => {
    if (!gameId) {
      navigate("/");
      return;
    }
    if (boards.length === 0 || gameStatus === "waiting") {
      navigate("/not-found");
      return;
    }
  }, [gameId, boards.length, gameStatus, navigate]);

  //Timers
  const whiteTimer = useTimer({
    initialTime: players.white.timeLeft || DEFAULT_TIME_PER_PLAYER,
    isRunning: activeTurn === "white" && gameStatus === "playing",
    onTimeOver: () => handleTimeOver("white"),
  });

  const blackTimer = useTimer({
    initialTime: players.black.timeLeft || DEFAULT_TIME_PER_PLAYER,
    isRunning: activeTurn === "black" && gameStatus === "playing",
    onTimeOver: () => handleTimeOver("black"),
  });

  //Handle time over event
  //If white’s clock runs out, black wins, and vice versa. It builds a GameOverState payload
  //Ends the game in the store and redirects to the “Game Over” page
  function handleTimeOver(side: "white" | "black") {

    //There is no logic in this. This assumes that when white looses by time, it should show "Guest" won
    //Instead it should show which side won, like white or black
    const winner = side === "white" ? "Guest" : "Host";

    //How does this count the total wins and losses of each player?
    //Implementation pending for keeping a track of wins and losses
    const payload: GameOverState = {
      winner: winner as GameOverState["winner"],
      score: winner === "Host" ? "1 - 0" : "0 - 1",
      host: {
        wins: winner === "Host" ? 1 : 0,
        losses: winner === "Guest" ? 1 : 0,
        draws: 0,
        timeLossBoards: side === "white" ? 1 : 0,
      },
      guest: {
        wins: winner === "Guest" ? 1 : 0,
        losses: winner === "Host" ? 1 : 0,
        draws: 0,
        timeLossBoards: side === "black" ? 1 : 0,
      },
    };

    endGame();
    navigate(`/game/${gameId}/over`, { state: payload });
  }

  //Tracks which boards the player has moved in this turn
  const [movedBoardsThisTurn, setMovedBoardsThisTurn] = useState<string[]>([]);

  //Pass turn manually or after 3 moves
  //This doesnt work as planned for now, it only counts PLYs and flips the board after 3 PLYs
  //I want a player to create at max 3 universes/boards and one move in each of them
  const passTurn = () => {
    setMovedBoardsThisTurn([]);
    useGameStore.setState((state) => ({
      activeTurn: state.activeTurn === "white" ? "black" : "white",
    }));
  };

  //Handle move
  //Executes a move on the active board via makeMove
  //If successful, it updates movedBoardsThisTurn

  //What it should actually do
  //Keep track of all boards created in this game and
  //Check which boards currently has my turn
  //Handle moves and update the state of all boards
  const handleMove = (from: string, to: string): boolean => {
    if (!activeBoard || gameStatus !== "playing") return false;

    try {
      const success = makeMove(activeBoard.id, { from, to });
      if (!success) return false;

      //Track which boards have received a move this turn
      setMovedBoardsThisTurn((prev) => {
        const updated = prev.includes(activeBoard.id) ? prev : [...prev, activeBoard.id];

        const totalBoardsMoved = updated.length;

        //Count all boards that are still active and belong to the current player’s turn
        const totalBoardsAvailable = boards.filter(
          (b) => b.status === "active"
        ).length;

        //Auto-pass if player made one move in each available universe (or reached 3 universes)
        if (totalBoardsMoved >= totalBoardsAvailable || totalBoardsMoved >= 3) {
          passTurn();
          return [];
        }

        return updated;
      });

      return true;
    } catch {
      return false;
    }
  };


  //Detect game over from board states
  useEffect(() => {
    const allDone = boards.every((b) => b.status !== "active");
    if (allDone && gameStatus !== "finished") {
      endGame();

      // Compute results
      const whiteWins = boards.filter((b) => b.status === "checkmate" && b.chess.turn() === "b").length;
      const blackWins = boards.filter((b) => b.status === "checkmate" && b.chess.turn() === "w").length;
      const draws = boards.filter((b) => b.status === "draw" || b.status === "stalemate").length;

      const winner =
        whiteWins > blackWins ? "Host" : blackWins > whiteWins ? "Guest" : "Draw";

      const payload: GameOverState = {
        winner,
        score:
          winner === "Host"
            ? "1 - 0"
            : winner === "Guest"
              ? "0 - 1"
              : "½ - ½",
        host: {
          wins: whiteWins,
          losses: blackWins,
          draws,
          timeLossBoards: 0,
        },
        guest: {
          wins: blackWins,
          losses: whiteWins,
          draws,
          timeLossBoards: 0,
        },
      };

      navigate(`/game/${gameId}/over`, { state: payload });
    }
  }, [boards, endGame, gameStatus, gameId, navigate]);

  if (boards.length === 0 || !activeBoard) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-950 text-white flex flex-col h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Game ID: {gameId}</span>
          <button
            className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 transition"
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/game/${gameId}`
              )
            }
          >
            Share Link
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">Turn</span>
          <ActiveTurnIndicator isActive={activeTurn === "white"} />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chessboard */}
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="flex flex-col items-center gap-4">
            <Chessboard
              position={position}
              onMove={handleMove}
              orientation={activeTurn === "white" ? "white" : "black"}
              allowMoves={true}
            />

            <div className="flex gap-3">
              {/* <button onClick={() => createNewUniverse(activeBoardId)} */}
              <button
                onClick={() => {
                  createNewUniverse(activeBoardId);
                  //When a new board is created, player can move there this turn too
                  //You don’t need to modify the inner logic of createNewUniverse here
                  //That’s handled in store
                }}
                className="px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Create New Universe
              </button>

              <button
                onClick={passTurn}
                disabled={movedBoardsThisTurn.length === 0}
                className={`px-4 py-2 rounded-lg font-semibold transition ${movedBoardsThisTurn.length === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  }`}
              >
                Pass Turn ({movedBoardsThisTurn.length}/3)
              </button>

            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4">
          <PlayerInfo
            name={players.white.name}
            timeRemaining={whiteTimer.time}
            isActive={activeTurn === "white"}
          />
          <div className="my-2" />
          <PlayerInfo
            name={players.black.name}
            timeRemaining={blackTimer.time}
            isActive={activeTurn === "black"}
          />

          {/* Timeline Tree */}
          <div className="mt-6 flex-1 overflow-auto">
            <TimelineTree
            boards={boards}
              activeBoardId={activeBoardId}
              onSelectBoard={(id: string) => setActiveBoard(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
