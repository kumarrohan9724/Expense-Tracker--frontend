// src/components/AnalyticsChart.tsx
'use client'
import { Box, Text, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6C63FF', '#38A169', '#FFBB28', '#E53E3E', '#00C49F'];

const MotionBox = motion(Box);

export default function AnalyticsChart({ transactions }: { transactions: any[] }) {
    
  // --- Data Preparation ---
  const expenseData = transactions.filter(t => t.type === 'expense');

  // 1. Spending Distribution Data (Pie Chart)
  const categoryData = expenseData.reduce((acc: any[], curr) => {
    const found = acc.find(i => i.name === curr.category);
    if (found) found.value += parseFloat(curr.amount);
    else acc.push({ name: curr.category, value: parseFloat(curr.amount) });
    return acc;
  }, []);

  // 2. Monthly Trend Data (Bar Chart)
  const monthlyDataMap = expenseData.reduce((acc: Map<string, number>, curr) => {
    const monthYear = new Date(curr.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    acc.set(monthYear, (acc.get(monthYear) || 0) + parseFloat(curr.amount));
    return acc;
  }, new Map());

  const monthlyTrendData = Array.from(monthlyDataMap, ([name, value]) => ({ name, value }));

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
      {/* Spending Distribution Pie Chart */}
      <MotionBox 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        boxShadow="lg" 
        height="400px"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>Spending Distribution</Text>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              labelLine={false}
              paddingAngle={2}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </MotionBox>

      {/* Monthly Trend Bar Chart */}
      <MotionBox 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        boxShadow="lg" 
        height="400px"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>Monthly Expense Trend</Text>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={monthlyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="gray.200" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Expense']} />
                <Legend />
                <Bar dataKey="value" name="Total Expense" fill="#E53E3E" />
            </BarChart>
        </ResponsiveContainer>
      </MotionBox>
    </SimpleGrid>
  );
}