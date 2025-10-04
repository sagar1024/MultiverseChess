// import React from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import Navbar from "./components/layout/Navbar";
// import Footer from "./components/layout/Footer";
// import PageWrapper from "./components/layout/PageWrapper";
// import AppRouter from "./router";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen bg-[#1e1e2f] text-white">
//         <Navbar />

//         {/* Keep consistent layout & animations for all routes */}
//         <main className="flex-1">
//           <PageWrapper>
//             <AppRouter />
//           </PageWrapper>
//         </main>

//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageWrapper from "./components/layout/PageWrapper";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#1e1e2f] text-white">
        {/* Global Navbar */}
        <Navbar />

        {/* Page content wrapper */}
        <PageWrapper>
          <AppRouter />
        </PageWrapper>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
