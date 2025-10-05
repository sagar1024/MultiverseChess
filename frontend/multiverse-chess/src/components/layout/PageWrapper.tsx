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
