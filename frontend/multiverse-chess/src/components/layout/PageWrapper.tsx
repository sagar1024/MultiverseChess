import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageWrapperProps {
    children: React.ReactNode;
    onCreateGame?: () => void;
    onJoinGame?: () => void;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    onCreateGame,
    onJoinGame
}) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <Navbar onCreateGame={onCreateGame} onJoinGame={onJoinGame} />

            {/* Page Content */}
            <main className="flex-1 p-6">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PageWrapper;
