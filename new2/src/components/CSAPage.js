import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const CSAPage = () => {
  const location = useLocation();
  const account = location.state?.account; // Retrieve account address from state
  const [evidenceId, setEvidenceId] = useState('');

  const handleSearchEvidence = () => {
    alert(`Searching evidence for ID: ${evidenceId}`);
    // Add logic to search evidence based on ID
  };

  const handleTransfer = () => {
    alert(`Transferring evidence with ID: ${evidenceId}`);
    // Add logic to transfer evidence based on ID
  };

  const handleDelete = () => {
    alert(`Deleting evidence with ID: ${evidenceId}`);
    // Add logic to delete evidence based on ID
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        CSA Page
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome, CSA!
      </Typography>
      {account && (
        <Typography variant="body1" gutterBottom>
          Connected MetaMask Address: {account.slice(0, 6)}...{account.slice(-4)}
        </Typography>
      )}
      <TextField
        label="Evidence ID"
        fullWidth
        margin="normal"
        value={evidenceId}
        onChange={(e) => setEvidenceId(e.target.value)}
      />
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearchEvidence}
          >
            Search Evidence
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleTransfer}
          >
            Transfer
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CSAPage;
