import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../../hooks/useExpenses';
import { Paper, Typography } from '@mui/material';

export default function SpendingChart() {
  const { data: expenses } = useExpenses();

  // Simple aggregation logic
  const data = expenses?.reduce((acc: any[], curr: any) => {
    const found = acc.find(i => i.date === curr.date);
    if (found) found.amount += curr.amount;
    else acc.push({ date: curr.date, amount: curr.amount });
    return acc;
  }, []) || [];

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>Spending Trends</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}