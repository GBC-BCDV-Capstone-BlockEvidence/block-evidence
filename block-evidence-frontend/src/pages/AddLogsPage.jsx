import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const AddLogsPage = ({ account }) => { // Add account as a prop
  const [id, setId] = useState('');
  const [log, setLog] = useState(''); // Changed from 'address' to 'log'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddLogs = async () => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }

    if (!id || !log) {
      setError('Please fill in both ID and Log.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/addLog', {
        id,
        log,
        userAddress: account // Include the user's address
      });

      if (response.data.success) {
        setSuccess(`Log added successfully! Transaction Hash: ${response.data.transactionHash}`);
        setId('');
        setLog('');
      } else {
        setError('Failed to add log. Please try again.');
      }
    } catch (error) {
      console.error('Error adding log:', error);
      setError(error.response?.data?.error || 'An error occurred while adding the log.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/csa');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Add Logs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500, mx: 'auto' }}>
          <TextField
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            placeholder="Enter ID here"
          />

          <TextField
            label="Log"
            value={log}
            onChange={(e) => setLog(e.target.value)}
            fullWidth
            placeholder="Enter log here"
            multiline
            rows={4}
          />

          <Button 
            variant="contained" 
            onClick={handleAddLogs}
            sx={{ borderRadius: '8px', padding: '12px 24px' }}
            disabled={isLoading || !account}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Add Log'}
          </Button>

          <Button 
            variant="outlined" 
            onClick={handleBack}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Back to CSA Page
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddLogsPage;