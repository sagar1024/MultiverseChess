// import React from "react";
// import { Chessboard as ReactChessboard } from "react-chessboard";

// interface ChessboardProps {
//     position: string; //FEN string
//     onMove: (source: string, target: string) => boolean;
//     orientation: "white" | "black"; //NEW
// }

// const Chessboard: React.FC<ChessboardProps> = ({ position, onMove, orientation }) => {
//     return (
//         <div className="border-4 border-purple-500 rounded-lg shadow-lg">
//             <ReactChessboard
//                 options={{
//                     position,
//                     onPieceDrop: ({ sourceSquare, targetSquare }) => {
//                         if (!sourceSquare || !targetSquare) return false;
//                         return onMove(sourceSquare, targetSquare);
//                     },
//                     allowDragging: true,
//                     boardOrientation: orientation, //Use dynamic
//                     animationDurationInMs: 200,
//                     boardStyle: { borderRadius: "8px" },
//                 }}
//             />
//         </div>
//     );
// };

// export default Chessboard;

import React from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

interface ChessboardProps {
    position: string; // FEN string
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
        <div className="border-4 border-purple-500 rounded-lg shadow-lg max-w-full" style={{ width: "min(600px, 80vw)" }}>
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
