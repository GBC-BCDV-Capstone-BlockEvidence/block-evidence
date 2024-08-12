import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';

const CompanyPage = () => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGetEvidence = () => {
    if (!id) {
      setError('Please enter an ID.');
      return;
    }

    // Mock get evidence logic
    setTimeout(() => {
      setSuccess(`Evidence with ID ${id} retrieved successfully!`);
      setError('');
    }, 1000);
  };

  const handleTransferClick = () => {
    navigate('/transfer'); // Navigate to TransferDataPage
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Company!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ErrorIcon sx={{ mr: 1 }} />
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500, mx: 'auto' }}>
          <TextField
            label="Evidence ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            placeholder="Enter evidence ID here"
          />

          <Button 
            variant="contained" 
            onClick={handleGetEvidence}
            sx={{ borderRadius: '8px', padding: '12px 24px' }}
          >
            Get Evidence
          </Button>

          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleTransferClick}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Transfer Evidence
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CompanyPage;