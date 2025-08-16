# Multiverse Chess

## Overview

Multiverse Chess is a chess variant where players can explore multiple legal moves in parallel, creating alternate realities ("boards"). Instead of one linear game, every turn can branch into multiple timelines. The game ends when all boards conclude or a player runs out of time, and the winner is determined by the total wins across all universes. This project is built as a full-stack application with real-time multiplayer support and a modern UI.

## Game Rules

Each turn, a player may make up to 3 legal moves.
Every move creates a new branch (board) in the timeline.
Multiple boards are active simultaneously.
The game ends when:
All boards reach a conclusion (win/loss/draw), or
A player’s timer runs out (they lose only on ongoing boards).
The final winner is the player with the most wins across all universes.

## Features

Multiverse mechanics with branching timelines.
Player timers with fair handling of timeouts.
Interactive UI with drag-and-drop chess pieces.
Multiplayer support via shareable game links.
Game over screen with detailed results and scores.
Dark theme with purple accents.

## Tech Stack

### Frontend

React + TypeScript
Tailwind CSS (UI styling)
Zustand / Context API (state management)
framer-motion (animations)
chess.js + react-chessboard (game logic & rendering)

### Backend (optional for persistence & multiplayer)

Node.js + Express
Socket.io (real-time communication)
MongoDB + Prisma/Mongoose (data storage)
JWT + bcrypt (authentication)
Redis (optional for caching and sessions)

# Inspiration

Chess has always been about strategy and foresight. With Multiverse Chess, every move explores what could have been—making chess not just a game of skill, but of infinite imagination.
