import React, { useState } from 'react';
import { Typography, TextField, Button, Container, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const fixedID = 'George Petrovic';
const fixedPassword = '1234';

const LoginModePage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      try {
        await provider.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('MetaMask connection failed:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask not found. Please install MetaMask to use this feature.');
    }
  };

  const handleLogin = () => {
    if (!account) {
      setError('Please connect to MetaMask before logging in.');
      return;
    }

    if (id === fixedID && password === fixedPassword) {
      alert(`Logged in as ${mode}`);
      navigate(`/${mode.toLowerCase()}`, { state: { account } }); // Pass account address
    } else {
      setError('Invalid ID or password.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {mode} Login
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
      {error && <Alert severity="error" style={{ marginTop: '10px' }}>{error}</Alert>}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleLogin}
        style={{ marginTop: '20px' }}
      >
        Log In
      </Button>
      <Button
        fullWidth
        variant="contained"
        sx={{ bgcolor: 'warning.main', marginTop: '20px' }}
        onClick={connectMetaMask}
      >
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect MetaMask'}
      </Button>
    </Container>
  );
};

export default LoginModePage;
