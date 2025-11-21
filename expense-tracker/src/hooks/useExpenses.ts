import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { Expense } from '../types';
import { useAuth } from '../context/AuthContext';


// ==========================
// 🔹 FETCH EXPENSES
// ==========================
export const useExpenses = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('id, amount, description, date, category_id, categories(name)')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session
  });
};


// ==========================
// 🔹 ADD EXPENSE
// ==========================
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



// ==========================
// 🔹 DELETE EXPENSE
// ==========================
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};
