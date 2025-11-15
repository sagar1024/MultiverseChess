export interface StoredGame {
    id: string;
    boards: any[];
    players: { host: string; guest?: string };
    createdAt: number;
}

const STORAGE_KEY = "multiverse_chess_games";
function loadAll(): Record<string, StoredGame> {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveAll(games: Record<string, StoredGame>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function createGame(gameId: string, hostName = "Host"): StoredGame {
    const games = loadAll();
    const newGame: StoredGame = {
        id: gameId,
        boards: [],
        players: { host: hostName },
        createdAt: Date.now(),
    };
    games[gameId] = newGame;
    saveAll(games);
    return newGame;
}

export function getGame(gameId: string): StoredGame | null {
    const games = loadAll();
    return games[gameId] || null;
}

export function joinGame(gameId: string, guestName = "Guest"): StoredGame | null {
    const games = loadAll();
    const game = games[gameId];
    if (!game) return null;
    if (!game.players.guest) {
        game.players.guest = guestName;
        saveAll(games);
    }
    return game;
}
