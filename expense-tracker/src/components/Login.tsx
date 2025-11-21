// src/components/Login.tsx
'use client'
import { supabase } from '../services/supabaseClient';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Alert } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

   

    const handleLogin = async (isSignUp: boolean) => {
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) setError(error.message);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) setError(error.message);
            }
        } catch (err: any) {
            setError(err?.message ?? String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
            <Box p={4} maxWidth={400} width="100%" borderRadius={2} boxShadow={3} bgcolor="#fff">
                <Typography variant="h5" mb={2} align="center">Expense Tracker Login</Typography>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    <Button
                        onClick={() => handleLogin(false)}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        fullWidth
                    >
                        Sign In
                    </Button>
                    <Typography align="center" color="textSecondary">or</Typography>
                    <Button
                        onClick={() => handleLogin(true)}
                        variant="outlined"
                        disabled={loading}
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}