import React from "react";
import ActiveTurnIndicator from "./ActiveTurnIndicator";
import Timer from "./Timer";

interface PlayerInfoProps {
    name: string;
    timeRemaining: number; //Seconds
    isActive: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ name, timeRemaining, isActive }) => {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg ${isActive ? "bg-purple-800" : "bg-gray-800"}`}>
            <div className="flex items-center gap-2">
                <ActiveTurnIndicator isActive={isActive} />
                <span className="font-semibold">{name}</span>
            </div>
            <Timer timeRemaining={timeRemaining} isActive={isActive} />
        </div>
    );
};

export default PlayerInfo;
