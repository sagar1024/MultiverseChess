import React from "react";
import type { BoardState } from "@/store/gameStore";

interface TimelineTreeProps {
  boards: BoardState[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
}

/** A minimal tree node structure derived from BoardState */
interface TreeNode {
  id: string;
  parentId?: string | null;
  label: string;
  children: TreeNode[];
  isActive: boolean;
}

/** Build a tree from flat board list */
function buildTree(boards: BoardState[], activeBoardId: string): TreeNode[] {
  const map = new Map<string, TreeNode>();

  for (const board of boards) {
    // Derive the last move SAN (e.g., "Nf3", "e4", etc.)
    const lastMove = board.moves.length
      ? board.moves[board.moves.length - 1].san
      : null;

    map.set(board.id, {
      id: board.id,
      parentId: board.parentId ?? null,
      label:
        board.id === "root"
          ? "Start"
          : lastMove
          ? lastMove
          : "Move",
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

/** Recursive render node */
const NodeRow: React.FC<{
  node: TreeNode;
  depth: number;
  onSelect: (id: string) => void;
}> = ({ node, depth, onSelect }) => {
  return (
    <div className="flex flex-col">
      <div
        className="flex items-center space-x-2"
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <button
          className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
            node.isActive
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          onClick={() => onSelect(node.id)}
        >
          {node.label}
        </button>
      </div>

      {/* Render children */}
      {node.children.length > 0 && (
        <div className="mt-1">
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
    </div>
  );
};

const TimelineTree: React.FC<TimelineTreeProps> = ({
  boards,
  activeBoardId,
  onSelectBoard,
}) => {
  const roots = buildTree(boards, activeBoardId);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-auto max-h-[26rem]">
      <h3 className="text-lg font-semibold mb-3 text-purple-400">
        Timeline Tree
      </h3>

      {roots.length === 0 ? (
        <p className="text-gray-500 text-sm">No moves yet</p>
      ) : (
        <div className="space-y-2">
          {roots.map((root) => (
            <NodeRow
              key={root.id}
              node={root}
              depth={0}
              onSelect={onSelectBoard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineTree;
