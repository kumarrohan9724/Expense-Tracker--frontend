import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import { keyframes } from '@emotion/react';

// Icons
import AddIcon from '@mui/icons-material/AddRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';

// Components
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import CategoryManager from '../components/Expenses/CategoryManager';
import ExpenseAnalytics from '../components/Expenses/ExpenseAnalytics';
import { useExpenses } from '../hooks/useExpenses';

// Supabase
import { supabase } from '../services/supabaseClient';

// Animations
const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const subtlePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const iconHover = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const textShimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

// -------------------------
// MAIN COMPONENT
// -------------------------
export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: expenses = [] } = useExpenses();

  // UI State
  const [isExpenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handlers
  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setExpenseDialogOpen(true);
  };

  const handleOpenEdit = (expense: any) => {
    setExpenseToEdit(expense);
    setExpenseDialogOpen(true);
  };

  const handleCloseExpenseDialog = () => {
    setExpenseDialogOpen(false);
    setTimeout(() => setExpenseToEdit(null), 200);
  };

  // 🚀 Logout happens instantly
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setIsLoggingOut(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        pt: 2,
        pb: 4,
        color: '#fff',
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ px: { xs: 2, sm: 3, md: 4 } }}
      >
        
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            animation: mounted ? `${fadeInUp} 0.5s ease-out` : 'none',
          }}
        >
          {/* Left Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                width: 40,
                height: 40,
                animation: `${subtlePulse} 3s ease-in-out infinite`,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 20 }} />
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff 0%, #8B5CF6 100%)',
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textShimmer} 3s linear infinite`,
                }}
              >
                FinTrack
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Track your expenses
              </Typography>
            </Box>
          </Box>

          {/* Right Buttons */}
          <Stack direction="row" spacing={1}>

            {/* Category Button */}
            <Tooltip title="Manage Categories">
              <IconButton
                onClick={() => setCategoryOpen(true)}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6',
                    animation: `${iconHover} 0.3s ease`,
                  },
                }}
              >
                <CategoryIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* 🚀 Instant Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                disabled={isLoggingOut}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    animation: `${iconHover} 0.3s ease`,
                  },
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

          </Stack>
        </Box>

        {/* Analytics */}
        <Box sx={{ animation: mounted ? `${fadeInUp} 0.5s ease-out 0.1s both` : 'none', mb: 3 }}>
          <ExpenseAnalytics />
        </Box>

        {/* List */}
        <Box sx={{ animation: mounted ? `${fadeInUp} 0.5s ease-out 0.2s both` : 'none' }}>
          <ExpenseList onEditExpense={handleOpenEdit} />
        </Box>

      </Container>

      {/* Add FAB */}
      <Tooltip title="Add New Expense">
        <Fab
          onClick={handleOpenAdd}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            animation: `${subtlePulse} 2s ease-in-out infinite`,
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Expense Dialog */}
      <Dialog
        open={isExpenseDialogOpen}
        onClose={handleCloseExpenseDialog}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#1e293b',
            borderRadius: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <ExpenseForm
            onClose={handleCloseExpenseDialog}
            expenseToEdit={expenseToEdit}
          />
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog
        open={isCategoryOpen}
        onClose={() => setCategoryOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: '#1e293b',
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <CategoryManager />
        </DialogContent>
      </Dialog>

    </Box>
  );
}
