import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined'; // Use correct icon imports
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CSAPage = () => {
  const [action, setAction] = useState('Get');
  const [id, setId] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleSubmit = () => {
    if (!id) {
      setError('Please enter an ID.');
      return;
    }

    if (action === 'Remove') {
      setOpenConfirmDialog(true);
    } else {
      // Mock get evidence logic
      setTimeout(() => {
        setSuccess(`Evidence with ID ${id} retrieved successfully!`);
        setError('');
      }, 1000);
    }
  };

  const handleConfirmRemove = () => {
    setOpenConfirmDialog(false);

    // Mock remove evidence logic
    setTimeout(() => {
      setSuccess(`Evidence with ID ${id} removed successfully!`);
      setError('');
      setId('');
    }, 1000);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleTransferClick = () => {
    navigate('/transfer'); // Navigate to the TransferPage
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, CSA!
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
          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select
              value={action}
              onChange={handleActionChange}
              sx={{ mb: 3 }}
            >
              <MenuItem value="Get">Get Evidence</MenuItem>
              <MenuItem value="Remove">Remove Evidence</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Evidence ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            placeholder="Enter evidence ID here"
          />
          
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ borderRadius: '8px', padding: '12px 24px' }}
          >
            {action} Evidence
          </Button>

          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleTransferClick} // Navigate to TransferPage
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Transfer Evidence
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            Are you sure you want to remove evidence with ID {id}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmRemove} color="error">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CSAPage;