import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LoginDialog from './components/LoginDialog';
import LoginModePage from './components/LoginModePage';
import GuestPage from './components/GuestPage';  // Import GuestPage
import CSAPage from './components/CSAPage';      // Import CSAPage
import CollectorPage from './components/CollectorPage'; // Import CollectorPage

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/features" element={<FeaturesSection />} />
        <Route path="/login" element={<LoginDialog />} />
        <Route path="/login/:mode" element={<LoginModePage />} />
        <Route path="/guest" element={<GuestPage />} />        {/* Add route for GuestPage */}
        <Route path="/csa" element={<CSAPage />} />            {/* Add route for CSAPage */}
        <Route path="/collector" element={<CollectorPage />} /> {/* Add route for CollectorPage */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
