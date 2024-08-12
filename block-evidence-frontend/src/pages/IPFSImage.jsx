import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

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

export default IPFSImage;