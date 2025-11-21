import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Deep dark background with neon accents
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // Vivid Purple
      light: '#A78BFA',
    },
    secondary: {
      main: '#EC4899', // Neon Pink
    },
    background: {
      default: '#09090b', // Very deep black/gray
      paper: '#18181b',   // Slightly lighter for cards
    },
    text: {
      primary: '#F4F4F5',
      secondary: '#A1A1AA',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-1px' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16, // Super rounded corners
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default MUI gradient
          backgroundColor: 'rgba(24, 24, 27, 0.8)', // Semi-transparent
          backdropFilter: 'blur(12px)', // Glassmorphism effect
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 24px' },
        containedPrimary: {
          // Gradients make buttons pop
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
          '&:hover': {
             boxShadow: '0 6px 20px rgba(139, 92, 246, 0.6)',
          }
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export { theme };