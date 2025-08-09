import React from "react";

export default function BoardCard() {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="text-sm text-gray-500">Board ID: root</div>
      <div className="h-64 bg-gray-100 mt-3 flex items-center justify-center">
        {/* Later: react-chessboard goes here */}
        <span className="text-gray-400">Chessboard placeholder</span>
      </div>
    </div>
  );
}
