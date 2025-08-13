import React, { useEffect, useState } from "react";

interface TimerProps {
    timeRemaining: number; // in seconds
    isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, isActive }) => {
    const [time, setTime] = useState(timeRemaining);

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <span
            className={`font-mono text-sm ${time <= 10 ? "text-red-400" : "text-white"
                }`}
        >
            {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
    );
};

export default Timer;
