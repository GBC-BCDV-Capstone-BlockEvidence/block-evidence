import React, { useState, useEffect } from 'react';
import { Button, Typography, Snackbar } from '@mui/material';
import { Box } from '@mui/system';

const HeaderBar = ({ onLogout, isLoggedIn, onAccountChange }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            onAccountChange(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        const newAccount = accounts[0] || null;
        setAccount(newAccount);
        onAccountChange(newAccount);
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', setAccount);
      }
    };
  }, [onAccountChange]);

  useEffect(() => {
    console.log('Current account:', account);
  }, [account]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(account);
        onAccountChange(account);
      } catch (error) {
        console.error('Error connecting MetaMask:', error);
        setError('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  const disconnectMetaMask = () => {
    setAccount(null);
    onAccountChange(null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px',
      backgroundColor: '#2D3748',
      borderRadius: '12px',
      boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <Typography variant="h4" sx={{ 
        color: '#E2E8F0',
        fontWeight: '600',
        fontFamily: 'Roboto, sans-serif',
      }}>
        Block Evidence
      </Typography>
      {isLoggedIn && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!account ? (
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ 
                borderRadius: '8px', 
                backgroundColor: '#3182CE',
                padding: '10px 24px',
                '&:hover': { 
                  backgroundColor: '#2B6CB0',
                },
                transition: 'background-color 0.3s ease',
              }}
              onClick={connectMetaMask}
            >
              Connect MetaMask
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ color: '#E2E8F0' }}>
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ 
                  borderRadius: '8px', 
                  backgroundColor: '#E53E3E',
                  padding: '10px 24px',
                  '&:hover': { 
                    backgroundColor: '#C53030',
                  },
                  transition: 'background-color 0.3s ease',
                }}
                onClick={disconnectMetaMask}
              >
                Disconnect
              </Button>
            </Box>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ 
              borderRadius: '8px', 
              backgroundColor: '#3182CE', 
              padding: '10px 24px',
              '&:hover': { 
                backgroundColor: '#2B6CB0', 
              },
              marginLeft: 'auto',
              transition: 'background-color 0.3s ease',
            }}
            onClick={onLogout}
          >
            BACK TO LOGIN
          </Button>
        </Box>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  );
};

export default HeaderBar;