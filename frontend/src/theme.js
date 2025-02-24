import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BEFF03', // Neon green
      light: '#D4FF4D',
      dark: '#96CC02',
    },
    secondary: {
      main: '#03FFE8', // Neon cyan
      light: '#4DFFED',
      dark: '#02CCB9',
    },
    background: {
      default: '#0A0F01', // Very dark green-black
      paper: '#111801', // Dark green-black
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#BEFF03',
      light: '#D4FF4D',
      dark: '#96CC02',
    },
    error: {
      main: '#FF033E',
      light: '#FF4D75',
      dark: '#CC0231',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0A0F01 0%, #111801 100%)',
          minHeight: '100vh',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(190, 255, 3, 0.2) transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(190, 255, 3, 0.2)',
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'rgba(190, 255, 3, 0.3)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #BEFF03 0%, #96CC02 100%)',
          color: '#000000',
          boxShadow: '0 4px 14px 0 rgba(190, 255, 3, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #D4FF4D 0%, #BEFF03 100%)',
            boxShadow: '0 6px 20px 0 rgba(190, 255, 3, 0.4)',
          },
        },
        outlined: {
          borderColor: '#BEFF03',
          color: '#BEFF03',
          '&:hover': {
            borderColor: '#D4FF4D',
            backgroundColor: 'rgba(190, 255, 3, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 1, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(190, 255, 3, 0.1)',
          boxShadow: '0 4px 30px rgba(190, 255, 3, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            border: '1px solid rgba(190, 255, 3, 0.2)',
            boxShadow: '0 8px 40px rgba(190, 255, 3, 0.15)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(17, 24, 1, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(190, 255, 3, 0.1)',
          boxShadow: '0 4px 30px rgba(190, 255, 3, 0.2)',
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(190, 255, 3, 0.1)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(190, 255, 3, 0.05)',
          color: '#BEFF03',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
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
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(190, 255, 3, 0.1)',
          color: '#BEFF03',
          '&:hover': {
            backgroundColor: 'rgba(190, 255, 3, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
