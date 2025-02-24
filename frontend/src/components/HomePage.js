import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #BEFF03, transparent)',
            opacity: 0,
            transition: 'opacity 0.3s',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              color: '#BEFF03',
            }}
          >
            <Icon sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: SecurityIcon,
      title: 'Enterprise Security',
      description: 'Advanced authentication protocols and real-time monitoring systems to protect your trading data.',
    },
    {
      icon: SpeedIcon,
      title: 'Real-time Analytics',
      description: 'Instant data streaming with WebSocket integration for millisecond-precision market insights.',
    },
    {
      icon: InsightsIcon,
      title: 'Smart Algorithms',
      description: 'AI-powered analytics and visualization tools for better trading decisions.',
    },
    {
      icon: TrendingUpIcon,
      title: 'Performance Metrics',
      description: 'Comprehensive tracking of PNL, risk metrics, and portfolio performance in real-time.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
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
      <Container maxWidth="lg" sx={{ 
        pt: { xs: 4, sm: 6, md: 8, lg: 12 }, 
        pb: { xs: 4, sm: 6, md: 8, lg: 12 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Hero Section */}
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} alignItems="center" sx={{ mb: { xs: 6, sm: 8, md: 12 } }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  background: 'linear-gradient(90deg, #BEFF03, #03FFE8)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: { xs: 1.2, sm: 1.3 },
                }}
              >
                BlackRose
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  fontWeight: 500,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                  color: 'text.secondary',
                  letterSpacing: '-0.01em',
                  lineHeight: { xs: 1.4, sm: 1.5 },
                }}
              >
                Next-Generation Trading Analytics
              </Typography>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  endIcon={
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowForwardIcon />
                    </motion.div>
                  }
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Launch Dashboard
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bottom: -20,
                    left: -20,
                    background: 'radial-gradient(circle, rgba(190, 255, 3, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                  },
                }}
              >
                <Box
                  component="img"
                  src="hero.png"
                  alt="Analytics Dashboard"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    // border: '1px solid rgba(190, 255, 3, 0.1)',
                    boxShadow: '0 20px 40px rgba(190, 255, 3, 0.15)',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 6, sm: 8, md: 12 } }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: { xs: 4, sm: 5, md: 6 },
              fontWeight: 600,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: 'linear-gradient(90deg, #BEFF03, #03FFE8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Trading Made Simple
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: { xs: 2, sm: 3 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(190, 255, 3, 0.1), rgba(3, 255, 232, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(190, 255, 3, 0.1)',
                borderRadius: 'inherit',
                zIndex: -1,
              },
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: { xs: 1, sm: 2 }, 
                fontWeight: 600, 
                color: '#BEFF03',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Ready to Transform Your Trading?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                maxWidth: '600px', 
                mx: 'auto',
                px: { xs: 2, sm: 0 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Join thousands of traders who have already elevated their trading game with BlackRose.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderWidth: '2px',
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage;
