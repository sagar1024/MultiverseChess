import React from "react";
import Button from "../common/Button";

interface NavbarProps {
    onCreateGame?: () => void;
    onJoinGame?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCreateGame, onJoinGame }) => {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            {/* Logo / Title */}
            <div className="text-xl font-bold tracking-wide">
                ♟ Multiverse Chess
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                {onCreateGame && (
                    <Button size="sm" onClick={onCreateGame}>
                        Create Game
                    </Button>
                )}
                {onJoinGame && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onJoinGame}
                    >
                        Join Game
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
