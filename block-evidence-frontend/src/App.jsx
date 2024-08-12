import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import LoginPage from './components/LoginPage';
import CollectorPage from './pages/CollectorPage';
import CSAPage from './pages/CSAPage';
import GuestPage from './pages/GuestPage';
import CompanyPage from './pages/CompanyPage';
import TransferDataPage from './pages/TransferDataPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState('');
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', setAccount);
      }
    };
  }, []);

  const handleLogin = (id, password, mode) => {
    if (id === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      setLoginMode(mode);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMode('');
    setAccount(null);
  };

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
  };

  return (
    <div>
      {isLoggedIn && (
        <HeaderBar 
          onLogout={handleLogout} 
          isLoggedIn={isLoggedIn} 
          onAccountChange={handleAccountChange}
          account={account}
        />
      )}
      <Routes>
        <Route 
          path="/" 
          element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to={`/${loginMode.toLowerCase()}`} />} 
        />
        <Route 
          path="/collector" 
          element={isLoggedIn && loginMode === 'Collector' ? <CollectorPage account={account} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/csa" 
          element={isLoggedIn && loginMode === 'CSA' ? <CSAPage account={account} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/guest" 
          element={isLoggedIn && loginMode === 'Guest' ? <GuestPage account={account} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/company" 
          element={isLoggedIn && loginMode === 'Company' ? <CompanyPage account={account} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/transfer" 
          element={isLoggedIn ? <TransferDataPage account={account} /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;