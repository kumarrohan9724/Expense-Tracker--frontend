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
  Menu,
  MenuItem,
} from '@mui/material';
import { keyframes } from '@emotion/react';

// Icons
import AddIcon from '@mui/icons-material/AddRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';

// Components
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import CategoryManager from '../components/Expenses/CategoryManager';
import ExpenseAnalytics from '../components/Expenses/ExpenseAnalytics';
import { useExpenses } from '../hooks/useExpenses';

// Supabase
import { supabase } from '../services/supabaseClient';

// Clean Animations
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

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(15px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
`;

const textShimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const iconHover = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

// ---
// Dashboard Component (Main)
// ---
export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: expenses = [] } = useExpenses();

  // State Management
  const [isExpenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
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

  const handleLogoutClick = (event: React.MouseEvent<HTMLElement>) => {
    setLogoutAnchor(event.currentTarget);
  };

  const handleLogoutClose = () => {
    setLogoutAnchor(null);
  };

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
        
        {/* Compact Clean Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            animation: mounted ? `${fadeInUp} 0.5s ease-out` : 'none',
          }}
        >
          {/* Left: Logo and Title */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
            }}
          >
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
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Track your expenses
              </Typography>
            </Box>
          </Box>

          {/* Right: Action Buttons */}
          <Stack direction="row" spacing={1}>
            {/* Categories Button */}
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

            {/* Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogoutClick}
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

        {/* Analytics Section */}
        <Box sx={{ 
          animation: mounted ? `${fadeInUp} 0.5s ease-out 0.1s both` : 'none',
          mb: 3,
        }}>
          <ExpenseAnalytics />
        </Box>

        {/* Expense List */}
        <Box sx={{ 
          animation: mounted ? `${fadeInUp} 0.5s ease-out 0.2s both` : 'none',
        }}>
          <ExpenseList onEditExpense={handleOpenEdit} />
        </Box>

      </Container>

      {/* Floating Action Button */}
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
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Logout Menu */}
      <Menu
        anchorEl={logoutAnchor}
        open={Boolean(logoutAnchor)}
        onClose={handleLogoutClose}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            mt: 1,
            '& .MuiMenuItem-root': {
              color: '#fff',
              fontSize: '0.875rem',
              '&:hover': {
                background: 'rgba(255,255,255,0.05)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleLogoutClose}>
          <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
          Profile
        </MenuItem>
        <MenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            color: '#EF4444',
          }}
        >
          <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </MenuItem>
      </Menu>

      {/* Dialogs */}
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