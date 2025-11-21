import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { Expense } from '../types';
import { useAuth } from '../context/AuthContext';

export const useExpenses = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, categories(name)')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session // Only run if logged in
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (newExpense: Omit<Expense, 'id'>) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...newExpense, user_id: session?.user.id }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};