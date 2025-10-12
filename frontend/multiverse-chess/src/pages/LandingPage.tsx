import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { createGame } from "../utils/storage";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        const gameId = uuidv4().slice(0, 8);
        createGame(gameId, "Host");
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0f0f1a] via-[#1a1035] to-[#2a0a50] overflow-hidden">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 via-fuchsia-700/10 to-transparent blur-3xl pointer-events-none" />

            {/* Main Content */}
            <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-24">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-8"
                >
                    <h1 className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 drop-shadow-xl">
                        Welcome to Multiverse Chess
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A mind-bending chess variant where every move can create an alternate
                        universe. Command parallel boards, outthink your opponent, and conquer
                        across the multiverse!
                    </p>
                </motion.div>

                {/* How to Play Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-gray-900/80 border border-purple-500/40 rounded-3xl p-10 md:p-14 shadow-2xl backdrop-blur-md max-w-4xl space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
                        How to Play
                    </h2>
                    <ul className="list-disc list-inside text-xl text-gray-300 space-y-3 leading-relaxed text-left">
                        <li>
                            Each turn, you can make up to <b>3 legal moves</b>, each creating a
                            new timeline.
                        </li>
                        <li>
                            Timelines branch into separate boards — win more boards to win the
                            match.
                        </li>
                        <li>
                            If your time runs out, you only lose the boards still in progress.
                        </li>
                        <li>Completed boards remain unaffected by time losses.</li>
                        <li>
                            The player with the <b>most board victories</b> at the end wins the
                            multiverse.
                        </li>
                    </ul>
                </motion.div>

                {/* Buttons Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-8 pt-6"
                >
                    <button
                        onClick={handleCreateGame}
                        className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
                    >
                        Create Game
                    </button>
                    <button
                        onClick={() => navigate("/join")}
                        className="px-12 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-xl font-semibold shadow-md border border-gray-600 transition-transform transform hover:scale-105"
                    >
                        Join Game via Link
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default LandingPage;
