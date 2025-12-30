import React from "react";
import { motion } from "framer-motion";
import type { BoardState } from "@/store/gameStore";

interface TimelineTreeProps {
  boards: BoardState[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
}

const TimelineTree: React.FC<TimelineTreeProps> = ({
  boards,
  activeBoardId,
  onSelectBoard,
}) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-auto max-h-[26rem] border border-gray-800">
      <h3 className="text-lg font-semibold mb-3 text-purple-400">
        Active Universes
      </h3>

      {boards.length === 0 ? (
        <p className="text-gray-500 text-sm">No universes yet</p>
      ) : (
        <div className="space-y-2">
          {boards.map((board, index) => {
            const movesText =
              board.moves.length > 0
                ? board.moves
                  .map((m, i) =>
                    i % 2 === 0
                      ? `${Math.floor(i / 2) + 1}. ${m.san}`
                      : m.san
                  )
                  .join(" ")
                : "—";

            const isActive = board.id === activeBoardId;

            return (
              <motion.button
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`w-full text-left px-3 py-2 rounded border text-sm transition-all duration-200 ${isActive ?
                  "bg-purple-700/30 border-purple-500 text-white shadow-md shadow-purple-700/40"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Board {index + 1}
                  </span>

                  {board.status !== "active" && (
                    <span className="text-xs text-red-400">
                      {board.status}
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xs text-gray-400 truncate">
                  {movesText}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimelineTree;
