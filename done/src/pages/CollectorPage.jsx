import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

const CollectorPage = () => {
  const [fileId, setFileId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!fileId || !description || !file) {
      setError('Please fill out all fields and select a file.');
      return;
    }

    // Mock file upload logic
    // Replace this with actual file upload logic
    setTimeout(() => {
      setSuccess('File uploaded successfully!');
      setError('');
      setFileId('');
      setDescription('');
      setFile(null);
    }, 1000);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Collector!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="File ID"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginBottom: '16px' }}
          />
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ borderRadius: '8px' }}
          >
            Upload File
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CollectorPage;