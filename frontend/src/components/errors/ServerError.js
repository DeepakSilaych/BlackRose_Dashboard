import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        <Typography variant="h1" color="error" gutterBottom>
          500
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Server Error
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Something went wrong on our servers. We're working to fix the issue.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Refresh Page
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ServerError;
