import React, { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Alert } from '@mui/material';

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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loginMode ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => handleLoginClick('Collector')} 
              sx={{ borderRadius: '8px' }}
            >
              Collector
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleLoginClick('CSA')} 
              sx={{ borderRadius: '8px' }}
            >
              CSA
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleLoginClick('Guest')} 
              sx={{ borderRadius: '8px' }}
            >
              Guest
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleLoginClick('Company')} 
              sx={{ borderRadius: '8px' }}
            >
              Company
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleBackToChoosing} 
              sx={{ marginBottom: 2, borderRadius: '8px' }}
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
              sx={{ borderRadius: '8px' }}
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