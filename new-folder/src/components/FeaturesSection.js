import React from 'react';
import { Container, Typography } from '@mui/material';

const FeaturesSection = () => (
  <Container style={{ marginTop: '30px' }}>
    <Typography variant="h6" gutterBottom>
      Features:
    </Typography>
    <Typography variant="body1">• Secure Evidence Handling</Typography>
    <Typography variant="body1">• Immutable Records</Typography>
    <Typography variant="body1">• User Roles Management</Typography>
  </Container>
);

export default FeaturesSection;
