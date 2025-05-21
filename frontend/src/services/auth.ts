import { api } from '../lib/api';
import type { UserData } from '../types/user';

type AuthRegisterResponse = {
  message: 'Usuário registrado com sucesso';
  user: { id: number; email: string; name: string };
};

export const authService = {
  login: async (email: string, password: string): Promise<UserData> => {
    const data = await api('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!data) {
      throw new Error('Failed to login');
    }

    return data as UserData;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthRegisterResponse> => {
    const data = await api('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!data) {
      throw new Error('Failed to register');
    }

    return data as AuthRegisterResponse;
  }
};
