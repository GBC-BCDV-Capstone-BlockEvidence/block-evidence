import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => (
  <Container style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
    <Typography variant="body1">
      &copy; {new Date().getFullYear()} Block Evidence. All rights reserved.
    </Typography>
  </Container>
);

export default Footer;
