// import React, { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Chessboard from "../components/game/Chessboard";
// import BoardTimelineTree from "../components/game/BoardTimelineTree";
// import PlayerInfo from "../components/game/PlayerInfo";
// import ActiveTurnIndicator from "../components/game/ActiveTurnIndicator";
// import Loader from "../components/common/Loader";
// import { getGame } from "../utils/storage";
// import { useChessEngine } from "../hooks/useChessEngine";
// import { isMoveLegal } from "../utils/chessHelpers";
// import type { Square } from "chess.js";
// import { useTimer } from "../hooks/useTimer";
// import { DEFAULT_TIME_PER_PLAYER } from "../utils/constants";

// type GameOverState = {
//   winner: "Host" | "Guest" | "Draw";
//   score: string;
//   host: { wins: number; losses: number; draws: number; timeLossBoards: number };
//   guest: { wins: number; losses: number; draws: number; timeLossBoards: number };
// };

// const GameRoom: React.FC = () => {
//   const { gameId } = useParams<{ gameId: string }>();
//   const navigate = useNavigate();

//   //Redirect to home if no gameId in URL
//   useEffect(() => {
//     if (!gameId) {
//       navigate("/");
//       return;
//     }
//     const game = getGame(gameId);
//     if (!game) {
//       navigate("/not-found");
//       return;
//     }
//   }, [gameId, navigate]);

//   //Hook into chess engine state
//   const {
//     getActiveBoard,
//     makeMove,
//     setActiveBoardId,
//     isLoading,
//     currentTurn,
//     getTimeline,
//     gameOver, // <-- NEW
//   } = useChessEngine();
//   const activeBoard = getActiveBoard();

//   //Safe position fallback
//   const position = activeBoard ? activeBoard.chess.fen() : "start";

//   //Timers: use constants (seconds)
//   const INITIAL_TIME = DEFAULT_TIME_PER_PLAYER ?? 300;

//   const whiteTimer = useTimer({
//     initialTime: INITIAL_TIME,
//     isRunning: currentTurn === "w",
//     onTimeOver: () => handleTimeOver("white"),
//   });

//   const blackTimer = useTimer({
//     initialTime: INITIAL_TIME,
//     isRunning: currentTurn === "b",
//     onTimeOver: () => handleTimeOver("black"),
//   });

//   //Called when any player's timer reaches 0
//   function handleTimeOver(side: "white" | "black") {
//     const winner = side === "white" ? "Guest" : "Host";

//     const payload: GameOverState = {
//       winner: winner as GameOverState["winner"],
//       score: winner === "Host" ? "1 - 0" : "0 - 1",
//       host: {
//         wins: winner === "Host" ? 1 : 0,
//         losses: winner === "Guest" ? 1 : 0,
//         draws: 0,
//         timeLossBoards: side === "white" ? 1 : 0,
//       },
//       guest: {
//         wins: winner === "Guest" ? 1 : 0,
//         losses: winner === "Host" ? 1 : 0,
//         draws: 0,
//         timeLossBoards: side === "black" ? 1 : 0,
//       },
//     };

//     if (gameId) {
//       navigate(`/game/${gameId}/over`, { state: payload });
//     }
//   }

//   //Handle moves
//   const handleMove = (from: string, to: string): boolean => {
//     if (!activeBoard) return false;

//     const boardTurn = activeBoard.chess.turn(); //'w' or 'b'
//     if (boardTurn !== currentTurn) return false;

//     const legal = isMoveLegal(activeBoard.chess, from as Square, to as Square);
//     if (!legal) return false;

//     return makeMove(from as Square, to as Square);
//   };

//   //Auto-detect game over from chess.js
//   useEffect(() => {
//     if (gameOver.isOver && gameId) {
//       const payload: GameOverState = {
//         winner:
//           gameOver.winner === "white"
//             ? "Host"
//             : gameOver.winner === "black"
//               ? "Guest"
//               : "Draw",
//         score:
//           gameOver.winner === "white"
//             ? "1 - 0"
//             : gameOver.winner === "black"
//               ? "0 - 1"
//               : "½ - ½",
//         host: {
//           wins: gameOver.winner === "white" ? 1 : 0,
//           losses: gameOver.winner === "black" ? 1 : 0,
//           draws: gameOver.winner === "draw" ? 1 : 0,
//           timeLossBoards: 0,
//         },
//         guest: {
//           wins: gameOver.winner === "black" ? 1 : 0,
//           losses: gameOver.winner === "white" ? 1 : 0,
//           draws: gameOver.winner === "draw" ? 1 : 0,
//           timeLossBoards: 0,
//         },
//       };

//       navigate(`/game/${gameId}/over`, { state: payload });
//     }
//   }, [gameOver, gameId, navigate]);

//   if (isLoading || !gameId) {
//     return <Loader />;
//   }

//   return (
//       <div className="bg-gray-950 text-white flex flex-col h-screen">
//         {/* Top Bar */}
//         <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
//           <div className="flex items-center gap-4">
//             <span className="font-semibold">Game ID: {gameId}</span>
//             <button
//               className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 transition"
//               onClick={() =>
//                 navigator.clipboard.writeText(
//                   `${window.location.origin}/game/${gameId}`
//                 )
//               }>
//               Share Link
//             </button>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-300">Turn</span>
//             <ActiveTurnIndicator isActive={currentTurn === "w"} />
//           </div>
//         </div>

//         {/* Main Game Area */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Chessboard */}
//           <div className="flex-1 flex justify-center items-center p-4">
//             <Chessboard
//               position={position}
//               onMove={handleMove}
//               orientation={currentTurn === "w" ? "white" : "black"}
//               allowMoves={true}
//             />
//           </div>

//           {/* Right Panel */}
//           <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4">
//             <PlayerInfo
//               name="Host"
//               timeRemaining={whiteTimer.time}
//               isActive={currentTurn === "w"}
//             />
//             <div className="my-2" />
//             <PlayerInfo
//               name="Guest"
//               timeRemaining={blackTimer.time}
//               isActive={currentTurn === "b"}
//             />

//             {/* Timeline Tree */}
//             <div className="mt-6 flex-1 overflow-auto">
//               <BoardTimelineTree
//                 nodes={getTimeline()}
//                 onSelectBoard={(id) => setActiveBoardId(id)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// };

// export default GameRoom;

import React, { useEffect } from "react";
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

  // Zustand Store
  const {
    boards,
    activeBoardId,
    activeTurn,
    players,
    makeMove,
    setActiveBoard,
    gameStatus,
    endGame,
  } = useGameStore();

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const position = activeBoard ? activeBoard.chess.fen() : "start";

  // Redirect logic
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

  // Timers
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
  function handleTimeOver(side: "white" | "black") {
    const winner = side === "white" ? "Guest" : "Host";

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

  //Handle move
  const handleMove = (from: string, to: string): boolean => {
    if (!activeBoard || gameStatus !== "playing") return false;

    try {
      makeMove(activeBoard.id, { from, to });
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
          <Chessboard
            position={position}
            onMove={handleMove}
            orientation={activeTurn === "white" ? "white" : "black"}
            allowMoves={true}
          />
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
              onSelectBoard={(id) => setActiveBoard(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
