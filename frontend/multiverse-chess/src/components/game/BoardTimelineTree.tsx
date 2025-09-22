// import React from "react";

// export interface BoardNode {
//     id: string;
//     label: string;
//     children?: BoardNode[];
//     isActive?: boolean;
// }

// interface BoardTimelineTreeProps {
//     boards: BoardNode[];
//     onSelectBoard: (id: string) => void;
// }

// const BoardTimelineTree: React.FC<BoardTimelineTreeProps> = ({ boards, onSelectBoard }) => {
//     const renderNode = (node: BoardNode) => (
//         <div key={node.id} className="ml-4">
//             <button
//                 onClick={() => onSelectBoard(node.id)}
//                 className={`px-2 py-1 text-sm rounded ${node.isActive ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
//                     }`}
//             >
//                 {node.label}
//             </button>
//             {node.children && (
//                 <div className="ml-4 border-l border-gray-600 pl-2 mt-1">
//                     {node.children.map(renderNode)}
//                 </div>
//             )}
//         </div>
//     );

//     return (
//         <div className="bg-gray-900 p-3 rounded-lg shadow-lg overflow-auto max-h-96">
//             <h3 className="text-lg font-bold mb-2">Board Timeline</h3>
//             {boards.length > 0 ? boards.map(renderNode) : <p className="text-gray-500">No boards yet</p>}
//         </div>
//     );
// };

// export default BoardTimelineTree;

import React from "react";

export interface TimelineNode {
    id: string;
    label: string;
    children?: TimelineNode[];
    isActive?: boolean;
}

interface BoardTimelineTreeProps {
    nodes: TimelineNode[]; //Roots of the tree
    onSelectBoard: (id: string) => void;
}

const NodeRow: React.FC<{
    node: TimelineNode;
    depth: number;
    onSelect: (id: string) => void;
}> = ({ node, depth, onSelect }) => {
    return (
        <div className="flex">
            {/* Left column: indentation + connector */}
            <div className="flex flex-col items-center mr-2" style={{ width: depth * 12 }}>
                {/* simple vertical connector — will appear for depth > 0 */}
                {depth > 0 && <div className="w-px flex-1 bg-gray-600" style={{ height: "100%" }} />}
            </div>

            {/* Node button */}
            <div className="mb-2">
                <button
                    onClick={() => onSelect(node.id)}
                    className={`px-2 py-1 rounded text-sm text-left block ${node.isActive ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                >
                    {node.label}
                </button>

                {/* children */}
                {node.children && node.children.length > 0 && (
                    <div className="mt-2 ml-4">
                        {node.children.map((child) => (
                            <NodeRow key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BoardTimelineTree: React.FC<BoardTimelineTreeProps> = ({ nodes, onSelectBoard }) => {
    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg overflow-auto max-h-96">
            <h3 className="text-lg font-bold mb-3">Board Timeline</h3>
            {nodes.length === 0 ? (
                <p className="text-gray-500">No boards yet</p>
            ) : (
                <div className="space-y-2">
                    {nodes.map((node) => (
                        <NodeRow key={node.id} node={node} depth={0} onSelect={onSelectBoard} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoardTimelineTree;
