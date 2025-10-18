// import React from "react";

// interface PageWrapperProps {
//     children: React.ReactNode;
//     className?: string;
// }

// const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
//     return (
//         <div className={`flex-1 flex flex-col ${className}`}>
//             <main className="flex-1 p-6 max-w-6xl w-full mx-auto">{children}</main>
//         </div>
//     );
// };

// export default PageWrapper;

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
