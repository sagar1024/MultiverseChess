import React from "react";

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
    return (
        <section className={`w-full max-w-[1400px] mx-auto px-6 py-12 ${className}`}>
            {children}
        </section>
    );
};

export default PageWrapper;
