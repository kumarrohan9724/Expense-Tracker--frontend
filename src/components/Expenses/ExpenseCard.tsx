import React from 'react';
import { Paper, Typography, Box, IconButton, Chip, Stack, Divider } from '@mui/material';
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
    scale: 1.01, // Reduced scale slightly for better feel on touch
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
      transition={{ type: "spring", stiffness: 120 }}
      layout
    >
      <Paper 
        sx={{ 
            p: { xs: 2, sm: 2.5 }, // Slightly tighter padding on mobile
            mb: 2, 
            position: 'relative', 
            overflow: 'hidden',
            borderRadius: 2
        }}
      >
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

        {/* Main Content Stack: Column on Mobile, Row on Desktop */}
        <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={{ xs: 2, sm: 0 }} // Add spacing between vertically stacked items on mobile
        >
          
          {/* LEFT SIDE: Info */}
          <Box sx={{ ml: { xs: 1, sm: 2 }, flex: 1 }}>
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '1rem', sm: '1.25rem' }, // Smaller font on mobile
                    wordBreak: 'break-word',
                    lineHeight: 1.3
                }}
            >
              {expense.description}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
              <Chip
                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                label={categoryName}
                size="small"
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#A78BFA',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  mb: { xs: 0.5, sm: 0 } // Handle wrapping spacing
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {formattedDate}
              </Typography>
            </Stack>
          </Box>

          {/* MOBILE DIVIDER (Visual separation on phones only) */}
          <Divider sx={{ display: { xs: 'block', sm: 'none' }, opacity: 0.1 }} />

          {/* RIGHT SIDE: Amount & Actions */}
          <Stack 
            // On Mobile: Row (Amount Left, Actions Right)
            // On Desktop: Column (Amount Top, Actions Bottom)
            direction={{ xs: 'row', sm: 'column' }} 
            alignItems={{ xs: 'center', sm: 'flex-end' }}
            justifyContent={{ xs: 'space-between', sm: 'center' }}
          >
            <Typography
              variant="h5"
              color="primary.light"
              sx={{ fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
            >
              ${Number(expense.amount).toFixed(2)}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: { xs: 0, sm: 1 },
                // Always visible on mobile (opacity 1), hover effect on desktop
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
                  // Larger touch target on mobile
                  p: { xs: 1, sm: 0.5 },
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
                  // Larger touch target on mobile
                  p: { xs: 1, sm: 0.5 },
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