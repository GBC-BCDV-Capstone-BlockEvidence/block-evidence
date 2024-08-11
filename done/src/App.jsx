import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import LoginPage from './components/LoginPage';
import CollectorPage from './pages/CollectorPage';
import CSAPage from './pages/CSAPage';
import GuestPage from './pages/GuestPage';
import CompanyPage from './pages/CompanyPage';
import TransferDataPage from './pages/TransferDataPage'; // Import the new page

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState('');

  const handleLogin = (id, password, mode) => {
    if (id === 'George Petrovic' && password === '1234') {
      setIsLoggedIn(true);
      setLoginMode(mode);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMode('');
  };

  return (
    <div>
      {isLoggedIn && <HeaderBar onLogout={handleLogout} isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route path="/" element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to={`/${loginMode.toLowerCase()}`} />} />
        <Route path="/collector" element={isLoggedIn && loginMode === 'Collector' ? <CollectorPage /> : <Navigate to="/" />} />
        <Route path="/csa" element={isLoggedIn && loginMode === 'CSA' ? <CSAPage /> : <Navigate to="/" />} />
        <Route path="/guest" element={isLoggedIn && loginMode === 'Guest' ? <GuestPage /> : <Navigate to="/" />} />
        <Route path="/company" element={isLoggedIn && loginMode === 'Company' ? <CompanyPage /> : <Navigate to="/" />} />
        <Route path="/transfer" element={isLoggedIn ? <TransferDataPage /> : <Navigate to="/" />} /> {/* Add TransferDataPage route */}
      </Routes>
    </div>
  );
}

export default App;