import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TransferPage = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleTransfer = () => {
    if (!address) {
      setError('Please enter a wallet address.');
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmTransfer = () => {
    setOpenConfirmDialog(false);
    setLoading(true);

    // Mock transfer logic
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Evidence transferred to ${address} successfully!`);
      setError('');
      setAddress('');
    }, 1000);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Transfer Evidence
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
          <Typography variant="body1" gutterBottom>
            Enter the wallet address to which you want to transfer the evidence.
          </Typography>

          <TextField
            label="Wallet Address"
            value={address}
            onChange={handleAddressChange}
            fullWidth
            placeholder="Enter wallet address"
            variant="outlined"
          />
          
          <Button 
            variant="contained" 
            onClick={handleTransfer}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Transfer Evidence
          </Button>

          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogContent>
            Are you sure you want to transfer evidence to the wallet address {address}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmTransfer} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="outlined"
          onClick={handleGoBack}
          sx={{ mt: 4, borderRadius: '8px', padding: '12px 24px' }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default TransferPage;