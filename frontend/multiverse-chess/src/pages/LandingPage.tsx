import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#111827] text-white flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
                <h1
                    onClick={() => navigate("/")}
                    className="text-2xl font-bold text-purple-400 cursor-pointer hover:text-purple-300 transition"
                >
                    ♟ Multiverse Chess
                </h1>
            </header>

            {/* Main content */}
            <main className="flex flex-col flex-grow items-center justify-center px-6 text-center space-y-12">
                {/* Hero Section */}
                <div className="space-y-4">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-purple-300">
                        Welcome to Multiverse Chess
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        A chess variant where every move can create an alternate universe.
                        Explore parallel games, master multiple boards, and claim victory
                        across the multiverse!
                    </p>
                </div>

                {/* How to play */}
                <div className="bg-gray-800/60 border border-purple-500 rounded-2xl p-8 max-w-3xl text-left space-y-4 shadow-lg">
                    <h3 className="text-2xl font-semibold text-purple-400">
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
                <div className="flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={() => navigate("/create")}
                        className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-lg font-semibold shadow-md"
                    >
                        Create Game
                    </button>
                    <button
                        onClick={() => navigate("/join")}
                        className="px-8 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-lg font-semibold shadow-md"
                    >
                        Join Game via Link
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
