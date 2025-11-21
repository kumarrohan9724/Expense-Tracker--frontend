import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { Paper, Typography, Box, Divider, Stack, Chip, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

import { Expense } from '../types';

function getSummary(expenses: Expense[]): { total: number; avg: number; max: number; min: number } {
  const total = expenses.reduce((sum: number, e: Expense) => sum + Number(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;
  const max = Math.max(...expenses.map((e: Expense) => Number(e.amount)), 0);
  const min = Math.min(...expenses.map((e: Expense) => Number(e.amount)), 0);
  return { total, avg, max, min };
}

function getCategoryBreakdown(expenses: Expense[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e: Expense) => {
    const cat = (e as any).categories?.name || 'Uncategorized';
    map[cat] = (map[cat] || 0) + Number(e.amount);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function getMonthlyBreakdown(expenses: Expense[]): { month: string; value: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e: Expense) => {
    const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    map[month] = (map[month] || 0) + Number(e.amount);
  });
  return Object.entries(map).map(([month, value]) => ({ month, value }));
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e42', '#f43f5e', '#0ea5e9', '#a3e635', '#fbbf24'];

export default function ExpenseAnalytics() {
  const theme = useTheme();
  const { data: expenses = [], isLoading } = useExpenses();
  const summary = getSummary(expenses);
  const categoryData = getCategoryBreakdown(expenses);
  const monthlyData = getMonthlyBreakdown(expenses);

  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', mb: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Expense Data Analysis
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mb={3}>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" mb={1}>Total Spent</Typography>
          <Chip icon={<PaidIcon />} label={`₹${summary.total.toFixed(2)}`} color="primary" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" mb={1}>Average Expense</Typography>
          <Chip icon={<TrendingUpIcon />} label={`₹${summary.avg.toFixed(2)}`} color="secondary" sx={{ fontWeight: 700, fontSize: 18, mb: 1 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" mb={1}>Highest Expense</Typography>
          <Chip icon={<TrendingUpIcon />} label={`₹${summary.max.toFixed(2)}`} sx={{ fontWeight: 700, fontSize: 18, mb: 1, bgcolor: '#f43f5e', color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" mb={1}>Lowest Expense</Typography>
          <Chip icon={<TrendingUpIcon />} label={`₹${summary.min.toFixed(2)}`} sx={{ fontWeight: 700, fontSize: 18, mb: 1, bgcolor: '#10b981', color: '#fff' }} />
        </Box>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" mb={1} color="primary">Category Breakdown</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" mb={1} color="primary">Monthly Breakdown</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.secondary.main} radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Paper>
  );
}
