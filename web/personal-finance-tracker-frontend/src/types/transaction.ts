import { Category } from "../types/category";

export type Transaction = {
    id?: number;
    amount: number;
    date: string; // ISO date string
    description?: string;
    categoryId?: number | null
    category?: Category | null;
  };

export type NewTransaction = Omit<Transaction, 'id'>;

  