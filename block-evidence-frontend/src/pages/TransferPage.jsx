import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const TransferPage = ({ account }) => { // Add account as a prop
  const [address, setAddress] = useState('');
  const [evidenceId, setEvidenceId] = useState(''); // Add state for evidence ID
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleEvidenceIdChange = (event) => {
    setEvidenceId(event.target.value);
  };

  const handleTransfer = () => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }
    if (!address || !evidenceId) {
      setError('Please enter both wallet address and evidence ID.');
      return;
    }
    setAction('Transfer');
    setOpenConfirmDialog(true);
  };

  const handleAccessAction = (actionType) => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }
    if (!address || !evidenceId) {
      setError('Please enter both wallet address and evidence ID.');
      return;
    }
    setAction(actionType);
    setOpenConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      switch (action) {
        case 'Transfer':
          response = await axios.post('http://localhost:3001/transfer', {
            id: evidenceId,
            newOwner: address,
            userAddress: account
          });
          break;
        case 'Give':
          response = await axios.post('http://localhost:3001/grantAccess', {
            id: evidenceId,
            viewer: address,
            userAddress: account
          });
          break;
        case 'Remove':
          response = await axios.post('http://localhost:3001/revokeAccess', {
            id: evidenceId,
            viewer: address,
            userAddress: account
          });
          break;
        default:
          throw new Error('Invalid action');
      }

      if (response.data.success) {
        setSuccess(`${action} action completed successfully! Transaction Hash: ${response.data.transactionHash}`);
        setAddress('');
        setEvidenceId('');
      } else {
        setError(`Failed to ${action.toLowerCase()}. Please try again.`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      setError(error.response?.data?.error || `An error occurred during ${action.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Transfer Evidence and Manage Access
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
            onChange={handleEvidenceIdChange}
            fullWidth
            placeholder="Enter evidence ID"
            variant="outlined"
          />

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
            disabled={loading || !account}
          >
            Transfer Evidence
          </Button>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleAccessAction('Give')}
              sx={{ borderRadius: '8px', padding: '12px 24px' }}
              disabled={loading || !account}
            >
              Give Access
            </Button>

            <Button 
              variant="contained" 
              color="error"
              onClick={() => handleAccessAction('Remove')}
              sx={{ borderRadius: '8px', padding: '12px 24px' }}
              disabled={loading || !account}
            >
              Remove Access
            </Button>
          </Box>

          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </Box>

        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm {action}</DialogTitle>
          <DialogContent>
            Are you sure you want to {action.toLowerCase()} {action === 'Transfer' ? 'evidence to' : 'access for'} the wallet address {address} for evidence ID {evidenceId}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="primary">
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