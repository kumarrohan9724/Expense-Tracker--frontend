import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Stack, 
  MenuItem, 
  Typography, 
  InputAdornment, 
  Box, 
  Divider 
} from '@mui/material';
import { useAddExpense, useUpdateExpense, useCategories } from '../../hooks/useExpenses';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoneyRounded';
import DescriptionIcon from '@mui/icons-material/DescriptionRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';

const schema = yup.object({
  description: yup.string().required('Description is required'),
  amount: yup.number().positive('Must be positive').required('Amount required'),
  date: yup.string().required('Date required'),
  category_id: yup.string().nullable(),
}).required();

interface Props {
  onClose: () => void;
  expenseToEdit?: any;
}

export default function ExpenseForm({ onClose, expenseToEdit }: Props) {
  const { data: categories } = useCategories();
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const isEditMode = !!expenseToEdit;

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
      amount: '' as any,
      date: new Date().toISOString().split('T')[0],
      category_id: '',
    }
  });

  useEffect(() => {
    if (expenseToEdit) {
      setValue('description', expenseToEdit.description);
      setValue('amount', expenseToEdit.amount);
      setValue('date', expenseToEdit.date);
      setValue('category_id', expenseToEdit.categories?.id?.toString() || '');
    }
  }, [expenseToEdit, setValue]);

  const onSubmit = (data: any) => {
    const payload = { ...data, amount: Number(data.amount) };
    
    if (isEditMode) {
        updateExpense.mutate({ id: expenseToEdit.id, ...payload }, {
            onSuccess: onClose
        });
    } else {
        addExpense.mutate(payload, {
            onSuccess: () => { reset(); onClose(); }
        });
    }
  };

  const isLoading = addExpense.isPending || updateExpense.isPending;

  // --- Custom Styles for "Classy/Formal" look ---
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)', // Very subtle background
      transition: 'all 0.2s ease-in-out',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        '& fieldset': { borderColor: '#8B5CF6', borderWidth: '1px' }, // Purple glow focus
      },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.4)' }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: 1 }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
            variant="h5" 
            sx={{
                fontWeight: 800, 
                letterSpacing: '-0.5px',
                background: 'linear-gradient(to right, #8B5CF6, #EC4899)', 
                webkitBackgroundClip: 'text', 
                webkitTextFillColor: 'transparent',
                mb: 0.5
            }}
        >
          {isEditMode ? 'Edit Transaction' : 'New Transaction'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
          {isEditMode ? 'Update the details below' : 'Enter the details of your purchase'}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              label="Description" 
              placeholder="e.g., Grocery Run, Netflix Subscription"
              fullWidth 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              variant="outlined"
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Amount & Category Row */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
           <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
              <TextField 
                  {...field} 
                  type="number" 
                  label="Amount" 
                  fullWidth 
                  error={!!fieldState.error} 
                  helperText={fieldState.error?.message} 
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                           <AttachMoneyIcon fontSize="small" />
                        </InputAdornment>
                      ),
                  }}
              />
              )}
          />
           <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
              <TextField 
                {...field} 
                select 
                label="Category" 
                fullWidth 
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                         <CategoryIcon fontSize="small" />
                      </InputAdornment>
                    ),
                }}
              >
                  <MenuItem value=""><em>Uncategorized</em></MenuItem>
                  {categories?.map((cat: any) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
              </TextField>
              )}
          />
        </Stack>

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField 
                {...field} 
                type="date" 
                fullWidth 
                variant="outlined" 
                label="Date" 
                sx={{
                    ...inputStyles,
                    // Fix for date icon color in some browsers
                    'input::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.5, cursor: 'pointer' }
                }}
                InputLabelProps={{ shrink: true }} 
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                         <CalendarTodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                }}
            />
          )}
        />

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
                onClick={onClose}
                variant="text" 
                startIcon={<CloseIcon />}
                sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
                Cancel
            </Button>
            
            <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={isLoading} 
                startIcon={!isLoading && <SaveIcon />}
                sx={{ 
                    px: 4,
                    background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.5)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.6)',
                    }
                }}
            >
                {isLoading ? 'Processing...' : isEditMode ? 'Update' : 'Save'}
            </Button>
        </Stack>
      </Stack>
    </Box>
  );
}