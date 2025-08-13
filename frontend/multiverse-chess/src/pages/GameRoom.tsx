import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Chessboard from "../components/game/Chessboard";
import BoardTimelineTree from "../components/game/BoardTimelineTree";
import PlayerInfo from "../components/game/PlayerInfo";
import ActiveTurnIndicator from "../components/game/ActiveTurnIndicator";
import Loader from "../components/common/Loader";

const GameRoom: React.FC = () => {
    const loading = false; // TODO: replace with game state loading
    const gameId = "ABC123"; // Example placeholder

    if (loading) {
        return <Loader />;
    }

    return (
        <PageWrapper>
            <div className="bg-gray-950 text-white flex flex-col h-screen">
                {/* Top Bar */}
                <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">Game ID: {gameId}</span>
                        <button
                            className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 transition"
                            onClick={() => navigator.clipboard.writeText(gameId)}
                        >
                            Share Link
                        </button>
                    </div>
                    <ActiveTurnIndicator currentPlayer="host" />
                </div>

                {/* Main Game Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Chessboard */}
                    <div className="flex-1 flex justify-center items-center p-4">
                        <Chessboard />
                    </div>

                    {/* Right Panel */}
                    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4">
                        <PlayerInfo name="Host" timeRemaining={300} isActive />
                        <PlayerInfo name="Guest" timeRemaining={280} isActive={false} />

                        {/* Timeline Tree */}
                        <div className="mt-6 flex-1 overflow-auto">
                            <BoardTimelineTree />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default GameRoom;
