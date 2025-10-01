import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGame, joinGame } from "../utils/storage";

const JoinPage: React.FC = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        let gameId = "";

        //If full link is pasted, extract ID
        if (input.includes("/game/")) {
            const parts = input.split("/game/");
            gameId = parts[1]?.split("/")[0] || "";
        } else {
            //Otherwise assume it's just the code
            gameId = input.trim();
        }

        if (!gameId) {
            alert("Invalid game link or code");
            return;
        }

        //Validate against localStorage
        const existing = getGame(gameId);
        if (!existing) {
            navigate("/not-found");
            return;
        }

        //Register as guest
        joinGame(gameId, "Guest");

        //Navigate to the game
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e2f] text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Join a Game</h1>
            <form onSubmit={handleJoin} className="w-full max-w-md flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Paste game link or enter code"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
                >
                    Join Game
                </button>
            </form>
        </div>
    );
};

export default JoinPage;
