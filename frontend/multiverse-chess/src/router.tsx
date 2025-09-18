import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import JoinGame from "./pages/JoinGame";
import GameRoom from "./pages/GameRoom";
import GameOver from "./pages/GameOver";
import NotFoundPage from "./pages/NotFound";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/game/:gameId" element={<GameRoom />} />
      <Route path="/game/:gameId/over" element={<GameOver />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
