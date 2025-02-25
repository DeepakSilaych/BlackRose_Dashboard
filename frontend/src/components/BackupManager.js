import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  RestoreRounded as RestoreIcon,
  DownloadRounded as DownloadIcon,
  CloseRounded as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

const parseBackupDate = (filename) => {
  // Extract date part from filename (format: backend_table_backup_YYYYMMDD_HHMMSS.csv)
  const match = filename.match(/(\d{8})_(\d{6})/);
  if (!match) return 'Unknown date';

  const [, datePart, timePart] = match;
  const year = datePart.slice(0, 4);
  const month = datePart.slice(4, 6);
  const day = datePart.slice(6, 8);
  const hour = timePart.slice(0, 2);
  const minute = timePart.slice(2, 4);
  const second = timePart.slice(4, 6);

  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // Month is 0-based
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );

  return date.toLocaleString();
};

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const theme = useTheme();

  const fetchBackups = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/backups`);
      setBackups(response.data);
    } catch (error) {
      setError('Failed to fetch backups');
    }
  };

  useEffect(() => {
    if (open) {
      fetchBackups();
    }
  }, [open]);

  const handleRestore = async (backupName) => {
    try {
      setRestoring(true);
      await axios.post(`${API_URL}/api/backups/${backupName}/restore`);
      window.location.reload(); // Refresh to show restored data
    } catch (error) {
      setError('Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  const handleDownload = async (backupName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/backups/${backupName}/download`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', backupName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download backup');
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<RestoreIcon />}
        sx={{
          borderColor: alpha(theme.palette.primary.main, 0.5),
          '&:hover': {
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        Manage Backups
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Backup Management</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {backups.length === 0 ? (
            <Typography color="text.secondary">No backups available</Typography>
          ) : (
            <List>
              {backups.map((backup) => (
                <ListItem
                  key={backup}
                  sx={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={backup}
                    secondary={parseBackupDate(backup)}
                  />
                  <Box>
                    <IconButton
                      onClick={() => handleRestore(backup)}
                      disabled={restoring}
                      color="primary"
                      size="small"
                      title="Restore this backup"
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(backup)}
                      color="primary"
                      size="small"
                      title="Download backup"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.5),
              '&:hover': {
                borderColor: theme.palette.primary.main,
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BackupManager;
