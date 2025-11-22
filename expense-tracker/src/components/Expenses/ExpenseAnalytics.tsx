import React, { useMemo } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  useTheme, 
  Avatar, 
  alpha,
  LinearProgress
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
import { Expense } from '../../types';

// --- Helpers ---
function calculateMetrics(expenses: Expense[]) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  
  const catCounts: Record<string, number> = {};
  expenses.forEach(e => {
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

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];

// --- Components ---

const StatCard = ({ title, value, subValue, icon, color }: any) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      minHeight: 140, // Ensure consistent height
      borderRadius: 3,
      border: '1px solid',
      borderColor: alpha(color, 0.2),
      background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.01)} 100%)`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 10px 30px -10px ${alpha(color, 0.3)}`
      }
    }}
  >
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
      <Avatar variant="rounded" sx={{ bgcolor: alpha(color, 0.15), color: color, width: 48, height: 48 }}>
        {icon}
      </Avatar>
      {subValue && (
        <Typography variant="caption" sx={{ color: alpha(color, 0.8), fontWeight: 600, bgcolor: alpha(color, 0.1), px: 1, py: 0.5, borderRadius: 1 }}>
          {subValue}
        </Typography>
      )}
    </Stack>
    <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight={700} sx={{ color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px' }}>
      {value}
    </Typography>
  </Paper>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.9)', p: 1.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, backdropFilter: 'blur(4px)' }}>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>
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
  
  const metrics = useMemo(() => calculateMetrics(expenses), [expenses]);
  const categoryData = useMemo(() => getCategoryData(expenses), [expenses]);
  const monthlyData = useMemo(() => getMonthlyData(expenses), [expenses]);

  return (
    <Box sx={{ mb: 6, mt: 2 }}>
      
      {/* Header */}
      {/* <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.5))', webkitBackgroundClip: 'text', webkitTextFillColor: 'transparent' }}>
            Financial Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time metrics and spending analysis
          </Typography>
        </Box>
      </Stack> */}

      {/* 1. Top Stats Row (Replaced Grid with Stack) */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        mb={4}
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

      {/* 2. Charts Row (Replaced Grid with Stack) */}
      <Stack 
        direction={{ xs: 'column', lg: 'row' }} 
        spacing={3}
      >
        
        {/* Monthly Trend (Takes more space on large screens) */}
        <Box flex={2}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Spending Trend</Typography>
                <Typography variant="caption" color="text.secondary">Monthly aggregation</Typography>
              </Box>
            </Stack>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Category Breakdown */}
        <Box flex={1}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Categories</Typography>
            
            <Box sx={{ height: 200, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography variant="h6" fontWeight={700}>₹{metrics.total > 1000 ? `${(metrics.total/1000).toFixed(1)}k` : metrics.total}</Typography>
              </Box>
            </Box>

            <Stack spacing={2} mt={2} sx={{ maxHeight: 150, overflowY: 'auto', pr: 1 }}>
              {categoryData.map((entry, index) => (
                <Box key={entry.name}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                      <Typography variant="body2" color="text.secondary">{entry.name}</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600}>₹{entry.value.toFixed(0)}</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={(entry.value / metrics.total) * 100} 
                    sx={{ 
                      height: 4, 
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