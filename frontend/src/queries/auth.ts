import { useMutation } from 'react-query';
import { AuthEntity, useUserStore } from '../store/userStore.ts';

interface LoginCredentials {
  email: string;
  password: string;
}

const loginUser = async (credentials: LoginCredentials) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return (await response.json()) as AuthEntity;
};

export const useLoginUser = () => {
  return useMutation(loginUser, {
    onSuccess: (data) => {
      useUserStore.getState().setUser(data);
    },
  });
};
