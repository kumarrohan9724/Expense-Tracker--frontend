import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" />;
  return element;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={<ProtectedRoute element={<Dashboard />} />} 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;