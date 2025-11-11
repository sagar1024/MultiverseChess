import React from "react";
import { motion } from "framer-motion";
import { useGameStore, type BoardState } from "@/store/gameStore";

interface TimelineTreeProps {
  boards: BoardState[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
}

interface TreeNode {
  id: string;
  parentId?: string | null;
  label: string;
  children: TreeNode[];
  isActive: boolean;
}

//Build hierarchical tree from flat boards list
function buildTree(boards: BoardState[], activeBoardId: string): TreeNode[] {
  const map = new Map<string, TreeNode>();

  for (const board of boards) {
    const lastMove = board.moves.length
      ? board.moves[board.moves.length - 1].san
      : null;

    map.set(board.id, {
      id: board.id,
      parentId: board.parentId ?? null,
      //label: board.label || (board.id === "root" ? "Start" : lastMove || "Move"),
      label: board.id === "root" ? "Start" : lastMove || `Board ${board.id.split("-").pop()}`,
      children: [],
      isActive: board.id === activeBoardId,
    });
  }

  const roots: TreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

//Recursive render node
const NodeRow: React.FC<{
  node: TreeNode;
  depth: number;
  onSelect: (id: string) => void;
}> = ({ node, depth, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="relative flex flex-col"
    >
      {/* Connecting line to parent */}
      {depth > 0 && (
        <div
          className="absolute left-[6px] top-[-6px] bottom-0 w-px bg-gray-700"
          style={{ marginLeft: `${depth * 16 - 8}px` }}
        />
      )}

      <div
        className="flex items-center space-x-2 relative z-10"
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <button
          onClick={() => onSelect(node.id)}
          className={`px-3 py-1 rounded text-sm transition-all duration-200 border ${node.isActive
            ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/50"
            : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
            }`}
        >
          {node.label}
        </button>
      </div>

      {node.children.length > 0 && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

//Allowing TimelineTree component signature to accept props
const TimelineTree: React.FC<TimelineTreeProps> = ({ boards, activeBoardId, onSelectBoard }) => {
  const roots = buildTree(boards, activeBoardId);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-auto max-h-[26rem] border border-gray-800">
      <h3 className="text-lg font-semibold mb-3 text-purple-400">Timeline Tree</h3>

      {roots.length === 0 ? (
        <p className="text-gray-500 text-sm">No moves yet</p>
      ) : (
        <div className="space-y-2">
          {roots.map((root) => (
            <NodeRow key={root.id} node={root} depth={0} onSelect={onSelectBoard} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineTree;
