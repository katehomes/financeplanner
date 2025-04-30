import api from './apiClient';

import { Transaction } from '../types/transaction';

const API_BASE = process.env.REACT_APP_API_BASE_URL;  // Retrieve the environment variable 

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/api/transaction`);

  console.log("response", response);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export const addTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const response = await api.post<Transaction>('/api/transaction', transaction);
  return response.data;
};
