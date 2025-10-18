import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#1e1e2f] text-white">
        {/* Global Header */}
        <Navbar />

        {/* Main Route Area */}
        <main className="flex-1 w-full px-6 py-8">
          <AppRouter />
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
