import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Guidance } from './pages/Guidance';
import { Verses } from './pages/Verses';
import { About } from './pages/About';
import { Sources } from './pages/Sources';
import { Privacy } from './pages/Privacy';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242A26]">
        {/* Accessible Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#133E2B] text-[#FAF8F5] rounded-lg shadow-md font-semibold text-sm"
        >
          Skip to main content
        </a>

        {/* Header Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guidance" element={<Guidance />} />
            <Route path="/verses" element={<Verses />} />
            <Route path="/about" element={<About />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* Catch-all redirects to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
