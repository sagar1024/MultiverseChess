// import React from "react";
// import IntroSection from "../components/landing/IntroSection";
// import RulesSection from "../components/landing/RulesSection";
// import CTAButtons from "../components/landing/CTAButtons";
// import PageWrapper from "../components/layout/PageWrapper";

// const LandingPage: React.FC = () => {
//     const handleCreateGame = () => {
//         // TODO: Navigate to game creation or API call
//         console.log("Create Game clicked");
//     };

//     const handleJoinGame = () => {
//         // TODO: Show modal or input for game link
//         console.log("Join Game clicked");
//     };

//     return (
//         <PageWrapper>
//             <IntroSection />
//             <RulesSection />
//             <CTAButtons onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
//         </PageWrapper>
//     );
// };

// export default LandingPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import IntroSection from "../components/landing/IntroSection";
import RulesSection from "../components/landing/RulesSection";
import CTAButtons from "../components/landing/CTAButtons";
import PageWrapper from "../components/layout/PageWrapper";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        const gameId = uuidv4().slice(0, 8); //Generate short unique ID
        navigate(`/game/${gameId}`);
    };

    const handleJoinGame = () => {
        //Go to a "Join Game" page where user can paste a link or code
        navigate("/join");
    };

    return (
        <PageWrapper>
            <IntroSection />
            <RulesSection />
            <CTAButtons onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
        </PageWrapper>
    );
};

export default LandingPage;
