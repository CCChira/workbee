import { useMutation, useQuery } from 'react-query';
import { getEmployees } from '@/queries/employees.ts';

export async function assignUserToTask(data: { taskId: string; userId: string }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/taskinstance/assign-user?instanceId=${data.taskId}&userId=${data.userId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'POST',
    },
  );
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch user');
  }
  return response.json();
}
export function useAssignUserToTask() {
  return useMutation(assignUserToTask);
}
export const useGetEmployeesForTasks = (searchQ: string) => {
  return useQuery(`getUsers${searchQ}`, () =>
    getEmployees({
      search: {
        field: 'name',
        searchParam: searchQ,
      },
      sortOrder: {
        property: 'name',
        direction: 'asc',
      },
      size: 100,
      page: 1,
    }),
  );
};

export async function removeUserFromTask(data: { userId: string; taskId: string }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/taskinstance/removeByUserTask?taskId=${data.taskId}&userId=${data.userId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'DELETE',
    },
  );
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch user');
  }
  return response.json();
}
export function useRemoveUserFromTask() {
  return useMutation(removeUserFromTask);
}
