import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../common/Button";
import { createGame } from "../../utils/storage";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleCreateGame = () => {
        const gameId = uuidv4().slice(0, 8);

        //Create and persist game in localStorage
        createGame(gameId, "Host");
        navigate(`/game/${gameId}`);
    };

    const handleJoinGame = () => {
        navigate("/join");
    };

    //Hide action buttons if inside a game room
    const isGameRoom = location.pathname.startsWith("/game/");

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
            {/* Logo & Title */}
            <div className="text-2xl font-extrabold tracking-wide cursor-pointer text-purple-400 hover:text-purple-300 transition" onClick={() => navigate("/")}>
                ♟ Multiverse Chess
            </div>

            {/* Actions */}
            {!isGameRoom && (
                <div className="flex gap-3">
                    <Button size="sm" onClick={handleCreateGame}>
                        Create Game
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleJoinGame}>
                        Join Game
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
