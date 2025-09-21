import { useEffect, useRef, useState } from "react";

interface UseTimerOptions {
    initialTime: number; //Seconds
    isRunning?: boolean;
    onTimeOver?: () => void;
}

export function useTimer({ initialTime, isRunning = false, onTimeOver }: UseTimerOptions) {
    const [time, setTime] = useState<number>(initialTime);
    const intervalRef = useRef<number | null>(null);

    //Keep internal time in sync if initialTime changes (e.g., rematch)
    useEffect(() => {
        setTime(initialTime);
    }, [initialTime]);

    //Start/stop interval based on isRunning
    useEffect(() => {
        //Clear any previous interval
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        //Stop timer and notify
                        if (intervalRef.current !== null) {
                            window.clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        onTimeOver?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, onTimeOver]);

    const reset = (newTime?: number) => {
        setTime(newTime ?? initialTime);
    };

    return { time, reset };
}
