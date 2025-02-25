import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { clearError } from '../store/slices/dataSlice';

const ErrorSnackbar = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.data.error);
  const networkError = useSelector((state) => state.data.networkError);

  const handleClose = () => {
    dispatch(clearError());
  };

  const message = networkError
    ? 'Network error. Please check your connection.'
    : error || 'An error occurred';

  const severity = networkError ? 'warning' : 'error';

  return (
    <Snackbar
      open={!!error || networkError}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          backgroundColor: severity === 'warning' ? 'warning.dark' : 'error.dark',
          color: 'white',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
