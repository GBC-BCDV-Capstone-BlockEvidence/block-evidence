import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';

const CollectorPage = ({ account }) => {
  const [fileId, setFileId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }

    if (!fileId || !description || !file) {
      setError('Please fill out all fields and select a file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // First, upload the file to IPFS
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await axios.post('http://localhost:3001/uploadToIpfs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { ipfsHash } = uploadResponse.data;
      setIpfsHash(ipfsHash);

      // Then, create the evidence on the blockchain
      const createResponse = await axios.post('http://localhost:3001/createEvidence', {
        id: fileId,
        description,
        userAddress: account
      });

      if (createResponse.data.success) {
        // Set the IPFS hash for the evidence
        await axios.post('http://localhost:3001/setIpfsHash', {
          id: fileId,
          ipfsHash,
          userAddress: account
        });

        setSuccess('Evidence created and file uploaded successfully!');
        
        // Clear the form
        setFileId('');
        setDescription('');
        setFile(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'An error occurred while creating evidence or uploading file.');
    } finally {
      setIsLoading(false);
    }
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
            multiline
            rows={4}
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
            disabled={isLoading || !account}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Evidence and Upload File'}
          </Button>
        </Box>

        {ipfsHash && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploaded File Details
              </Typography>
              <Typography>
                IPFS Hash: {ipfsHash}
              </Typography>
              <Typography>
                IPFS Gateway URL: <a href={`http://localhost:8080/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">View File</a>
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default CollectorPage;