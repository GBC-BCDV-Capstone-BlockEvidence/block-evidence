import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';

const TransferDataPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleSubmit = () => {
    if (!walletAddress) {
      setError('Please enter a wallet address.');
      return;
    }

    if (action === '') {
      setError('Please select an action.');
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    setOpenConfirmDialog(false);

    // Mock action logic
    setTimeout(() => {
      setSuccess(`${action} access to wallet address ${walletAddress} successfully!`);
      setError('');
      setWalletAddress('');
    }, 1000);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleGoBack = () => {
    navigate('/company'); // Navigate back to the CompanyPage
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Transfer Data
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
            label="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            fullWidth
            placeholder="Enter wallet address here"
          />

          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleSubmit}
            sx={{ borderRadius: '8px', padding: '12px 24px', mb: 2 }}
          >
            {action ? action + ' Access' : 'Submit'}
          </Button>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setAction('Give')}
              sx={{ borderRadius: '8px', padding: '12px 24px' }}
            >
              Give Access
            </Button>

            <Button 
              variant="contained" 
              color="error"
              onClick={() => setAction('Remove')}
              sx={{ borderRadius: '8px', padding: '12px 24px' }}
            >
              Remove Access
            </Button>
          </Box>

          <Button 
            variant="outlined"
            color="primary"
            onClick={handleGoBack}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Go Back
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            Are you sure you want to {action} access to the wallet address {walletAddress}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TransferDataPage;