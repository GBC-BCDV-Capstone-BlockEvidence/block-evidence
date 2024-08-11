import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';

const GuestPage = () => {
  const [id, setId] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetEvidence = () => {
    if (!id) {
      setError('Please enter an ID.');
      return;
    }

    setLoading(true);

    // Mock evidence data
    const mockEvidence = {
      id: id,
      description: 'Sample description for evidence with ID ' + id,
      csaAddresses: ['0x123...', '0x456...', '0x789...'], // Example addresses
      logData: [
        { timestamp: '2024-08-11T12:00:00Z', action: 'Created' },
        { timestamp: '2024-08-11T12:30:00Z', action: 'Reviewed' },
      ],
    };

    // Simulate API call or data retrieval
    setTimeout(() => {
      setEvidence(mockEvidence);
      setSuccess('Evidence retrieved successfully!');
      setError('');
      setLoading(false);
    }, 1000);
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
          >
            Get Evidence
          </Button>
        </Box>

        {loading && (
          <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
        )}

        {evidence && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Evidence Details
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>CSA Addresses</TableCell>
                    <TableCell>Log Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{evidence.id}</TableCell>
                    <TableCell>{evidence.description}</TableCell>
                    <TableCell>
                      <ul style={{ padding: 0, margin: 0 }}>
                        {evidence.csaAddresses.map((address, index) => (
                          <li key={index}>{address}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul style={{ padding: 0, margin: 0 }}>
                        {evidence.logData.map((log, index) => (
                          <li key={index}>
                            {log.timestamp} - {log.action}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
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