import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Stack, MenuItem, Typography, InputAdornment } from '@mui/material';
import { useAddExpense, useUpdateExpense, useCategories } from '../../hooks/useExpenses';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const schema = yup.object({
  description: yup.string().required('Description is required'),
  amount: yup.number().positive('Must be positive').required('Amount required'),
  date: yup.string().required('Date required'),
  category_id: yup.string().nullable(), // Can be null
}).required();

interface Props {
  onClose: () => void;
  expenseToEdit?: any; // Optional prop for edit mode
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
      amount: '' as any, // Initialize as empty string for UX
      date: new Date().toISOString().split('T')[0],
      category_id: '',
    }
  });

  // Populate form if in Edit Mode
  useEffect(() => {
    if (expenseToEdit) {
      setValue('description', expenseToEdit.description);
      setValue('amount', expenseToEdit.amount);
      setValue('date', expenseToEdit.date);
      // Handle null category_id safely
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

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h5" sx={{fontWeight: 700, background: 'linear-gradient(to right, #8B5CF6, #EC4899)', webkitBackgroundClip: 'text', webkitTextFillColor: 'transparent'}}>
        {isEditMode ? 'Edit Transaction' : 'New Transaction'}
      </Typography>
      
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField {...field} label="What was it for?" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} variant="filled" />
        )}
      />

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
                variant="filled"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon color="primary" /></InputAdornment>,
                }}
            />
            )}
        />
         <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
            <TextField {...field} select label="Category" fullWidth variant="filled">
                <MenuItem value=""><em>None</em></MenuItem>
                {categories?.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
            </TextField>
            )}
        />
      </Stack>

      <Controller
        name="date"
        control={control}
        render={({ field }) => <TextField {...field} type="date" fullWidth variant="filled" label="Date" InputLabelProps={{ shrink: true }} />}
      />

      <Button type="submit" variant="contained" size="large" disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? 'Saving...' : isEditMode ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </Stack>
  );
}