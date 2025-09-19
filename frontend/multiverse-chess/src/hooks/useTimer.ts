// import { useEffect, useRef, useState } from "react";

// interface UseTimerOptions {
//     initialTime: number; // seconds
//     isRunning?: boolean;
//     onTimeOver?: () => void;
// }

// export function useTimer({ initialTime, isRunning = false, onTimeOver }: UseTimerOptions) {
//     const [time, setTime] = useState(initialTime);
//     const intervalRef = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//         if (isRunning && time > 0) {
//             intervalRef.current = setInterval(() => {
//                 setTime((prev) => {
//                     if (prev <= 1) {
//                         clearInterval(intervalRef.current!);
//                         onTimeOver?.();
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//         }

//         return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//         };
//     }, [isRunning]);

//     const reset = (newTime?: number) => {
//         setTime(newTime ?? initialTime);
//     };

//     return { time, reset };
// }

import { useEffect, useRef, useState } from "react";

interface UseTimerOptions {
    initialTime: number; // seconds
    isRunning?: boolean;
    onTimeOver?: () => void;
}

export function useTimer({ initialTime, isRunning = false, onTimeOver }: UseTimerOptions) {
    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        onTimeOver?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const reset = (newTime?: number) => {
        setTime(newTime ?? initialTime);
    };

    return { time, reset };
}
