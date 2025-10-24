import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { createGame } from "../utils/storage";
import { useGameStore } from "../store/gameStore";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    // const handleCreateGame = () => {
    //     const gameId = uuidv4().slice(0, 8);
    //     createGame(gameId, "Host");
    //     navigate(`/game/${gameId}`);
    // };
    const handleCreateGame = () => {
        const gameId = uuidv4().slice(0, 8);
        const initGame = useGameStore.getState().initGame; //Access Zustand action

        //Initialize game in Zustand
        initGame("Host", "Guest", 600);

        //Also store in localStorage for fallback
        createGame(gameId, "Host");

        //Navigate to the new game
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0f0f1a] via-[#1a1035] to-[#2a0a50] overflow-hidden">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 via-fuchsia-700/10 to-transparent blur-3xl pointer-events-none" />

            {/* Main Content */}
            <main style={{
                padding: "100px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "75px",
            }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-36">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}

                    //className="space-y-8"
                    style={{
                        padding: "20px 60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "50px",
                    }}>

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

                    {/* Using inline CSS mainly to decrease font size */}
                    <p style={{
                        fontSize: "18.75px",
                        lineHeight: "1.6",
                        color: "#d1d5db", //Same as text-gray-300
                        textAlign: "center",
                        maxWidth: "80rem",
                        margin: "0 auto",
                    }} className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed text-center">
                        A chess variant where every move creates a new reality — spawns a new world in an alternate universe! In this game of infinite possibilities, every world decides your fate. Split realities, command multiple boards and outsmart your opponent. CONQUER THE MULTIVERSE!
                    </p>
                </motion.div>

                {/* Buttons Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "150px",
                        paddingTop: "10px",
                        marginTop: "10px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}>

                    {/* Create Game Button */}
                    <button
                        onClick={handleCreateGame}
                        style={{
                            padding: "28px 50px",
                            fontSize: "25px",
                            fontWeight: 800,
                            borderRadius: "20px",
                            background: "linear-gradient(90deg, #9b5de5, #f15bb5, #9b5de5)",
                            color: "white",
                            boxShadow: "0 0 40px rgba(241,91,181,0.6)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow = "0 0 60px rgba(241,91,181,0.8)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 40px rgba(241,91,181,0.6)";
                        }}>
                        Create Game
                    </button>

                    {/* Join Game Button */}
                    <button
                        onClick={() => navigate("/join")}
                        style={{
                            padding: "28px 50px",
                            fontSize: "25px",
                            fontWeight: 700,
                            borderRadius: "20px",
                            background: "#1e1e2f",
                            color: "#c084fc",
                            border: "2px solid #c084fc",
                            boxShadow: "0 0 25px rgba(192,132,252,0.4)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.background = "#2a1a40";
                            e.currentTarget.style.boxShadow = "0 0 50px rgba(192,132,252,0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.background = "#1e1e2f";
                            e.currentTarget.style.boxShadow = "0 0 25px rgba(192,132,252,0.4)";
                        }}>
                        Join via Link
                    </button>
                </motion.div>

                {/* How to Play Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}

                    //Using inline CSS instead of Tailwind
                    //className="bg-gray-900/80 border border-purple-500/40 rounded-3xl p-16 md:p-20 shadow-2xl backdrop-blur-md max-w-6xl w-full flex flex-col items-center text-center space-y-10 mt-20 mb-20"
                    style={{
                        background: "rgba(17, 17, 27, 0.8)",
                        border: "1px solid rgba(192,132,252,0.4)",
                        borderRadius: "30px",
                        padding: "80px 80px",
                        boxShadow: "0 0 60px rgba(155,93,229,0.25)",
                        backdropFilter: "blur(12px)",
                        maxWidth: "1100px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "50px",
                        marginTop: "40px",
                        //marginBottom: "120px",
                    }}>

                    <h2 style={{
                        fontSize: "50px",
                        lineHeight: 1.1,
                        fontWeight: 800,
                        color: "#c084fc",
                        textShadow: "0 0 20px rgba(192,132,252,0.4)",
                        marginBottom: "1rem",
                    }}>
                        How to Play?
                    </h2>

                    <ul className="list-disc text-xl text-gray-300 space-y-3 leading-relaxed text-left max-w-3xl mx-auto">
                        <li>― Make up to <b>3 legal moves</b>, creating new timelines.</li>
                        <li>― Timelines branch into separate boards.</li>
                        <li>― If time runs out, you only lose games still in progress.</li>
                        <li>― Completed boards remain unaffected by time losses.</li>
                        <li>― The player with the <b>most board victories</b> wins.</li>
                    </ul>
                </motion.div>
            </main>
        </div>
    );
};

export default LandingPage;
