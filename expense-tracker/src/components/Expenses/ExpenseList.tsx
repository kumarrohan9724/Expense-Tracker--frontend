import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '../../hooks/useExpenses';

const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

export default function ExpenseList() {
  const { data: expenses, isLoading } = useExpenses();

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <List component={motion.ul} variants={listVariants} initial="hidden" animate="visible">
      <AnimatePresence>
        {expenses?.map((expense: any) => (
          <motion.div key={expense.id} variants={itemVariants} layout exit={{ opacity: 0, x: 100 }}>
            <Paper sx={{ mb: 2, p: 1 }}>
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText 
                  primary={expense.description} 
                  secondary={expense.date} 
                />
                <Typography variant="h6" color="secondary">
                  ${expense.amount}
                </Typography>
              </ListItem>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  );
}