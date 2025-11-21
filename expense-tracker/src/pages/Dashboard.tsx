import React, { useState } from 'react';
import { 
  Container, Typography, Fab, Box, Dialog, DialogContent, 
  useTheme, useMediaQuery, Button, Stack, Divider, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Tooltip, IconButton, 
  Paper 
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { keyframes } from '@emotion/react';

// TypeScript Types for MUI Icons
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// Icons
import AddIcon from '@mui/icons-material/AddRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import AnalyticsIcon from '@mui/icons-material/AnalyticsRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import DownloadIcon from '@mui/icons-material/DownloadRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Components (Assuming these are available in your project)
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import SpendingChart from '../components/Charts/SpendingChart';
import CategoryManager from '../components/Expenses/CategoryManager';
import ExpenseAnalytics from '../components/Expenses/ExpenseAnalytics';

// Services
import { supabase } from '../services/supabaseClient';


// --- ANIMATION KEYFRAMES ---
const blobMovement = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(50px, -40px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
`;
const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;
const fadeInTop = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- CONSTANTS ---
const DRAWER_WIDTH = 240;
const NAV_ITEMS = [
  { text: 'Dashboard', icon: DashboardIcon },
  { text: 'Analytics', icon: AnalyticsIcon },
];

// Dummy data for AnalyticsCards


// --- ANALYTICS CARD COMPONENT (With TypeScript interface fix) ---
interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>; 
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon: Icon }) => (
  <Paper 
    elevation={10} 
    sx={{ 
      p: 3, 
      borderRadius: 4, 
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'left',
      color: '#fff',
      transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 40px rgba(118, 75, 162, 0.4)',
      }
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ p: 1.5, borderRadius: '50%', background: 'rgba(118, 75, 162, 0.5)' }}>
        <Icon sx={{ color: '#fff' }} />
      </Box>
      <Box>
        <Typography variant="body2" color="rgba(255,255,255,0.7)">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);
// --------------------------------------------------------------------


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  // --- State Management ---
  const [isExpenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 

  // --- Theme & Responsive Logic ---
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // --- Handlers ---
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
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setIsLoggingOut(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleExportCSV = async () => {
    setIsExporting(true);
    // Simulate API call/data processing time
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    alert('Data successfully exported to CSV!'); 
    setIsExporting(false);
  };


  // --- Sidebar Content ---
  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        p: 2,
        animation: isMobile ? 'none' : `${fadeInRight} 0.5s ease-out`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, mb: 3 }}>
        <AccountBalanceWalletIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          FinTrack
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ flexGrow: 1 }}>
        {NAV_ITEMS.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => setActiveTab(item.text.toLowerCase() as 'dashboard' | 'analytics')}
              selected={activeTab === item.text.toLowerCase()}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { background: 'rgba(118, 75, 162, 0.2)' },
                ...(activeTab === item.text.toLowerCase() && {
                    background: 'linear-gradient(90deg, rgba(118, 75, 162, 0.3) 0%, rgba(118, 75, 162, 0) 100%)',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                })
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon sx={{ color: activeTab === item.text.toLowerCase() ? theme.palette.primary.main : 'rgba(255,255,255,0.7)' }} />
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ pb: 1 }}>
        <Button 
          fullWidth
          variant="outlined" 
          startIcon={<SettingsIcon />} 
          onClick={() => setCategoryOpen(true)}
          sx={{ 
            mb: 1,
            borderColor: 'rgba(255,255,255,0.1)', 
            color: 'text.secondary', 
            borderRadius: 3,
            textTransform: 'none',
            '&:hover': { 
              borderColor: theme.palette.secondary.main, 
              color: theme.palette.secondary.main,
              background: 'rgba(236, 72, 153, 0.1)'
            }
          }}
        >
          Manage Categories
        </Button>
        <LoadingButton 
          fullWidth
          loading={isLoggingOut} 
          onClick={handleLogout} 
          variant="contained" 
          endIcon={<LogoutIcon />} 
          sx={{
            borderRadius: 3, 
            textTransform: 'none',
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF416C 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 65, 108, .3)',
          }}
        >
          Sign Out
        </LoadingButton>
      </Box>
    </Box>
  );

 return (
  <Box sx={{ display: 'flex', minHeight: '100vh', color: '#fff' }}>
    {/* --- Full Background (Deep Gradient & Animated Blobs) --- */}
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        zIndex: -2,
        overflow: 'hidden'
      }} 
    >
      {/* Animated Blob 1 */}
      <Box sx={{
        position: 'absolute',
        top: '-10%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(118,75,162,0.3) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
        animation: `${blobMovement} 15s infinite alternate ease-in-out`,
      }} />
      {/* Animated Blob 2 */}
      <Box sx={{
        position: 'absolute',
        bottom: '-10%', right: '-10%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(102,126,234,0.3) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
        animation: `${blobMovement} 20s infinite alternate-reverse ease-in-out`,
      }} />
    </Box>

    {/* --- Sidebar (Desktop) --- */}
    <Box
      component="nav"
      sx={{ 
        width: { md: DRAWER_WIDTH }, 
        flexShrink: { md: 0 },
        display: isMobile ? 'none' : 'block'
      }}
    >
      <Box sx={{ width: DRAWER_WIDTH, height: '100vh', position: 'fixed' }}>
        {drawer}
      </Box>
    </Box>
    
    {/* --- Mobile Drawer (Temporary Sidebar) --- */}
    <Dialog 
      open={mobileOpen}
      onClose={handleDrawerToggle}
      fullScreen={isMobile}
      maxWidth="xs"
      PaperProps={{
        sx: { 
          width: DRAWER_WIDTH, 
          height: '100vh', 
          m: 0, 
          background: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {drawer}
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Dialog>


    {/* --- Main Content Area --- */}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
      }}
    >
      {/* --- Top Header (Visible on Mobile) --- */}
      <Box 
        sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          animation: `${fadeInTop} 0.5s ease-out`
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          FinTrack
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* --- Main Content Switcher --- */}
      {activeTab === 'analytics' ? (
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Box sx={{ mb: 5 }}>
            <ExpenseAnalytics />
          </Box>
        </Container>
      ) : (
        <Container maxWidth="xl" sx={{ p: 0 }}>
          {/* Analytics Header & Export */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4, 
              mt: { xs: 0, md: 3 },
              animation: `${fadeInTop} 0.7s ease-out`
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
              Overview
            </Typography>
            <LoadingButton 
              loading={isExporting}
              startIcon={!isExporting && <DownloadIcon />} 
              onClick={handleExportCSV}
              variant="contained" 
              sx={{
                background: 'linear-gradient(45deg, #10B981 30%, #06B6D4 90%)',
                borderRadius: 3, 
                textTransform: 'none',
              }}
            >
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </LoadingButton>
          </Box>
          <Divider sx={{ mb: 5, borderColor: 'rgba(255,255,255,0.1)' }} />
          {/* --- Charts and Activity (Two-Column Flex Layout) --- */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 4
            }}
          >
            {/* Left Column - Spending Chart */}
            <Box 
              sx={{ 
                flex: '7', 
                minWidth: { md: '60%' }, 
                animation: `${fadeInRight} 0.7s ease-out 0.4s both` 
              }}
            >
              <Paper 
                elevation={10} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minHeight: 400
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Spending Trends
                </Typography>
                <SpendingChart />
              </Paper>
            </Box>
            {/* Right Column - Recent Activity List */}
            <Box 
              sx={{ 
                flex: '5', 
                minWidth: { md: '40%' }, 
                animation: `${fadeInRight} 0.7s ease-out 0.6s both` 
              }}
            >
              <Paper 
                elevation={10} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minHeight: 400
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Activity
                </Typography>
                <ExpenseList onEditExpense={handleOpenEdit} />
              </Paper>
            </Box>
          </Box>
        </Container>
      )}
    </Box>

    {/* --- Floating Add Button --- */}
    <Tooltip title="Add New Expense" placement="left">
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
            transform: 'scale(1.1) rotate(5deg)'
          },
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }} 
        onClick={handleOpenAdd}
      >
        <AddIcon sx={{ color: 'white', fontSize: 32 }} />
      </Fab>
    </Tooltip>

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
  </Box>
);
}