import React from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

interface ChessboardProps {
    position: string; //FEN string
    onMove: (source: string, target: string) => boolean;
    orientation?: "white" | "black";
    allowMoves?: boolean; //If false, disable dragging
}

const Chessboard: React.FC<ChessboardProps> = ({
    position,
    onMove,
    orientation = "white",
    allowMoves = true,
}) => {
    return (
        <div className="w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] border-4 border-purple-500 rounded-lg shadow-lg">
            <ReactChessboard
                options={{
                    position,
                    onPieceDrop: ({ sourceSquare, targetSquare }) => {
                        if (!sourceSquare || !targetSquare) return false;
                        return onMove(sourceSquare, targetSquare);
                    },
                    allowDragging: allowMoves,
                    boardOrientation: orientation,
                    animationDurationInMs: 200,
                    boardStyle: { borderRadius: "8px" },
                }}
            />
        </div>
    );
};

export default Chessboard;
