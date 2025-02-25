import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { login } from '../store/slices/authSlice';
import { API_URL } from '../config';

const handleDummyCredentials = (credentials, setFormData) => {
  setFormData({
    username: credentials.username,
    password: credentials.password
  });
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [dummyCredentials, setDummyCredentials] = useState([]);
  const [showDummyCredentials, setShowDummyCredentials] = useState(false);

  useEffect(() => {
    // Fetch dummy credentials
    fetch(`${API_URL}/dummy-credentials`)
      .then(res => res.json())
      .then(data => setDummyCredentials(data.credentials))
      .catch(err => console.error('Error fetching dummy credentials:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (!resultAction.error) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1.5, sm: 0 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #BEFF03, transparent)',
        },
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px' },
            mx: 'auto',
          }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                position: 'absolute',
                top: { xs: -32, sm: -60 },
                left: { xs: -8, sm: -10 },
                color: '#BEFF03',
                padding: { xs: '6px', sm: '8px' },
                '&:hover': {
                  background: 'rgba(190, 255, 3, 0.1)',
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: { xs: 1.5, sm: 2, md: 3 },
                background: 'rgba(17, 24, 1, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(190, 255, 3, 0.1)',
                boxShadow: '0 4px 30px rgba(190, 255, 3, 0.1)',
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                    background: 'linear-gradient(90deg, #BEFF03, #03FFE8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: { xs: 2, sm: 3, md: 4 },
                  }}
                >
                  Welcome Back
                </Typography>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: { xs: 1.5, sm: 2, md: 3 },
                      backgroundColor: 'rgba(255, 3, 62, 0.1)',
                      color: '#FF033E',
                      border: '1px solid rgba(255, 3, 62, 0.2)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      py: { xs: 0.5, sm: 1 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  sx={{
                    mb: { xs: 1, sm: 1.5, md: 2 },
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '40px', sm: '44px', md: '48px' },
                      '& fieldset': {
                        borderColor: 'rgba(190, 255, 3, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(190, 255, 3, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#BEFF03',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(190, 255, 3, 0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      transform: 'translate(14px, 12px) scale(1)',
                      '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                      padding: { xs: '8px 14px', sm: '12px 14px' },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: 'rgba(190, 255, 3, 0.7)',
                            padding: { xs: '2px', sm: '4px' },
                          }}
                        >
                          {showPassword ? 
                            <VisibilityOffIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> : 
                            <VisibilityIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: { xs: 1.5, sm: 2, md: 3 },
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '40px', sm: '44px', md: '48px' },
                      '& fieldset': {
                        borderColor: 'rgba(190, 255, 3, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(190, 255, 3, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#BEFF03',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(190, 255, 3, 0.7)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      transform: 'translate(14px, 12px) scale(1)',
                      '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                      padding: { xs: '8px 14px', sm: '12px 14px' },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: { xs: 2, sm: 3 },
                    mb: 2,
                    py: { xs: 1, sm: 1.5 },
                    background: 'linear-gradient(90deg, #BEFF03, #03FFE8)',
                    color: '#111801',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': {
                      background: 'linear-gradient(90deg, #BEFF03, #03FFE8)',
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Button
                  fullWidth
                  onClick={() => navigate('/signup')}
                  sx={{
                    mt: 1,
                    py: { xs: 1, sm: 1.5 },
                    border: '1px solid',
                    borderColor: 'rgba(190, 255, 3, 0.3)',
                    color: '#BEFF03',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#BEFF03',
                      background: 'rgba(190, 255, 3, 0.1)',
                    },
                  }}
                >
                  Don't have an account? Sign Up
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Button
                    onClick={() => setShowDummyCredentials(!showDummyCredentials)}
                    sx={{
                      color: 'rgba(190, 255, 3, 0.7)',
                      textTransform: 'none',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        color: '#BEFF03',
                        background: 'rgba(190, 255, 3, 0.1)',
                      },
                    }}
                  >
                    {showDummyCredentials ? 'Hide Test Accounts' : 'Show Test Accounts'}
                  </Button>

                </Box>

                {showDummyCredentials && dummyCredentials.length > 0 && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      p: 2,
                      borderRadius: 1,
                      background: 'rgba(190, 255, 3, 0.05)',
                      border: '1px solid rgba(190, 255, 3, 0.1)',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'rgba(190, 255, 3, 0.7)',
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      Test Accounts
                    </Typography>
                    {dummyCredentials.map((cred, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: index < dummyCredentials.length - 1 ? 2 : 0,
                          p: 1.5,
                          borderRadius: 1,
                          background: 'rgba(190, 255, 3, 0.05)',
                          border: '1px solid rgba(190, 255, 3, 0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: 'rgba(190, 255, 3, 0.1)',
                          },
                        }}
                        onClick={() => handleDummyCredentials(cred, setFormData)}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#BEFF03',
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            mb: 0.5,
                          }}
                        >
                          {cred.note}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(190, 255, 3, 0.7)',
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        >
                          Username: {cred.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(190, 255, 3, 0.7)',
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        >
                          Password: {cred.password}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
