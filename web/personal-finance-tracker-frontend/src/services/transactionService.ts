import api from './apiClient';

import { Transaction } from '../types/transaction';
import { Tag } from '../types/tag';

const API_BASE = process.env.REACT_APP_API_BASE_URL;  // Retrieve the environment variable 

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/api/transaction`);

  console.log("response", response);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export const addTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  const response = await api.post<Transaction>('/api/transaction', transaction);
  return response.data;
};

export const updateTransaction = async (
  id: number, 
  transaction: Transaction
): Promise<Transaction> => {
  const response = await api.put<Transaction>(`/api/transaction/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number) => {
  await api.delete(`/api/transaction/${id}`);
};

export const batchRemoveTagsFromTransactions = async (ids: number[], tagIds: number[]) => {
  await api.post('/api/transaction/batch/remove-tags', { ids, tagIds });
}

export const batchAddTagsToTransactions = async (ids: number[], tagIds: number[]) => {
  await api.post('/api/transaction/batch/add-tags', { ids, tagIds });
}

export const batchSetCategoryForTransactions = async (ids: number[], categoryId?: number | null) => {
  await api.post('/api/transaction/batch/set-category', { ids, categoryId });
}

export const importCSVPreview = async (formData: FormData) => {
  const response = await api.post('/api/transaction/import/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export const importCSVConfirm = async (transactions: Transaction[]) => {
  const response = await api.post('/api/transaction/import/confirm', transactions);

  return response.data;
}

