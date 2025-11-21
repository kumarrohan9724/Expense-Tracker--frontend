import React, { useState } from 'react';
import { 
  Container, Grid, Typography, Fab, Box, Dialog, DialogContent, 
  useTheme, useMediaQuery, Button, Stack 
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// Icons
import AddIcon from '@mui/icons-material/AddRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';

// Components
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import SpendingChart from '../components/Charts/SpendingChart';
import CategoryManager from '../components/Expenses/CategoryManager';

// Services
import { supabase } from '../services/supabaseClient';

export default function Dashboard() {
  // --- State Management ---
  const [isExpenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- Theme & Responsive Logic ---
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  // --- Handlers ---

  // Open Expense Form in "Add" mode
  const handleOpenAdd = () => {
    setExpenseToEdit(null); 
    setExpenseDialogOpen(true);
  };

  // Open Expense Form in "Edit" mode (passed to ExpenseList)
  const handleOpenEdit = (expense: any) => {
    setExpenseToEdit(expense); 
    setExpenseDialogOpen(true);
  };

  // Close Expense Dialog and reset state
  const handleCloseExpenseDialog = () => {
    setExpenseDialogOpen(false);
    // Wait for animation to finish before clearing data
    setTimeout(() => setExpenseToEdit(null), 200); 
  };
  
  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setIsLoggingOut(false);
  };

 return (
  <>
    {/* --- Background Ambience (The "Crazy" Blob) --- */}
    <Box 
      sx={{ 
        position: 'fixed', 
        top: -150, 
        left: -150, 
        width: '500px', 
        height: '500px', 
        background: theme.palette.primary.main, 
        filter: 'blur(180px)', 
        opacity: 0.3, 
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />

    <Container maxWidth="lg" sx={{ mt: 4, pb: 12 }}>

      {/* --- Header Section --- */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'start', sm: 'center' }, 
          gap: 2, 
          mb: 5 
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track, analyze, and manage your wealth.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />} 
            onClick={() => setCategoryOpen(true)}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.1)', 
              color: 'text.secondary', 
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': { 
                borderColor: theme.palette.secondary.main, 
                color: theme.palette.secondary.main,
                background: 'rgba(236, 72, 153, 0.05)'
              }
            }}
          >
            Categories
          </Button>

          <LoadingButton 
            loading={isLoggingOut} 
            onClick={handleLogout} 
            variant="outlined" 
            startIcon={<LogoutIcon />} 
            sx={{
              borderColor: 'rgba(255,255,255,0.1)', 
              color: 'text.secondary',
              borderRadius: 3, 
              textTransform: 'none',
              '&:hover': { 
                borderColor: theme.palette.primary.main, 
                color: theme.palette.primary.main,
                background: 'rgba(139, 92, 246, 0.05)'
              }
            }}
          >
            Sign Out
          </LoadingButton>
        </Stack>
      </Box>

      {/* --- Main Layout (Flex instead of Grid) --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}
      >

        {/* Left Column - Charts */}
        <Box sx={{ flex: 7 }}>
          <SpendingChart />
        </Box>

        {/* Right Column - Recent Activity */}
        <Box sx={{ flex: 5 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Activity
            </Typography>
          </Box>

          <ExpenseList onEditExpense={handleOpenEdit} />
        </Box>

      </Box>

      {/* --- Floating Add Button --- */}
      <Fab 
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32, 
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
          '&:hover': { 
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.7)',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.3s ease'
        }} 
        onClick={handleOpenAdd}
      >
        <AddIcon sx={{ color: 'white', fontSize: 32 }} />
      </Fab>

      {/* Expense Dialog */}
      <Dialog 
        open={isExpenseDialogOpen}
        onClose={handleCloseExpenseDialog}
        fullScreen={fullScreenDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            backgroundImage: 'none', 
            backdropFilter: 'blur(20px)', 
            backgroundColor: 'rgba(24, 24, 27, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: fullScreenDialog ? 0 : 4
          } 
        }}
      >
        <DialogContent sx={{ p: fullScreenDialog ? 3 : 5 }}>
          <ExpenseForm onClose={handleCloseExpenseDialog} expenseToEdit={expenseToEdit} />
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
            backgroundImage: 'none', 
            backdropFilter: 'blur(20px)', 
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4
          } 
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <CategoryManager />
        </DialogContent>
      </Dialog>

    </Container>
  </>
);

}