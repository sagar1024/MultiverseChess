# Multiverse Chess

Multiverse Chess is a single-player chess variant where every decision creates a new universe.
Instead of committing to one move, the player can explore multiple timelines at once, branching the game into parallel boards while facing a computer-controlled chess engine. This project blends strategic depth, parallel game states, and AI decision-making into a unique chess experience unlike traditional formats.

---

### Core Concept

In Multiverse Chess, a single move doesn’t just change the board — it creates a new reality.

1. The player can make up to 3 consecutive moves per turn

2. Each move may branch the game into a new universe

3. Every universe is an independent chess board

4. All universes are evaluated simultaneously to determine the final outcome

The goal is to outperform the engine across timelines, not just on a single board.

---

### Gameplay Rules

1. The player may: Make up to 3 legal moves per turn OR Stop early and pass the turn at any time

2. Each move can: Continue the current universe OR branch into a new one

3. After the player’s turn: The engine plays one move on every active board

4. Finished boards (checkmate, draw, stalemate): Remain frozen AND Do not affect ongoing timelines

The game ends when all universes are complete.

---

## Tech Stack

1. React + TypeScript
2. Tailwind CSS
3. Zustand
4. chess.js
5. react-chessboard
6. Framer Motion

### Architecture

1. Independent board states per universe
2. Centralized game state store
3. Engine moves calculated per board
4. No server required (offline-friendly)


