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
            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-36">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-8"
                >
                    {/* Welcome Heading */}
                    {/* Using inline CSS to override all previous/global css */}
                    <h1 style={{
                        fontSize: "70px",
                        lineHeight: 1,
                        fontWeight: 900,
                        color: "transparent",
                        background: "linear-gradient(90deg,#9b5de5,#f15bb5,#9b5de5)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        textShadow: "0 0 30px rgba(155,93,229,0.35)"
                    }}>
                        Welcome to Multiverse Chess
                    </h1>

                    <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed text-center">
                        A chess variant where every move creates an alternate universe. Command multiple boards in parallel, conquer across the multiverse!
                    </p>
                </motion.div>

                {/* How to Play Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-gray-900/80 border border-purple-500/40 rounded-3xl p-16 md:p-20 shadow-2xl backdrop-blur-md max-w-6xl w-full flex flex-col items-center text-center space-y-10 mt-20 mb-20"
                >
                    <h2 style={{
                        fontSize: "60px",
                        lineHeight: 1.1,
                        fontWeight: 800,
                        color: "#c084fc",
                        textShadow: "0 0 20px rgba(192,132,252,0.4)",
                        marginBottom: "1rem",
                    }}>
                        How to Play
                    </h2>

                    <ul className="list-disc text-xl text-gray-300 space-y-3 leading-relaxed text-left max-w-3xl mx-auto">
                        <li>Make up to <b>3 legal moves</b>, creating new timelines.</li>
                        <li>Timelines branch into separate boards.</li>
                        <li>If your time runs out, you only lose the boards still in progress.</li>
                        <li>Completed boards remain unaffected by time losses.</li>
                        <li>The player with the <b>most board victories</b> wins.</li>
                    </ul>
                </motion.div>

                {/* Buttons Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-10 pt-12 mt-10"
                >
                    <button onClick={handleCreateGame}
                        className="px-16 py-7 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
                    >
                        Create Game
                    </button>
                    <button onClick={() => navigate('/join')}
                        className="px-16 py-7 rounded-3xl bg-gray-800 hover:bg-gray-700 text-xl font-semibold shadow-md border border-gray-600 transition-transform transform hover:scale-105"
                    >
                        Join Game via Link
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default LandingPage;
