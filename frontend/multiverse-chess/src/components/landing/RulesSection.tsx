import React from "react";

const RulesSection: React.FC = () => {
    const rules = [
        "Each turn, you can make up to 3 legal moves, each creating a new timeline.",
        "Timelines branch into separate boards — win more boards to win the match.",
        "If your time runs out, you only lose the boards still in progress.",
        "Boards that have ended remain unaffected by time losses.",
        "The winner is the player with the most board victories at the end."
    ];

    return (
        <section className="bg-gray-900 py-12 px-6">
            <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">How to Play</h2>
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <ul className="list-disc list-inside space-y-3 text-gray-200">
                    {rules.map((rule, index) => (
                        <li key={index} className="text-lg">
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default RulesSection;
