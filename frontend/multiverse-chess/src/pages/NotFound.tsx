import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
            <p className="mb-6">The Game ID you entered does not exist.</p>
            <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
                Back to Home
            </button>
        </div>
    );
};

export default NotFound;
