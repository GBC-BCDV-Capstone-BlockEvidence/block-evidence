// HeaderBar.jsx
import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ethers } from 'ethers';

const HeaderBar = ({ onLogout, isLoggedIn }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(account);
      } catch (error) {
        console.error('Error connecting MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  const disconnectMetaMask = () => {
    setAccount(null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px',
      backgroundColor: '#2D3748', // Darker background for better contrast
      borderRadius: '12px', // Slightly more rounded corners
      boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.2)', // Softer shadow
      width: '100%', // Full width for better alignment
      maxWidth: '1200px', // Max width for larger screens
      margin: '0 auto', // Center the header
    }}>
      <Typography variant="h4" sx={{ 
        color: '#E2E8F0', // Lighter color for better readability
        fontWeight: '600', // Slightly lighter font weight
        fontFamily: 'Roboto, sans-serif',
      }}>
        My Application
      </Typography>
      {isLoggedIn && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ 
              borderRadius: '8px', 
              backgroundColor: '#3182CE', // Primary color
              padding: '10px 24px', // Increased padding for better touch targets
              '&:hover': { 
                backgroundColor: '#2B6CB0', // Darker shade for hover effect
              },
              transition: 'background-color 0.3s ease', // Smooth transition
            }}
            onClick={connectMetaMask} // Connect MetaMask
          >
            Connect MetaMask
          </Button>
          {account && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ color: '#E2E8F0' }}>
                {`${account.slice(0, 6)}...${account.slice(-4)}`} // Shorten address for display
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ 
                  borderRadius: '8px', 
                  backgroundColor: '#E53E3E', // Secondary color for disconnect
                  padding: '10px 24px',
                  '&:hover': { 
                    backgroundColor: '#C53030',
                  },
                  transition: 'background-color 0.3s ease',
                }}
                onClick={disconnectMetaMask} // Disconnect MetaMask
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
            onClick={onLogout} // Logout functionality
          >
            BACK TO LOGIN
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HeaderBar;