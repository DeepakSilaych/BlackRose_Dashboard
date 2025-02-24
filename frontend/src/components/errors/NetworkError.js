import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const NetworkError = ({ onRetry }) => {
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
        <WifiOffIcon sx={{ fontSize: 100, color: 'warning.main', mb: 2 }} />
        <Typography variant="h4" color="warning.main" gutterBottom>
          Connection Error
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Unable to connect to the server. Please check your internet connection.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            sx={{ mr: 2 }}
          >
            Retry Connection
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NetworkError;
