import React, { useMemo, useState, useCallback } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import {
  Paper,
  Typography,
  Box,
  Stack,
  useTheme,
  Avatar,
  alpha,
  LinearProgress,
  ToggleButtonGroup, // Import ToggleButtonGroup
  ToggleButton, // Import ToggleButton
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongRounded';
import StarIcon from '@mui/icons-material/StarRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthRounded'; // New Icon
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayRounded'; // New Icon
import { Expense } from '../../types';

// --- Helpers (unchanged) ---
function calculateMetrics(expenses: Expense[]) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;

  const catCounts: Record<string, number> = {};
  expenses.forEach(e => {
    // Safely access nested category name
    const name = (e as any).categories?.name || 'Uncategorized';
    catCounts[name] = (catCounts[name] || 0) + 1;
  });
  const topCategory = Object.keys(catCounts).reduce((a, b) => catCounts[a] > catCounts[b] ? a : b, 'N/A');

  return { total, avg, count: expenses.length, topCategory };
}

function getCategoryData(expenses: Expense[]) {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    const cat = (e as any).categories?.name || 'Other';
    map[cat] = (map[cat] || 0) + Number(e.amount);
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function getMonthlyData(expenses: Expense[]) {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + Number(e.amount);
  });

  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => {
      const [year, month] = key.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        value
      };
    });
}

// --- NEW HELPER FUNCTION FOR DAILY DATA ---
function getDailyData(expenses: Expense[]) {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    // Format: YYYY-MM-DD for sorting and key
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + Number(e.amount);
  });

  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort by date
    .map(([key, value]) => {
      // Format X-axis label as DD/MM
      const dateParts = key.split('-');
      const name = `${dateParts[2]}/${dateParts[1]}`;
      return {
        name,
        value,
        dateKey: key // Keep the full date for more accurate tooltip/data inspection if needed
      };
    });
}
// --- END NEW HELPER FUNCTION ---

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];

// --- Components (unchanged except for use of ToggleButton/Tooltip) ---

