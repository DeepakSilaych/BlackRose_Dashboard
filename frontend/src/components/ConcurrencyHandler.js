import React from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ConcurrencyHandler = ({ open, onClose, onRefresh, loading }) => {
  const currentVersion = useSelector((state) => state.data.currentVersion);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography>Concurrent Update Detected</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Another user has modified this data while you were working.
          Your version: {currentVersion}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To prevent data loss, please refresh the data and try your changes again.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={onRefresh}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          Refresh Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConcurrencyHandler;
