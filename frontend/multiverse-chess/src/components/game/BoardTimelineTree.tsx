import React from "react";

export interface BoardNode {
    id: string;
    label: string;
    children?: BoardNode[];
    isActive?: boolean;
}

interface BoardTimelineTreeProps {
    boards: BoardNode[];
    onSelectBoard: (id: string) => void;
}

const BoardTimelineTree: React.FC<BoardTimelineTreeProps> = ({ boards, onSelectBoard }) => {
    const renderNode = (node: BoardNode) => (
        <div key={node.id} className="ml-4">
            <button
                onClick={() => onSelectBoard(node.id)}
                className={`px-2 py-1 text-sm rounded ${node.isActive ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
            >
                {node.label}
            </button>
            {node.children && (
                <div className="ml-4 border-l border-gray-600 pl-2 mt-1">
                    {node.children.map(renderNode)}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg overflow-auto max-h-96">
            <h3 className="text-lg font-bold mb-2">Board Timeline</h3>
            {boards.length > 0 ? boards.map(renderNode) : <p className="text-gray-500">No boards yet</p>}
        </div>
    );
};

export default BoardTimelineTree;
