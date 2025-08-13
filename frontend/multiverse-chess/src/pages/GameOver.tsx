import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/common/Button";

interface GameOverProps {
    winner: string;
    score: string;
    wins: number;
    losses: number;
    draws: number;
    timeLosses: number;
}

const GameOver: React.FC<GameOverProps> = ({
    winner = "Player X",
    score = "7 - 5",
    wins = 7,
    losses = 5,
    draws = 2,
    timeLosses = 1
}) => {
    return (
        <PageWrapper>
            <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
                <div className="bg-gray-900 border border-purple-500 rounded-lg p-8 shadow-lg text-center max-w-md w-full relative">
                    {/* Confetti Placeholder */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {/* TODO: add confetti animation */}
                    </div>

                    <h1 className="text-3xl font-bold text-purple-400 mb-4">
                        🏆 Winner: {winner}
                    </h1>
                    <p className="text-lg mb-6">Final Score: {score}</p>

                    <div className="bg-gray-800 p-4 rounded-lg mb-6">
                        <p>Wins: {wins}</p>
                        <p>Losses: {losses}</p>
                        <p>Draws: {draws}</p>
                        <p>Time Losses: {timeLosses}</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button variant="primary" onClick={() => console.log("Rematch")}>
                            Rematch
                        </Button>
                        <Button variant="secondary" onClick={() => console.log("Return Home")}>
                            Return Home
                        </Button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default GameOver;
