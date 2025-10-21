# Multiverse Chess

## Overview

Multiverse Chess is a chess variant where players can explore multiple legal moves in parallel, creating alternate realities. Every turn can branch into multiple timelines. The game ends when all boards conclude or a player runs out of time, and the winner is determined by the total wins across all universes.

## Game Rules

1. Each turn, a player can make up to 3 legal moves.
2. Every move creates a new branch(new board) in the timeline.
3. Multiple boards are active simultaneously.
4. The game ends when: all boards reach a conclusion(win/loss/draw).
5. If a player’s timer runs out, they lose only on ongoing boards.
6. The final winner is the player with the most wins across all universes.

## Features

1. Multiverse mechanics(branching timelines).
2. Fair handling of timeouts.
3. Interactive UI with drag-and-drop chess pieces.
4. Multiplayer support via shareable game links.
5. Game over screen with results and scores.

## Tech Stack

### Frontend

1. React + TypeScript
2. Tailwind CSS
3. Zustand / Context API
4. framer-motion
5. chess.js + react-chessboard

### Backend (For multiplayer)

1. Node.js + Express
2. Socket.io
3. MongoDB + mongoose
4. JWT + bcrypt
5. Redis (For caching)

#### Note - This project is currently under development.

