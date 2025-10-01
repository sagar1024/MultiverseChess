import React from "react";
import { useNavigate } from "react-router-dom";
import IntroSection from "../components/landing/IntroSection";
import RulesSection from "../components/landing/RulesSection";
import CTAButtons from "../components/landing/CTAButtons";
import PageWrapper from "../components/layout/PageWrapper";

import { createGame } from "../utils/storage";
import { v4 as uuidv4 } from "uuid";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateGame = () => {
        const newId = uuidv4();
        createGame(newId, "Host");
        navigate(`/game/${newId}`);
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
