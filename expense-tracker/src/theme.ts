import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // Default to dark mode for "production" feel
    primary: { main: '#6366f1' }, // Indigo
    secondary: { main: '#ec4899' }, // Pink
    background: { default: '#0f172a', paper: '#1e293b' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: { borderRadius: 12 },
});