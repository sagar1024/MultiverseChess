import React from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

interface ChessboardProps {
    position: string; // FEN string
    onMove: (source: string, target: string) => boolean;
}

const Chessboard: React.FC<ChessboardProps> = ({ position, onMove }) => {
    return (
        <div className="border-4 border-purple-500 rounded-lg shadow-lg">
            <ReactChessboard
                position={position}
                onPieceDrop={onMove}
                arePiecesDraggable
                boardOrientation="white"
                animationDuration={200}
                customBoardStyle={{
                    borderRadius: "8px",
                }}
            />
        </div>
    );
};

export default Chessboard;
