import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { Expense } from '../types';
import { useAuth } from '../context/AuthContext';

// --- Fetch Categories ---
export const useCategories = () => {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });
};

// --- Fetch Expenses (Read) ---
export const useExpenses = () => {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      // We join categories to get the category name
      const { data, error } = await supabase
        .from('expenses')
        .select('*, categories(id, name)')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });
};

// --- Add Expense (Create) ---
export const useAddExpense = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (newExpense: any) => {
      // Ensure category_id is null if empty string, else number
      const catId = newExpense.category_id ? Number(newExpense.category_id) : null;
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...newExpense, category_id: catId, user_id: session?.user.id }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

// --- Update Expense (Update) ---
export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, ...updates }: any) => {
        const catId = updates.category_id ? Number(updates.category_id) : null;
        const { data, error } = await supabase
          .from('expenses')
          .update({ ...updates, category_id: catId })
          .eq('id', id)
          .select();
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
      },
    });
  };

// --- Delete Expense (Delete) ---
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};


// ... existing imports

// --- Add Category ---
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: session?.user.id }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// --- Update Category ---
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// --- Delete Category ---
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        // This usually happens if expenses are linked to this category
        throw new Error('Cannot delete category with existing expenses.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};