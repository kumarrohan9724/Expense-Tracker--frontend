import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import { keyframes } from '@emotion/react';

// Icons
import AddIcon from '@mui/icons-material/AddRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WalletIcon from '@mui/icons-material/Wallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import DownloadIcon from '@mui/icons-material/DownloadRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';

// Components (Ensure these paths are correct in your project)
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import SpendingChart from '../components/Charts/SpendingChart';
import CategoryManager from '../components/Expenses/CategoryManager';
import ExpenseAnalytics from '../components/Expenses/ExpenseAnalytics';
import { useExpenses } from '../hooks/useExpenses'; // Hook for data fetching

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ---
// KPICard Component (Helper)
// ---
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, trendPositive }) => (
  <Paper
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: 3,
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(139,92,246,0.12)',
      },
      height: '100%',
    }}
  >
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ color: '#8B5CF6' }}>{icon}</Box>
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
        {value}
      </Typography>
      {trend && (
        <Typography
          variant="caption"
          sx={{ color: trendPositive ? '#10B981' : '#EF4444', fontWeight: 600 }}
        >
          {trendPositive ? '↑' : '↓'} {trend}
        </Typography>
      )}
    </Stack>
  </Paper>
);

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
  const [isExporting, setIsExporting] = useState(false);

  // Calculate KPI values
  const totalSpent = expenses.reduce((acc: number, exp: any) => acc + (Number(exp.amount) || 0), 0);
  const thisMonth = new Date().getMonth();
  const monthlySpent = expenses.filter(
    (exp: any) => new Date(exp.date).getMonth() === thisMonth
  ).reduce((acc: number, exp: any) => acc + (Number(exp.amount) || 0), 0);
  const averageTransaction = expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : '0.00';

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

  const handleExportCSV = async () => {
    setIsExporting(true);
    // Simulate API call or file generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Exporting data:', expenses);
    alert('Data successfully exported to CSV!');
    setIsExporting(false);
  };

  return (
    // Outer Box for dark background and min height
    <Box
      sx={{
        backgroundColor: '#0f172a', // Dark background for professional aesthetic
        minHeight: '100vh',
        pt: { xs: 2, md: 4 },
        pb: 4,
        color: '#fff',
      }}
    >
      {/* Container setup for 100% width but with responsive padding */}
      <Container 
        maxWidth={false} // Key change: removes max-width to use full screen width
        sx={{ px: { xs: 2, sm: 3, md: 4 } }} // Adds crucial padding on sides
      >
        
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 5,
            animation: `${fadeInUp} 0.6s ease-out`,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '-1px',
                mb: 0.5,
              }}
            >
              Expense Dashboard 📊
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Track and manage your expenses efficiently
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setCategoryOpen(true)}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#8B5CF6',
                  background: 'rgba(139,92,246,0.1)',
                },
              }}
            >
              Categories
            </Button>
            {/* Standard Button using the 'loading' prop */}
            <Button
              loading={isExporting as any} 
              startIcon={!isExporting && <DownloadIcon />}
              onClick={handleExportCSV}
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  opacity: 0.9,
                }
              }}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </Stack>
        </Box>

        {/* KPI Cards Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 5,
            animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
          }}
        >
          <KPICard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            icon={<WalletIcon />}
            trend={expenses.length + ' transactions'}
          />
          <KPICard
            title="This Month"
            value={`$${monthlySpent.toFixed(2)}`}
            icon={<TimelineIcon />}
            trend={monthlySpent === 0 ? 'No data' : `vs. last month`}
            trendPositive={monthlySpent > 500}
          />
          <KPICard
            title="Avg. Transaction"
            value={`$${averageTransaction}`}
            icon={<TrendingUpIcon />}
            trend={`Over ${expenses.length} entries`}
          />
          <KPICard
            title="Total Entries"
            value={expenses.length}
            icon={<TimelineIcon />}
            trend={'All-time count'}
          />
        </Box>

        {/* Main Content Grid (Chart and List) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: 3,
            animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
          }}
        >
          {/* Left Column - Chart */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              minHeight: 400,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2.5, color: '#fff' }}
            >
              Spending Trends 📈
            </Typography>
            <SpendingChart />
          </Paper>

          {/* Right Column - Recent Activity */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2.5, color: '#fff' }}
            >
              Recent Activity 💸
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: { md: 350 } }}>
              <ExpenseList onEditExpense={handleOpenEdit} />
            </Box>
          </Paper>
        </Box>

        {/* Analytics Section */}
        <Box sx={{ mt: 5, animation: `${fadeInUp} 0.6s ease-out 0.3s both` }}>
          <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: '#fff' }}
          >
            Detailed Analytics
          </Typography>
          <ExpenseAnalytics />
        </Box>
      </Container>

      {/* Floating Action Button */}
      <Tooltip title="Add New Expense" placement="left">
        <Fab
          color="primary"
          onClick={handleOpenAdd}
          sx={{
            position: 'fixed',
            bottom: { xs: 24, md: 32 },
            right: { xs: 16, md: 32 },
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            '&:hover': {
              boxShadow: '0 12px 48px rgba(139,92,246,0.4)',
              transform: 'scale(1.1)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>

      {/* Dialogs - Expense Form */}
      <Dialog
        open={isExpenseDialogOpen}
        onClose={handleCloseExpenseDialog}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(24,24,27,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.12)',
            borderRadius: isMobile ? 0 : 3,
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
          <ExpenseForm
            onClose={handleCloseExpenseDialog}
            expenseToEdit={expenseToEdit}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogs - Category Manager */}
      <Dialog
        open={isCategoryOpen}
        onClose={() => setCategoryOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'rgba(24,24,27,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.12)',
            borderRadius: 3,
          },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <CategoryManager />
        </DialogContent>
      </Dialog>
    </Box>
  );
}