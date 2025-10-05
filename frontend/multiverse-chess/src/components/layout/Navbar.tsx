// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import Button from "../common/Button";

// const Navbar: React.FC = () => {
//     const navigate = useNavigate();

//     const handleCreateGame = () => {
//         const gameId = uuidv4().slice(0, 8); //Short ID
//         navigate(`/game/${gameId}`);
//     };

//     const handleJoinGame = () => {
//         navigate("/join");
//     };

//     return (
//         <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
//             {/* Logo / Title */}
//             <div className="text-xl font-bold tracking-wide">
//                 ♟ Multiverse Chess
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//                 <Button size="sm" onClick={handleCreateGame}>
//                     Create Game
//                 </Button>
//                 <Button size="sm" variant="secondary" onClick={handleJoinGame}>
//                     Join Game
//                 </Button>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../common/Button";
import { createGame } from "../../utils/storage";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        const gameId = uuidv4().slice(0, 8); //Short ID

        //Create and persist game in localStorage
        createGame(gameId, "Host");

        navigate(`/game/${gameId}`);
    };

    const handleJoinGame = () => {
        navigate("/join");
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            {/* Logo / Title */}
            <div
                className="text-xl font-bold tracking-wide cursor-pointer hover:text-purple-400 transition"
                onClick={() => navigate("/")}
            >
                ♟ Multiverse Chess
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button size="sm" onClick={handleCreateGame}>
                    Create Game
                </Button>
                <Button size="sm" variant="secondary" onClick={handleJoinGame}>
                    Join Game
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
