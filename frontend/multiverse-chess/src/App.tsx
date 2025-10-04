import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageWrapper from "./components/layout/PageWrapper";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#1e1e2f] text-white">
        {/* Global Navbar (always present, no need for page headers) */}
        <Navbar />

        {/* All pages wrapped with PageWrapper to keep consistency + animations */}
        <main className="flex-1">
          <PageWrapper>
            <AppRouter />
          </PageWrapper>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
