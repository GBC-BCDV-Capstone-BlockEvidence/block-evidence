import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = ({ onLoginClick }) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Block Evidence
      </Typography>
      <Button color="inherit" onClick={onLoginClick}>
        Log In
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
