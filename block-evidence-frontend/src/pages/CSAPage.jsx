import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  Card,
  CardContent,
  Divider,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlined';
import { useNavigate } from 'react-router-dom';

const IPFSImage = ({ hash }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!hash) return;

    const localGateway = `http://localhost:8080/ipfs/${hash}`;
    const publicGateway = `https://ipfs.io/ipfs/${hash}`;

    const testImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject();
        img.src = url;
      });
    };

    const loadImage = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try local gateway first
        const url = await testImage(localGateway);
        setImageUrl(url);
      } catch {
        try {
          // If local fails, try public gateway
          const url = await testImage(publicGateway);
          setImageUrl(url);
        } catch {
          setError('Failed to load image from both local and public gateways');
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [hash]);

  if (!hash) return null;

  return (
    <Box sx={{ mt: 2, position: 'relative' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {imageUrl && (
        <Box>
          <img 
            src={imageUrl}
            alt="IPFS Evidence"
            style={{ maxWidth: '100%', display: loading ? 'none' : 'block' }}
          />
          <Typography variant="caption">Image loaded from: {imageUrl}</Typography>
        </Box>
      )}
      <Typography variant="caption" display="block">IPFS Hash: {hash}</Typography>
    </Box>
  );
};

const CSAPage = () => {
  const [action, setAction] = useState('Get');
  const [id, setId] = useState('');
  const [evidenceBasic, setEvidenceBasic] = useState(null);
  const [evidenceDetails, setEvidenceDetails] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleSubmit = async () => {
    if (!id) {
      setError('Please enter an ID.');
      return;
    }

    if (action === 'Remove') {
      setOpenConfirmDialog(true);
    } else {
      try {
        const [basicResponse, detailsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/getEvidenceBasic/${id}`),
          axios.get(`http://localhost:3001/getEvidenceDetails/${id}`)
        ]);
        
        setEvidenceBasic(basicResponse.data.evidence);
        setEvidenceDetails(detailsResponse.data.evidence);
        setSuccess(`Evidence with ID ${id} retrieved successfully!`);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching evidence.');
        setSuccess('');
        setEvidenceBasic(null);
        setEvidenceDetails(null);
      }
    }
  };

  const handleConfirmRemove = async () => {
    setOpenConfirmDialog(false);

    try {
      const response = await axios.post('http://localhost:3001/removeEvidence', { id });
      setSuccess(response.data.message);
      setError('');
      setId('');
      setEvidenceBasic(null);
      setEvidenceDetails(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while removing evidence.');
      setSuccess('');
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleTransferClick = () => {
    navigate('/transfer');
  };

  const handleAddLogsClick = () => {
    navigate('/addlog'); 
  };

  const convertToGMT4 = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    date.setHours(date.getHours() - 4); // Adjust for GMT-4
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/New_York' // This ensures correct DST handling
    };
    
    return date.toLocaleString('en-US', options) + ' GMT-4';
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
            onClick={handleTransferClick}
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Transfer Evidence
          </Button>

          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddLogsClick} // Navigate to AddLogsPage
            sx={{ borderRadius: '8px', padding: '12px 24px', mt: 2 }}
          >
            Add Logs
          </Button>
        
        </Box>

        {(evidenceBasic || evidenceDetails) && (
          <Card sx={{ mt: 4, textAlign: 'left' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Evidence Details:</Typography>
              
              {evidenceBasic && (
                <Box>
                  <Typography><strong>ID:</strong> {evidenceBasic.id}</Typography>
                  <Typography><strong>Owner:</strong> {evidenceBasic.owner}</Typography>
                  <Typography><strong>Creator:</strong> {evidenceBasic.creator}</Typography>
                  <Typography><strong>Description:</strong> {evidenceBasic.description}</Typography>
                </Box>
              )}

              {evidenceDetails && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography><strong>IPFS Hash:</strong> {evidenceDetails.ipfsHash}</Typography>
                  <Typography><strong>Addresses:</strong> {evidenceDetails.addresses.join(', ')}</Typography>
                  <Typography><strong>Times (GMT-4):</strong> {evidenceDetails.times.map(convertToGMT4).join(', ')}</Typography>
                  <Typography><strong>Logs:</strong> {evidenceDetails.logs.join(', ')}</Typography>
                  <IPFSImage hash={evidenceDetails.ipfsHash} />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

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