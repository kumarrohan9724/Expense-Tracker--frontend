import React from 'react';
import { Paper, Typography, Box, IconButton, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOfferRounded';
import { format } from 'date-fns';

interface ExpenseCardProps {
  expense: any;
  onEdit: (expense: any) => void;
  onDelete: (id: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -100 },
  hover: { 
    scale: 1.02,
    boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.5)' 
  }
};

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const categoryName = expense.categories?.name || 'Uncategorized';
  const formattedDate = format(new Date(expense.date), 'MMM dd, yyyy');

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 120 }}  // ✅ FIXED
      layout
    >
      <Paper sx={{ p: 2.5, mb: 2, position: 'relative', overflow: 'hidden' }}>
        
        {/* Accent bar */}
        <Box 
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '6px',
            background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)'
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {expense.description}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Chip
                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                label={categoryName}
                size="small"
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#A78BFA',
                  fontWeight: 500
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
            </Stack>
          </Box>

          <Stack alignItems="flex-end">
            <Typography
              variant="h5"
              color="primary.light"
              sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              ${Number(expense.amount).toFixed(2)}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                mt: 1,
                opacity: { xs: 1, md: 0.7 },
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 }
              }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(expense)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', background: 'rgba(139,92,246,0.1)' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => onDelete(expense.id)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', background: 'rgba(236,72,153,0.1)' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
};

export default ExpenseCard;
