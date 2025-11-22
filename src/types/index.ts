export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
  category_id: number | null;
  is_recurring: boolean;
}