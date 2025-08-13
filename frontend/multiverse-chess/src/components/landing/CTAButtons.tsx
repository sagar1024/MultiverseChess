import React from "react";
import Button from "../common/Button";

interface CTAButtonsProps {
    onCreateGame: () => void;
    onJoinGame: () => void;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({ onCreateGame, onJoinGame }) => {
    return (
        <div className="flex justify-center gap-6 mt-8">
            <Button variant="primary" onClick={onCreateGame}>
                Create Game
            </Button>
            <Button variant="secondary" onClick={onJoinGame}>
                Join Game via Link
            </Button>
        </div>
    );
};

export default CTAButtons;
