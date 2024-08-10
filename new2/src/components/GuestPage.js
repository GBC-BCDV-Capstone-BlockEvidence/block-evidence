import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Container } from '@mui/material';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const GuestPage = () => {
  const [account, setAccount] = useState(null);
  const [evidenceId, setEvidenceId] = useState('');

  useEffect(() => {
    const connectMetaMask = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        try {
          await provider.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('MetaMask connection failed:', error);
          alert('Failed to connect to MetaMask. Please try again.');
        }
      } else {
        alert('MetaMask not found. Please install MetaMask to use this feature.');
      }
    };

    connectMetaMask();
  }, []);

  const handleGetEvidence = () => {
    alert(`Fetching evidence for ID: ${evidenceId}`);
    // Add logic to fetch evidence based on ID
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Guest Mode
      </Typography>
      <Typography variant="body1" gutterBottom>
        Connected MetaMask Account: {account ? ` ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
      </Typography>
      <TextField
        label="Evidence ID"
        fullWidth
        margin="normal"
        value={evidenceId}
        onChange={(e) => setEvidenceId(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleGetEvidence}
        style={{ marginTop: '20px' }}
      >
        Get Evidence
      </Button>
    </Container>
  );
};

export default GuestPage;
