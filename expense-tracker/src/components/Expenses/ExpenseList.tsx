import React from 'react';
import { List, Typography, Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses, useDeleteExpense } from '../../hooks/useExpenses';
import ExpenseCard from './ExpenseCard';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

interface Props {
  onEditExpense: (expense: any) => void;
}

export default function ExpenseList({ onEditExpense }: Props) {
  const { data: expenses, isLoading, error } = useExpenses();
  const deleteExpense = useDeleteExpense();

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this?')) {
      deleteExpense.mutate(id);
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="secondary" /></Box>;
  if (error) return <Typography color="error">Error loading expenses.</Typography>;
  if (!expenses || expenses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4, opacity: 0.7 }}>
            <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No expenses yet.</Typography>
            <Typography variant="body2" color="text.secondary">Time to spend some money!</Typography>
        </Box>
      )
  }

  return (
    <List sx={{ p: 0 }}>
      <AnimatePresence mode='popLayout'>
        {expenses.map((expense: any) => (
          <ExpenseCard 
            key={expense.id} 
            expense={expense} 
            onEdit={onEditExpense} 
            onDelete={handleDelete}
          />
        ))}
      </AnimatePresence>
    </List>
  );
}