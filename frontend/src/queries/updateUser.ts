import { useMutation } from 'react-query';

export interface UpdateUserType {
  email?: string;
  phoneNumber?: string;
  name?: string;
  password?: string;
  role?: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}
export async function updateUser(id: string, updateUserDto: UpdateUserType) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateUserDto),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export function useUpdateUser() {
  return useMutation((params: { id: string; data: UpdateUserType }) => {
    const { id, data } = params;
    return updateUser(id, data);
  });
}
