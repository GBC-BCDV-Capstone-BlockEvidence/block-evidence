import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Divider, Typography } from '@mui/material';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const LoginDialog = ({ open, onClose }) => {
  const [loginMode, setLoginMode] = useState(null);
  const [account, setAccount] = useState(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleModeSelect = (mode) => {
    setLoginMode(mode);
  };

  const connectMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        await provider.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setError(''); // Clear any previous errors
      } else {
        alert('MetaMask not found. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  };

  const handleLogin = () => {
    if (id && password) {
      if (loginMode === 'Collector') {
        // Add your validation logic for Collector
        console.log('Logged in as Collector');
      } else if (loginMode === 'CSA') {
        // Add your validation logic for CSA
        console.log('Logged in as CSA');
      } else if (loginMode === 'Guest') {
        // Add your validation logic for Guest
        console.log('Logged in as Guest');
      } else {
        setError('Please select a login mode.');
      }
    } else {
      setError('ID and Password cannot be empty.');
    }
  };

  const handleClose = () => {
    setLoginMode(null);
    setAccount(null);
    setId('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Login Mode</DialogTitle>
      <DialogContent>
        {!loginMode ? (
          <>
            <Button fullWidth variant="contained" color="primary" onClick={() => handleModeSelect('Collector')}>
              Collector
            </Button>
            <Divider style={{ margin: '10px 0' }} />
            <Button fullWidth variant="contained" color="secondary" onClick={() => handleModeSelect('CSA')}>
              CSA
            </Button>
            <Divider style={{ margin: '10px 0' }} />
            <Button fullWidth variant="contained" color="warning" onClick={() => handleModeSelect('Guest')}>
              Guest
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {loginMode} Login
            </Typography>
            <TextField 
              label="ID" 
              fullWidth 
              margin="normal" 
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextField 
              label="Password" 
              type="password" 
              fullWidth 
              margin="normal" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button 
              fullWidth 
              variant="contained" 
              color="warning" 
              style={{ marginTop: '20px' }} 
              onClick={connectMetaMask}
            >
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect MetaMask'}
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              style={{ marginTop: '20px' }} 
              onClick={handleLogin}
            >
              Log In
            </Button>
          </>
        )}
      </DialogContent>
      <Button onClick={handleClose} color="primary" style={{ margin: '10px' }}>
        Close
      </Button>
    </Dialog>
  );
};

export default LoginDialog;
