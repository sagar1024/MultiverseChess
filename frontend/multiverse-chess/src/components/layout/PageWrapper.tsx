// import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// interface PageWrapperProps {
//     children: React.ReactNode;
//     onCreateGame?: () => void;
//     onJoinGame?: () => void;
// }

// const PageWrapper: React.FC<PageWrapperProps> = ({
//     children,
//     onCreateGame,
//     onJoinGame
// }) => {
//     return (
//         <div className="flex flex-col min-h-screen bg-gray-950 text-white">
//             {/* Navbar */}
//             <Navbar onCreateGame={onCreateGame} onJoinGame={onJoinGame} />

//             {/* Page Content */}
//             <main className="flex-1 p-6">{children}</main>

//             {/* Footer */}
//             <Footer />
//         </div>
//     );
// };

// export default PageWrapper;

import React from "react";

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
    return (
        <div className={`flex-1 flex flex-col ${className}`}>
            <main className="flex-1 p-6 max-w-6xl w-full mx-auto">{children}</main>
        </div>
    );
};

export default PageWrapper;
