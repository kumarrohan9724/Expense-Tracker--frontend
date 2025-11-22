import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  InputAdornment,
  IconButton,
  CircularProgress // Added for loading animation
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  EmailOutlined, 
  AutoGraph, 
  ArrowForward 
} from '@mui/icons-material';
import { keyframes } from '@emotion/react'; // Import keyframes utility
import { supabase } from '../services/supabaseClient'; // Ensure this path is correct

// 1. Define Keyframes for Animations

// Card Entry Animation: Fade-in and slight scale
const cardEntry = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Background Blob Movement: Subtle, infinite transform
const blobMovement = keyframes`
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
`;

// Button Loading Pulse Animation
const loadingPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(118, 75, 162, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(118, 75, 162, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(118, 75, 162, 0);
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage('Magic link sent! Check your inbox.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Modern Deep Gradient Background
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Blobs (Glow effects) with Movement Animation */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(118,75,162,0.3) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0,
        animation: `${blobMovement} 15s infinite alternate ease-in-out`, // Apply movement
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102,126,234,0.3) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0,
        animation: `${blobMovement} 20s infinite alternate-reverse ease-in-out`, // Apply movement
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            // Glassmorphism Styling
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            textAlign: 'center',
            color: '#fff',
            // Apply Card Entry Animation
            animation: `${cardEntry} 0.8s ease-out`, 
          }}
        >
          {/* Logo / Icon Area */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              boxShadow: '0 0 20px rgba(118, 75, 162, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AccountBalanceWallet sx={{ fontSize: 40, color: '#fff' }} />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: '1px' }}>
            FinTrack
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, lineHeight: 1.6 }}>
            Stop wondering where your money went. <br/>
            Start telling it where to go.
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                style: { color: '#fff', borderRadius: '12px' },
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#764ba2' },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              endIcon={!loading && <ArrowForward />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                // Conditional Box Shadow for Loading Pulse Animation
                boxShadow: loading 
                  ? `0 0 0 0 rgba(118, 75, 162, 0.7)` 
                  : '0 3px 5px 2px rgba(105, 105, 255, .3)',
                transition: '0.3s',
                opacity: loading ? 0.7 : 1,
                // Apply pulse animation when loading
                animation: loading ? `${loadingPulse} 1.5s infinite` : 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(118, 75, 162, 0.6)',
                }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Sending Link...
                </>
              ) : (
                'Send Magic Link'
              )}
            </Button>
          </form>

          {message && (
            <Box 
              sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: message.includes('error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                border: message.includes('error') ? '1px solid rgba(255,0,0,0.2)' : '1px solid rgba(0,255,0,0.2)'
              }}
            >
              <Typography variant="caption" sx={{ color: message.includes('error') ? '#ffcccc' : '#ccffcc' }}>
                {message}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <AutoGraph sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Smart Analytics &bull; Secure &bull; Real-time
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}