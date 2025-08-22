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
    const { gameId } = useParams();
    const location = useLocation();
    const state = location.state as GameOverState | undefined;

    if (!state) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold">Game Over</h1>
                <p>No game data found for game ID: {gameId}</p>
                <Link to="/" className="text-purple-400 underline">
                    Go Home
                </Link>
            </div>
        );
    }

    const { winner, score, wins, losses, draws } = state;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold mb-4">Game Over</h1>
            <p className="text-xl mb-2">Winner: {winner}</p>
            <p className="mb-2">Score: {score}</p>
            <p>
                Wins: {wins} | Losses: {losses} | Draws: {draws}
            </p>
            <div className="mt-6 flex gap-4">
                <Link to="/" className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 transition">
                    Go Home
                </Link>
                <Link to={`/game/${gameId}`} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    Rematch
                </Link>
            </div>
        </div>
    );
};

export default GameOver;
