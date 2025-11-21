import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useAddExpense } from '../../hooks/useExpenses';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  description: yup.string().required(),
  amount: yup.number().positive().required(),
  date: yup.string().required(),
}).required();

export default function ExpenseForm({ onClose }: { onClose?: () => void }) {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    }
  });
  
  const addExpense = useAddExpense();

  const onSubmit = (data: any) => {
    addExpense.mutate(data, {
      onSuccess: () => {
        reset();
        if (onClose) onClose();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextField {...field} label="Description" error={!!fieldState.error} helperText={fieldState.error?.message} />
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <TextField {...field} type="number" label="Amount" error={!!fieldState.error} />
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => <TextField {...field} type="date" label="Date" InputLabelProps={{ shrink: true }} />}
        />
        <Button type="submit" variant="contained" disabled={addExpense.isPending}>
          {addExpense.isPending ? 'Adding...' : 'Add Expense'}
        </Button>
      </Stack>
    </form>
  );
}