import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';

const GuestPage = ({ account }) => {
  const [id, setId] = useState('');
  const [evidenceBasic, setEvidenceBasic] = useState(null);
  const [evidenceDetails, setEvidenceDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setEvidenceBasic(null);
    setEvidenceDetails(null);

    try {
      const [basicResponse, detailsResponse] = await Promise.all([
        axios.get(`http://localhost:3001/getEvidenceBasic/${id}`),
        axios.get(`http://localhost:3001/getEvidenceDetails/${id}`)
      ]);

      setEvidenceBasic(basicResponse.data.evidence);
      setEvidenceDetails(detailsResponse.data.evidence);
      setSuccess('Evidence retrieved successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching evidence.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/New_York'
    }) + ' GMT-4';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Guest!
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500, mx: 'auto', mb: 4 }}>
          <TextField
            label="Evidence ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            placeholder="Enter evidence ID here"
            variant="outlined"
            size="small"
          />
          
          <Button
            variant="contained"
            onClick={handleGetEvidence}
            sx={{ borderRadius: '8px', padding: '12px 24px' }}
            disabled={loading || !account}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Evidence'}
          </Button>
        </Box>

        {(evidenceBasic || evidenceDetails) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Evidence Details
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">ID</TableCell>
                    <TableCell>{evidenceBasic?.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Owner</TableCell>
                    <TableCell>{evidenceBasic?.owner}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Creator</TableCell>
                    <TableCell>{evidenceBasic?.creator}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Description</TableCell>
                    <TableCell>{evidenceBasic?.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Addresses</TableCell>
                    <TableCell>
                      {evidenceDetails?.addresses.map((address, index) => (
                        <Typography key={index} variant="body2">{address}</Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Times</TableCell>
                    <TableCell>
                      {evidenceDetails?.times.map((time, index) => (
                        <Typography key={index} variant="body2">{formatTimestamp(time)}</Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Logs</TableCell>
                    <TableCell>
                      {evidenceDetails?.logs.map((log, index) => (
                        <Typography key={index} variant="body2">{log}</Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">IPFS Hash</TableCell>
                    <TableCell>{evidenceDetails?.ipfsHash}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GuestPage;