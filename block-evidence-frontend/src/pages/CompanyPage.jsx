import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IPFSImage from './IPFSImage'; // Import the IPFSImage component

const CompanyPage = ({ account }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [evidenceData, setEvidenceData] = useState(null);
  const navigate = useNavigate();

  const handleGetEvidence = async () => {
    if (!account) {
      setError('Please connect your MetaMask wallet.');
      return;
    }
    if (!id) {
      setError('Please enter an ID.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setEvidenceData(null);

    try {
      const [basicResponse, detailsResponse] = await Promise.all([
        axios.get(`http://localhost:3001/getEvidenceBasic/${id}`),
        axios.get(`http://localhost:3001/getEvidenceDetails/${id}`)
      ]);

      const basicData = basicResponse.data.evidence;
      const detailsData = detailsResponse.data.evidence;

      setEvidenceData({ ...basicData, ...detailsData });
      setSuccess(`Evidence with ID ${id} retrieved successfully!`);
    } catch (err) {
      console.error('Error fetching evidence:', err);
      setError(err.response?.data?.error || 'An error occurred while fetching evidence.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferClick = () => {
    navigate('/transferpage');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Company!
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
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            placeholder="Enter evidence ID here"
          />

          <Button 
            variant="contained" 
            onClick={handleGetEvidence}
            sx={{ borderRadius: '8px', padding: '12px 24px' }}
            disabled={loading || !account}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Evidence'}
          </Button>

          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleTransferClick}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Transfer Evidence
          </Button>
        </Box>

        {evidenceData && (
          <Card sx={{ mt: 4, textAlign: 'left' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Evidence Details</Typography>
              <Typography><strong>ID:</strong> {evidenceData.id}</Typography>
              <Typography><strong>Owner:</strong> {evidenceData.owner}</Typography>
              <Typography><strong>Creator:</strong> {evidenceData.creator}</Typography>
              <Typography><strong>Description:</strong> {evidenceData.description}</Typography>
              <Typography><strong>IPFS Hash:</strong> {evidenceData.ipfsHash}</Typography>
              
              {/* Add the IPFSImage component here */}
              <IPFSImage hash={evidenceData.ipfsHash} />

              <Typography><strong>Addresses:</strong></Typography>
              <ul>
                {evidenceData.addresses && evidenceData.addresses.map((address, index) => (
                  <li key={index}>{address}</li>
                ))}
              </ul>
              <Typography><strong>Logs:</strong></Typography>
              <ul>
                {evidenceData.logs && evidenceData.logs.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
              <Typography><strong>Times:</strong></Typography>
              <ul>
                {evidenceData.times && evidenceData.times.map((time, index) => (
                  <li key={index}>{new Date(parseInt(time) * 1000).toLocaleString()}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default CompanyPage;