import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ChainOfCustody from './components/ChainOfCustody';
import Footer from './components/Footer';
import LoginDialog from './components/LoginDialog';

function App() {
  const [showDialog, setShowDialog] = useState(false);

  const handleLoginClick = () => {
    setShowDialog(true);
  };

  return (
    <div>
      <Header onLoginClick={handleLoginClick} />
      <HeroSection />
      <FeaturesSection />
      <ChainOfCustody />
      <Footer />
      <LoginDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}

export default App;
