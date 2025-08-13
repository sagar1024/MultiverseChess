import React from "react";
import IntroSection from "../components/landing/IntroSection";
import RulesSection from "../components/landing/RulesSection";
import CTAButtons from "../components/landing/CTAButtons";
import PageWrapper from "../components/layout/PageWrapper";

const LandingPage: React.FC = () => {
    const handleCreateGame = () => {
        // TODO: Navigate to game creation or API call
        console.log("Create Game clicked");
    };

    const handleJoinGame = () => {
        // TODO: Show modal or input for game link
        console.log("Join Game clicked");
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
