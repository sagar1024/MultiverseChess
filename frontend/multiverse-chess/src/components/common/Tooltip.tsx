import React, { useState } from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute bottom-full mb-2 px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
