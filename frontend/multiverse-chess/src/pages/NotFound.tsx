import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/common/Button";

const NotFound: React.FC = () => {
    return (
        <PageWrapper>
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-950 text-white text-center">
                <h1 className="text-5xl font-bold text-purple-500 mb-4">404</h1>
                <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
                <Button variant="primary" onClick={() => (window.location.href = "/")}>
                    Return Home
                </Button>
            </div>
        </PageWrapper>
    );
};

export default NotFound;