// COMPACT StatCard (unchanged)
const StatCard = ({ title, value, subValue, icon, color }: any) => (
  <Paper
    elevation={0}
    sx={{
      p: 2, // Reduced padding
      height: '100%',
      minHeight: 120, // Reduced minHeight
      borderRadius: 2, // Slightly smaller border radius
      border: '1px solid',
      borderColor: alpha(color, 0.2),
      background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.01)} 100%)`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)', // Smaller lift on hover
        boxShadow: `0 8px 25px -8px ${alpha(color, 0.3)}`
      }
    }}
  >
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}> {/* Reduced bottom margin */}
      <Avatar variant="rounded" sx={{ bgcolor: alpha(color, 0.15), color: color, width: 40, height: 40 }}> {/* Smaller Avatar */}
        {icon}
      </Avatar>
      {subValue && (
        <Typography variant="caption" sx={{ color: alpha(color, 0.8), fontWeight: 600, bgcolor: alpha(color, 0.1), px: 0.8, py: 0.3, borderRadius: 1 }}> {/* Reduced subValue padding */}
          {subValue}
        </Typography>
      )}
    </Stack>
    <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom> {/* Smaller title variant */}
      {title}
    </Typography>
    <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px' }}> {/* Slightly smaller value variant */}
      {value}
    </Typography>
  </Paper>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.9)', p: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, backdropFilter: 'blur(4px)' }}> {/* Reduced padding/border radius */}
        <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>{label}</Typography>
        <Typography variant="body2" fontWeight={700} color="#fff">
          ₹{Number(payload[0].value).toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function ExpenseAnalytics() {
  const { data: expenses = [] } = useExpenses();

  // --- NEW STATE FOR VIEW TYPE ---
  const [viewType, setViewType] = useState<'month' | 'day'>('month');

  const handleViewChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: 'month' | 'day' | null) => {
      if (newView !== null) {
        setViewType(newView);
      }
    },
    []
  );
  // --- END NEW STATE ---

  const metrics = useMemo(() => calculateMetrics(expenses), [expenses]);
  const categoryData = useMemo(() => getCategoryData(expenses), [expenses]);
  const monthlyData = useMemo(() => getMonthlyData(expenses), [expenses]);
  // --- NEW MEMOIZED DAILY DATA ---
  const dailyData = useMemo(() => getDailyData(expenses), [expenses]);
  // --- END NEW MEMOIZED DAILY DATA ---

  // --- DATA SELECTION FOR CHART ---
  const chartData = viewType === 'month' ? monthlyData : dailyData;
  const subtitle = viewType === 'month' ? 'Monthly aggregation' : 'Daily aggregation';
  // --- END DATA SELECTION ---

  return (
    <Box sx={{ mb: 4, mt: 1 }}> {/* Reduced margins */}

      {/* 1. Top Stats Row (unchanged) */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2} // Reduced spacing
        mb={3} // Reduced margin bottom
      >
        <Box flex={1}>
          <StatCard
            title="TOTAL SPENT"
            value={`₹${metrics.total.toLocaleString()}`}
            icon={<AccountBalanceWalletIcon />}
            color="#8B5CF6"
          />
        </Box>
        <Box flex={1}>
          <StatCard
            title="AVG. TRANSACTION"
            value={`₹${metrics.avg.toFixed(0)}`}
            icon={<TrendingUpIcon />}
            color="#EC4899"
          />
        </Box>
        <Box flex={1}>
          <StatCard
            title="TOTAL TRANSACTIONS"
            value={metrics.count}
            icon={<ReceiptLongIcon />}
            color="#10B981"
          />
        </Box>
        <Box flex={1}>
          <StatCard
            title="TOP CATEGORY"
            value={metrics.topCategory}
            subValue="Most Frequent"
            icon={<StarIcon />}
            color="#F59E0B"
          />
        </Box>
      </Stack>

      {/* 2. Charts Row */}
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2} // Reduced spacing
      >

        {/* Monthly/Daily Trend */}
        <Box flex={2}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}> {/* Reduced padding/border radius */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}> {/* Reduced margin bottom */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>Spending Trend</Typography> {/* Smaller title variant */}
                <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
              </Box>

              {/* --- NEW TOGGLE BUTTON GROUP --- */}
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton 
                  value="month" 
                  aria-label="month view" 
                  sx={{ 
                    color: viewType === 'month' ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                    borderColor: viewType === 'month' ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                    '&.Mui-selected': { bgcolor: alpha('#8B5CF6', 0.1) },
                    '&:hover': { bgcolor: alpha('#8B5CF6', 0.05) }
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
                <ToggleButton 
                  value="day" 
                  aria-label="day view"
                  sx={{ 
                    color: viewType === 'day' ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                    borderColor: viewType === 'day' ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                    '&.Mui-selected': { bgcolor: alpha('#8B5CF6', 0.1) },
                    '&:hover': { bgcolor: alpha('#8B5CF6', 0.05) }
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
              </ToggleButtonGroup>
              {/* --- END NEW TOGGLE BUTTON GROUP --- */}

            </Stack>

            <ResponsiveContainer width="100%" height={250}> {/* Reduced height */}
              {/* --- USE chartData HERE --- */}
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} // Smaller font size
                  dy={10}
                  // --- Conditional XAxis Tick Formatting for Daily View ---
                  tickFormatter={
                    viewType === 'day' && chartData.length > 30 // Only show a subset of ticks if many days are present
                      ? (value, index) => (index % 7 === 0 ? value : '') 
                      : undefined
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} // Smaller font size
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={2} // Slightly thinner line
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Category Breakdown (unchanged) */}
        <Box flex={1}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}> {/* Reduced padding/border radius */}
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Categories</Typography> {/* Smaller title variant, reduced margin */}

            <Box sx={{ height: 180, position: 'relative' }}> {/* Reduced height */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50} // Smaller radius
                    outerRadius={70} // Smaller radius
                    paddingAngle={3} // Smaller padding angle
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>

                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="body1" fontWeight={700}>₹{metrics.total > 1000 ? `${(metrics.total/1000).toFixed(1)}k` : metrics.total}</Typography> {/* Smaller value variant */}
                </Box>
              </ResponsiveContainer>
            </Box>

            <Stack spacing={1} mt={2} sx={{ maxHeight: 150, overflowY: 'auto', pr: 0.5 }}> {/* Reduced spacing/padding */}
              {categoryData.map((entry, index) => (
                <Box key={entry.name}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.3}> {/* Reduced margin bottom */}
                    <Stack direction="row" alignItems="center" spacing={0.5}> {/* Reduced spacing */}
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} /> {/* Smaller indicator */}
                      <Typography variant="caption" color="text.secondary">{entry.name}</Typography> {/* Smaller text variant */}
                    </Stack>
                    <Typography variant="caption" fontWeight={600}>₹{entry.value.toFixed(0)}</Typography> {/* Smaller text variant */}
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(entry.value / metrics.total) * 100}
                    sx={{
                      height: 3, // Thinner progress bar
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { bgcolor: COLORS[index % COLORS.length] }
                    }}
                  />
                </Box>
              ))}
            </Stack>

          </Paper>
        </Box>

      </Stack>
    </Box>
  );
}