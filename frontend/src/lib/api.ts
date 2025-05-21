export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function api<T>(endpoint: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  // Verifica status 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }
  
  return response.json();
}
