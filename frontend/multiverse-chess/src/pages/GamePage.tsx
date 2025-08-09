import React from "react";
import BoardCard from "../components/BoardCard";

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Multiverse Chess — Prototype</h1>
      <div className="grid grid-cols-2 gap-4">
        <BoardCard />
        <BoardCard />
      </div>
    </div>
  );
}
