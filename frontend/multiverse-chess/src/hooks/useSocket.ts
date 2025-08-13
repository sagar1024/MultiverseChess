import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
    url: string;
    autoConnect?: boolean;
}

export function useSocket({ url, autoConnect = true }: UseSocketOptions) {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (autoConnect) connect();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const connect = () => {
        if (socketRef.current) return;
        const socket = io(url);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            console.log("Connected to socket server");
        });

        socket.on("disconnect", () => {
            setConnected(false);
            console.log("Disconnected from socket server");
        });
    };

    const emit = (event: string, data?: any) => {
        socketRef.current?.emit(event, data);
    };

    const on = (event: string, handler: (...args: any[]) => void) => {
        socketRef.current?.on(event, handler);
    };

    return { socket: socketRef.current, connected, connect, emit, on };
}
