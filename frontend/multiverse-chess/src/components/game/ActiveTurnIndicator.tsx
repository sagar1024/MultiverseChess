import React from "react";

interface ActiveTurnIndicatorProps {
    isActive: boolean;
}

const ActiveTurnIndicator: React.FC<ActiveTurnIndicatorProps> = ({ isActive }) => {
    return (
        <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}>
        </div>
    );
};

export default ActiveTurnIndicator;
