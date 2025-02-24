import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  Box,
  Chip,
  Tooltip,
  Typography,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  fetchCsvData,
  updateCsvEntry,
  deleteCsvEntry,
  createCsvEntry,
  clearError,
} from '../store/slices/dataSlice';

const DataTable = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const dataState = useSelector((state) => state.data) || {};
  const { csvData = [], loading = false, error = null } = dataState;
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialog, setEditDialog] = useState({ open: false, data: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchCsvData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error',
      });
    }
  }, [error]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditDialog({ open: true, data: row });
  };

  const handleDelete = async (apiKey) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const resultAction = await dispatch(deleteCsvEntry(apiKey));
      if (!resultAction.error) {
        setSnackbar({
          open: true,
          message: 'Entry deleted successfully',
          severity: 'success',
        });
      }
    }
  };

  const handleSubmitEdit = async () => {
    const resultAction = await dispatch(updateCsvEntry({
      apiKey: editDialog.data['API key'],
      updates: formData,
    }));
    
    if (!resultAction.error) {
      setSnackbar({
        open: true,
        message: 'Entry updated successfully',
        severity: 'success',
      });
      setEditDialog({ open: false, data: null });
      setFormData({});
    }
  };

  const handleSubmitCreate = async () => {
    const resultAction = await dispatch(createCsvEntry(formData));
    if (!resultAction.error) {
      setSnackbar({
        open: true,
        message: 'Entry created successfully',
        severity: 'success',
      });
      setCreateDialog(false);
      setFormData({});
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    dispatch(clearError());
  };

  const getPnlColor = (pnl) => {
    const value = parseFloat(pnl);
    return value > 0 ? theme.palette.success.main : 
           value < 0 ? theme.palette.error.main : 
           theme.palette.text.secondary;
  };

  if (loading && !csvData.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 400 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true}>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateDialog(true)}
            startIcon={<AddIcon />}
          >
            Add New API Key
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Broker</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell align="right">PNL</TableCell>
                <TableCell align="right">Margin</TableCell>
                <TableCell align="right">Max Risk</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : csvData
              ).map((row) => (
                <TableRow 
                  key={row['API key'] || Math.random()}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={row.user}
                        size="small"
                        sx={{ 
                          backgroundColor: theme.palette.primary.dark,
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{row.broker}</TableCell>
                  <TableCell>
                    <Tooltip title="Click to copy" arrow>
                      <Chip
                        label={row['API key']}
                        size="small"
                        onClick={() => navigator.clipboard.writeText(row['API key'])}
                        sx={{ 
                          maxWidth: 200,
                          cursor: 'pointer',
                          backgroundColor: theme.palette.background.paper,
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {parseFloat(row.pnl) > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                      <Typography sx={{ color: getPnlColor(row.pnl) }}>
                        ${parseFloat(row.pnl).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">${parseFloat(row.margin).toLocaleString()}</TableCell>
                  <TableCell align="right">${parseFloat(row.max_risk).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit" arrow>
                      <IconButton 
                        onClick={() => handleEdit(row)} 
                        disabled={loading}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton 
                        onClick={() => handleDelete(row['API key'])} 
                        disabled={loading}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={csvData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialog.open} 
          onClose={() => setEditDialog({ open: false, data: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">Edit API Key</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                label="User"
                name="user"
                fullWidth
                value={formData.user || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Broker"
                name="broker"
                fullWidth
                value={formData.broker || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="PNL"
                name="pnl"
                type="number"
                fullWidth
                value={formData.pnl || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Margin"
                name="margin"
                type="number"
                fullWidth
                value={formData.margin || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Max Risk"
                name="max_risk"
                type="number"
                fullWidth
                value={formData.max_risk || ''}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button 
              onClick={() => setEditDialog({ open: false, data: null })} 
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEdit} 
              color="primary"
              disabled={loading}
              variant="contained"
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Dialog */}
        <Dialog 
          open={createDialog} 
          onClose={() => setCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">Add New API Key</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                label="User"
                name="user"
                fullWidth
                value={formData.user || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                label="Broker"
                name="broker"
                fullWidth
                value={formData.broker || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                label="API Key"
                name="API key"
                fullWidth
                value={formData['API key'] || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                label="API Secret"
                name="API secret"
                fullWidth
                value={formData['API secret'] || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
                type="password"
              />
              <TextField
                label="PNL"
                name="pnl"
                type="number"
                fullWidth
                value={formData.pnl || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                label="Margin"
                name="margin"
                type="number"
                fullWidth
                value={formData.margin || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField
                label="Max Risk"
                name="max_risk"
                type="number"
                fullWidth
                value={formData.max_risk || ''}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button 
              onClick={() => setCreateDialog(false)} 
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitCreate} 
              color="primary"
              disabled={loading}
              variant="contained"
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creating...' : 'Create API Key'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default DataTable;
