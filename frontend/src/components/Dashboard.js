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
  alpha
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
import RandomNumberChart from './RandomNumberChart';
import DataTable from './DataTable';
import NetworkError from './errors/NetworkError';

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
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.common.white,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                letterSpacing: '-0.02em',
                mb: 1
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.2),
              borderRadius: '12px',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ 
              fontSize: { xs: 20, sm: 24 }, 
              color: color 
            }} />
          </Box>
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

  useEffect(() => {
    dispatch(fetchCsvData());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleRetry = () => {
    dispatch(fetchCsvData());
  };

  if (networkError) {
    return <NetworkError onRetry={handleRetry} />;
  }

  // Calculate statistics
  const totalPnl = csvData.reduce((sum, row) => sum + (parseFloat(row.pnl) || 0), 0);
  const totalMargin = csvData.reduce((sum, row) => sum + (parseFloat(row.margin) || 0), 0);
  const totalRisk = csvData.reduce((sum, row) => sum + (parseFloat(row.max_risk) || 0), 0);
  const activeUsers = new Set(csvData.map(row => row.user)).size;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      pb: 4 
    }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 0,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 }
                }}
              >
                <PersonIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                }}
              >
                Dashboard
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              sx={{
                borderColor: alpha(theme.palette.common.white, 0.2),
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '&:hover': {
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  background: alpha(theme.palette.common.white, 0.05)
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Stats Cards */}
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

          {/* Chart */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  Real-time Performance
                </Typography>
                <Box sx={{ height: { xs: 300, sm: 400 } }}>
                  <RandomNumberChart />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Table */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  API Keys Management
                </Typography>
                <DataTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
