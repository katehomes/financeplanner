import api from './apiClient';

import { Tag } from '../types/tag';

const API_BASE = process.env.REACT_APP_API_BASE_URL;  // Retrieve the environment variable 

export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch(`${API_BASE}/api/tag`);

  console.log("response", response);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}

export const addTag = async (
  tag: Tag
): Promise<Tag> => {
  const response = await api.post<Tag>('/api/tag', tag);
  return response.data;
};

export const updateTag = async (
  id: number, 
  tag: Tag
): Promise<Tag> => {
  const response = await api.put<Tag>(`/api/tag/${id}`, tag);
  return response.data;
};

export const deleteTag = async (id: number) => {
  await api.delete(`/api/tag/${id}`);
};


export const createTag = async (tag: Tag): Promise<Tag> => {
  const res = await addTag(tag);

  if (!res) throw new Error('Failed to create tag');
  return res;
};

