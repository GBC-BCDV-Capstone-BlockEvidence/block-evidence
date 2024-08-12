import React, { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Alert } from '@mui/material';
import logo from '../assets/logo.png'; // Adjust the path based on your file structure

const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = (mode) => {
    setLoginMode(mode);
    setError(''); // Clear error when selecting a mode
  };

  const handleSubmit = () => {
    if (id === '' || password === '') {
      setError('Please enter both ID and password.');
      return;
    }
    if (!onLogin(id, password, loginMode)) {
      setError('Invalid credentials');
    }
  };

  const handleBackToChoosing = () => {
    setLoginMode('');
    setId('');
    setPassword('');
    setError('');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: '12px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Block Evidence Logo */}
        <Box sx={{ mb: 4 }}>
          <img src={logo} alt="Block Evidence" width="120" />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Block Evidence Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loginMode ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleLoginClick('Collector')}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              Login as Collector
            </Button>
            <Button
              variant="contained"
              onClick={() => handleLoginClick('CSA')}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              Login as CSA
            </Button>
            <Button
              variant="contained"
              onClick={() => handleLoginClick('Guest')}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              Login as Guest
            </Button>
            <Button
              variant="contained"
              onClick={() => handleLoginClick('Company')}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              Login as Company
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackToChoosing}
              sx={{ mb: 2, borderRadius: '8px', fontSize: '1rem', textTransform: 'none' }}
            >
              Back to Choosing
            </Button>
            <TextField
              label="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
              }}
            >
              Login as {loginMode}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;