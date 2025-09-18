// import React from "react";
// import Button from "../common/Button";

// interface NavbarProps {
//     onCreateGame?: () => void;
//     onJoinGame?: () => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ onCreateGame, onJoinGame }) => {
//     return (
//         <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
//             {/* Logo / Title */}
//             <div className="text-xl font-bold tracking-wide">
//                 ♟ Multiverse Chess
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//                 {onCreateGame && (
//                     <Button size="sm" onClick={onCreateGame}>
//                         Create Game
//                     </Button>
//                 )}
//                 {onJoinGame && (
//                     <Button
//                         size="sm"
//                         variant="secondary"
//                         onClick={onJoinGame}
//                     >
//                         Join Game
//                     </Button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../common/Button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateGame = () => {
    const gameId = uuidv4().slice(0, 8); //Short ID
    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = () => {
    navigate("/join");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Logo / Title */}
      <div className="text-xl font-bold tracking-wide">
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
