import React from 'react';
import { Container, Typography } from '@mui/material';

const HeroSection = () => (
  <Container style={{ textAlign: 'center', marginTop: '50px' }}>
    <Typography variant="h3" gutterBottom>
      Blockchain-based Digital Evidence Management System
    </Typography>
    <Typography variant="h5" color="textSecondary" paragraph>
      Ensuring integrity and chain of custody in cyber investigations.
    </Typography>
  </Container>
);

export default HeroSection;
