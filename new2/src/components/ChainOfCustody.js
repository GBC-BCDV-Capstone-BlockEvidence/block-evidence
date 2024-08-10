import React from 'react';
import { Container, Typography } from '@mui/material';

const ChainOfCustody = () => (
  <Container style={{ marginTop: '30px' }}>
    <Typography variant="h6" gutterBottom>
      Chain of Custody
    </Typography>
    <Typography variant="body1">
      The system ensures the integrity and traceability of digital evidence from collection to presentation.
    </Typography>
  </Container>
);

export default ChainOfCustody;
