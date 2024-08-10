import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginDialog = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    navigate(`/login/${mode}`);
  };

  return (
    <Dialog open onClose={() => navigate('/')}>
      <DialogTitle>Select Login Mode</DialogTitle>
      <DialogContent>
        <Button fullWidth variant="contained" color="primary" onClick={() => handleModeSelect('Collector')}>
          Collector
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button fullWidth variant="contained" color="secondary" onClick={() => handleModeSelect('CSA')}>
          CSA
        </Button>
        <Divider style={{ margin: '10px 0' }} />
        <Button fullWidth variant="contained" sx={{ bgcolor: 'warning.main' }} onClick={() => handleModeSelect('Guest')}>
          Guest
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
