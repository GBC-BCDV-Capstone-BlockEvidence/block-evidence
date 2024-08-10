import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

const CollectorPage = () => {
  const location = useLocation();
  const account = location.state?.account; // Retrieve account address from state
  const [file, setFile] = useState(null);
  const [evidenceId, setEvidenceId] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!file) {
      alert('Please choose a file to upload.');
      return;
    }
    // Add logic to handle file upload and evidence submission
    alert(`File uploaded with ID: ${evidenceId}\nDescription: ${description}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Collector Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Connected MetaMask Account: {account ? ` ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
      </Typography>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Evidence ID"
        fullWidth
        margin="normal"
        value={evidenceId}
        onChange={(e) => setEvidenceId(e.target.value)}
        variant="outlined"
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleUploadFile}
      >
        Upload File
      </Button>
    </Container>
  );
};

export default CollectorPage;
