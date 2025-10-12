import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-4 text-center mt-auto">
            <p className="text-sm">
                © {new Date().getFullYear()} Multiverse Chess — Developed by Sagar Gurung
            </p>
        </footer>
    );
};

export default Footer;
