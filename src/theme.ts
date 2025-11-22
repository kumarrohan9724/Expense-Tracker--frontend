import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#667eea",   // Indigo
      light: "#764ba2",  // Soft Purple
    },
    secondary: {
      main: "#9f7aea",   // Neon Purple
    },
    background: {
      default: "#0f0c29",  // Deep gradient base color
      paper: "rgba(255,255,255,0.05)", // Glassmorphism card
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.6)",
    },
  },

  typography: {
    fontFamily: '"Poppins", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "0.5px" },
    h5: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: "none" }
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    // Glassmorphism Paper Cards
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      },
    },

    // Futuristic Gradient Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 24px",
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b46c1 100%)",
          boxShadow: "0 4px 20px rgba(118, 75, 162, 0.5)",
          transition: "0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            background:
              "linear-gradient(135deg, #764ba2 0%, #667eea 50%, #6b46c1 100%)",
            boxShadow: "0 6px 24px rgba(118, 75, 162, 0.7)",
          },
        },
      },
    },

    // Input Fields with translucent styling
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12,
          "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
          "&.Mui-focused fieldset": { borderColor: "#764ba2" },
        },
        input: { color: "#fff" },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.6)",
          "&.Mui-focused": { color: "#764ba2" },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export { theme };
