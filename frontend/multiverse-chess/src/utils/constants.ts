//Game configuration
export const DEFAULT_TIME_PER_PLAYER = 300; // 5 min
export const DEFAULT_MAX_MOVES_PER_TURN = 3;

//Theme colors
export const THEME_COLORS = {
    dark: {
        background: "#1e1e2f",
        accent: "#9b5de5",
        text: "#ffffff"
    },
    light: {
        background: "#f5f5f5",
        accent: "#6a4c93",
        text: "#000000"
    }
};

//Socket event names
export const SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    JOIN_GAME: "joinGame",
    GAME_STATE: "gameState",
    MOVE_MADE: "moveMade",
    TIMER_UPDATE: "timerUpdate",
    GAME_OVER: "gameOver"
};
