import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";

interface GameOverState {
  winner: string;
  score: string;
  wins: number;
  losses: number;
  draws: number;
}

const GameOver: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const state = location.state as GameOverState | null;

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Game Over</h1>
        <p className="text-lg mb-4">No game data found for game ID: {gameId}</p>
        <Link
          to="/"
          className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const { winner, score, wins, losses, draws } = state;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-white">
      <h1 className="text-4xl font-bold mb-6">Game Over</h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-80">
        <p className="text-xl mb-2">
          <span className="font-semibold">Winner:</span> {winner || "N/A"}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Score:</span> {score || "0-0"}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wins:</span> {wins} |{" "}
          <span className="font-semibold">Losses:</span> {losses} |{" "}
          <span className="font-semibold">Draws:</span> {draws}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Go Home
          </Link>
          <Link
            to={`/game/${gameId}`}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Rematch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
