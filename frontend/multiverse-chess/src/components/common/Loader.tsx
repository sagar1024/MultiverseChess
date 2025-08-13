import React from "react";

interface LoaderProps {
    size?: number; // size in pixels
}

const Loader: React.FC<LoaderProps> = ({ size = 40 }) => {
    return (
        <div
            className="border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"
            style={{ width: size, height: size }}
        />
    );
};

export default Loader;
