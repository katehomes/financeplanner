import api from './apiClient';

import { Category } from '../types/category';

const API_BASE = process.env.REACT_APP_API_BASE_URL;  // Retrieve the environment variable 

export async function fetchCategorys(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/api/category`);

  console.log("response", response);
  if (!response.ok) throw new Error('Failed to fetch categorys');
  return response.json();
}

export const addCategory = async (
  category: Category
): Promise<Category> => {
  const response = await api.post<Category>('/api/category', category);
  return response.data;
};

export const updateCategory = async (
  id: number, 
  category: Category
): Promise<Category> => {
  const response = await api.put<Category>(`/api/category/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/api/category/${id}`);
};

