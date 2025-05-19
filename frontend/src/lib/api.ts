export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function api<T>(endpoint: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}
