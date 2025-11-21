// src/app/actions.ts
'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// --- TRANSACTION ACTIONS ---

export async function addTransaction(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;
  const type = formData.get('type') as 'expense' | 'income'; // New type

  await supabase.from('transactions').insert([{ title, amount, category, type }]);
  revalidatePath('/');
}

export async function deleteTransaction(id: number) {
  await supabase.from('transactions').delete().match({ id });
  revalidatePath('/');
}

export async function getTransactions() {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
  
  return data || [];
}

// --- BUDGET ACTIONS ---
export async function getBudgets() { // <<< CHECK THIS LINE
    const { data } = await supabase.from('budgets').select('*');
    return data || [];
}

// --- NEW GOAL DELETE ACTION ---
export async function deleteGoal(id: number) {
    await supabase.from('goals').delete().match({ id });
    revalidatePath('/');
}

// src/app/actions.ts (Add these two new functions)

// --- NEW BUDGET ACTION (Uses upsert to handle creation or update) ---
export async function addBudget(formData: FormData) {
  const category = formData.get('category') as string;
  const monthly_limit = parseFloat(formData.get('monthly_limit') as string);
  
  // Note: Using upsert, ensure 'category' is unique in the DB schema
  await supabase.from('budgets').upsert({ category, monthly_limit }, { onConflict: 'category' }); 
  revalidatePath('/');
}

// --- NEW GOAL ACTION ---
export async function addGoal(formData: FormData) {
    const name = formData.get('name') as string;
    const target_amount = parseFloat(formData.get('target_amount') as string);
    const target_date = formData.get('target_date') as string;
    // Current amount starts at 0 upon creation
    await supabase.from('goals').insert([{ name, target_amount, target_date, current_amount: 0 }]); 
    revalidatePath('/');
}

// (Optional) Add a delete function for cleanup:
export async function deleteBudget(id: number) {
    await supabase.from('budgets').delete().match({ id });
    revalidatePath('/');
}
// --- GOAL ACTIONS ---

export async function getGoals() {
    const { data } = await supabase.from('goals').select('*');
    return data || [];
}

export async function updateGoal(id: number, currentAmount: number) {
    await supabase
        .from('goals')
        .update({ current_amount: currentAmount })
        .match({ id });
    revalidatePath('/');
}