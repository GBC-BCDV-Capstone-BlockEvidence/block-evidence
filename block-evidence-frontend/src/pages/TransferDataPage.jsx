import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';

const TransferDataPage = ({ account }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [evidenceId, setEvidenceId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }
    if (!walletAddress) {
      setError('Please enter a wallet address.');
      return;
    }
    if (!evidenceId) {
      setError('Please enter an evidence ID.');
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    setOpenConfirmDialog(false);
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/transfer', {
        id: evidenceId,
        newOwner: walletAddress,
        userAddress: account
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setWalletAddress('');
        setEvidenceId('');
      } else {
        setError('Transfer failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleGoBack = () => {
    navigate('/company');
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
          <TextField
            label="Evidence ID"
            value={evidenceId}
            onChange={(e) => setEvidenceId(e.target.value)}
            fullWidth
            placeholder="Enter evidence ID here"
          />
          <TextField
            label="New Owner Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            fullWidth
            placeholder="Enter new owner's wallet address here"
          />

          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading || !account}
            sx={{ borderRadius: '8px', padding: '12px 24px', mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Transfer Evidence'}
          </Button>

          <Button 
            variant="outlined"
            color="primary"
            onClick={handleGoBack}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Go Back
          </Button>
        </Box>

        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogContent>
            Are you sure you want to transfer evidence ID {evidenceId} to the wallet address {walletAddress}?
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