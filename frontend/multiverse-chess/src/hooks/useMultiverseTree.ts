import { useState } from "react";

export interface TimelineNode {
    id: string;
    parentId: string | null;
    move?: string;
    children: string[];
}

export function useMultiverseTree() {
    const [nodes, setNodes] = useState<Record<string, TimelineNode>>({
        root: { id: "root", parentId: null, children: [] }
    });

    const addNode = (parentId: string, move?: string) => {
        const newId = `${parentId}-${nodes[parentId].children.length + 1}`;
        setNodes((prev) => ({
            ...prev,
            [newId]: { id: newId, parentId, move, children: [] },
            [parentId]: {
                ...prev[parentId],
                children: [...prev[parentId].children, newId]
            }
        }));
        return newId;
    };

    const getTree = () => nodes;

    return { nodes, addNode, getTree };
}
