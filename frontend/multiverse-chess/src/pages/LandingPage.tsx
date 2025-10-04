import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#111827] text-white flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                <h1
                    onClick={() => navigate("/")}
                    className="text-2xl font-bold text-purple-400 cursor-pointer hover:text-purple-300 transition"
                >
                    ♟ Multiverse Chess
                </h1>
            </header>

            {/* Main content */}
            <main className="flex flex-col flex-grow items-center justify-center px-6 text-center space-y-8">
                {/* Welcome text */}
                <div>
                    <h2 className="text-4xl font-bold mb-4 text-purple-300">
                        Welcome to Multiverse Chess
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        A chess variant where every move can create an alternate universe.
                        Explore parallel games, master multiple boards, and claim victory
                        across the multiverse!
                    </p>
                </div>

                {/* How to play */}
                <div className="bg-gray-800/60 border border-purple-500 rounded-lg p-6 max-w-2xl text-left space-y-3">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">
                        How to Play
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Each turn, you can make up to 3 legal moves, each creating a new timeline.</li>
                        <li>Timelines branch into separate boards — win more boards to win the match.</li>
                        <li>If your time runs out, you only lose the boards still in progress.</li>
                        <li>Boards that have ended remain unaffected by time losses.</li>
                        <li>The winner is the player with the most board victories at the end.</li>
                    </ul>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-6">
                    <button
                        onClick={() => navigate("/create")}
                        className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-lg font-semibold"
                    >
                        Create Game
                    </button>
                    <button
                        onClick={() => navigate("/join")}
                        className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-lg font-semibold"
                    >
                        Join Game via Link
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
