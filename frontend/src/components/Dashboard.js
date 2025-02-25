import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LogoutRounded as LogoutIcon,
  AccountBalanceWalletRounded as WalletIcon,
  ShowChartRounded as ChartIcon,
  BarChartRounded as StatsIcon,
  PersonRounded as PersonIcon
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { fetchCsvData } from '../store/slices/dataSlice';
import PerformanceChart from './PerformanceChart';
import DataTable from './DataTable';
import NetworkError from './errors/NetworkError';
import BackupManager from './BackupManager';
import ErrorSnackbar from './ErrorSnackbar';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        background: alpha(color, 0.1),
        border: `1px solid ${alpha(color, 0.2)}`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 4px 12px ${alpha(color, 0.15)}`
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.7),
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.2),
              color: color,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 }
            }}
          >
            <Icon />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const dataState = useSelector((state) => state.data) || {};
  const { networkError = false, csvData = [] } = dataState;
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    dispatch(fetchCsvData());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  if (networkError) {
    return <NetworkError />;
  }

  // Calculate statistics
  const totalPnl = csvData.reduce((sum, row) => sum + (parseFloat(row.pnl) || 0), 0);
  const totalMargin = csvData.reduce((sum, row) => sum + (parseFloat(row.margin) || 0), 0);
  const totalRisk = csvData.reduce((sum, row) => sum + (parseFloat(row.max_risk) || 0), 0);
  const activeUsers = new Set(csvData.map(row => row.user)).size;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {username || 'User'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <BackupManager />
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              borderColor: alpha(theme.palette.error.main, 0.5),
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total PNL"
            value={`$${totalPnl.toLocaleString()}`}
            icon={WalletIcon}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Margin"
            value={`$${totalMargin.toLocaleString()}`}
            icon={ChartIcon}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Risk"
            value={`$${totalRisk.toLocaleString()}`}
            icon={StatsIcon}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={PersonIcon}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Performance Chart
            </Typography>
            <PerformanceChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Data Table
              </Typography>
            </Box>
            <DataTable />
          </Paper>
        </Grid>
      </Grid>

      {/* Error Handling */}
      <ErrorSnackbar />
    </Container>
  );
};

export default Dashboard;
