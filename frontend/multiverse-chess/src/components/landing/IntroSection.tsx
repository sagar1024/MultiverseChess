import React from "react";

const IntroSection: React.FC = () => {
    return (
        <section className="bg-gray-950 text-center py-16 px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to <span className="text-purple-500">Multiverse Chess</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                A chess variant where every move can create an alternate universe.
                Explore parallel games, master multiple boards, and claim victory across
                the multiverse!
            </p>
        </section>
    );
};

export default IntroSection;
