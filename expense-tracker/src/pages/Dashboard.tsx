import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';

import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import SpendingChart from '../components/Charts/SpendingChart';
import { supabase } from '../services/supabaseClient';

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="outlined" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3, // spacing between left and right
        }}
      >
        {/* Left: Chart */}
        <Box sx={{ flex: 2 }}>
          <SpendingChart />
        </Box>

        {/* Right: Recent Transactions */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Transactions
          </Typography>
          <ExpenseList />
        </Box>
      </Box>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Add Expense Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            New Expense
          </Typography>
          <ExpenseForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
