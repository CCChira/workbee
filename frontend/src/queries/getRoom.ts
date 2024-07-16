import { TaskInstance } from '@/queries/employees.ts';
import { useQuery } from 'react-query';
import { PaginationSortingState } from '@/utils/types.ts';

export type Room = {
  room: {
    id: number;
    name: string;
    locationId: string;
    accessMode: string;
    images: Image[];
    taskInstances: TaskInstance[];
  };
};
export type Image = {
  id: number;
  presignedUrl: string;
  roomId: number;
};
export async function getRoom(id: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'GET',
    });
    if (!response.ok) {
      const errorBody = await response.json(); 

      throw new Error(errorBody.message || 'Failed to fetch user');
    }
    return response.json();
  } catch (e) {
    console.log(e);
  }
}

export function useGetRoom(id: string) {
  return useQuery<Room>(`room${id}`, () => getRoom(id));
}
export async function getTasksFromRoom(id: string, pagSort: PaginationSortingState) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/taskinstance/room/${id}?page=${pagSort.page}&size=${pagSort.size}&property=${pagSort.sortOrder.property}&direction=${pagSort.sortOrder.direction}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        method: 'GET',
      },
    );
    if (!response.ok) {
      const errorBody = await response.json(); 

      throw new Error(errorBody.message || 'Failed to fetch user');
    }
    return response.json();
  } catch (e) {
    console.log(e);
  }
}
export function useGetTaskInstancesFromRoom(id: string, pagSort: PaginationSortingState) {
  return useQuery<{ data: TaskInstance[] }>(`tasksRoom${id}`, () => getTasksFromRoom(id, pagSort));
}
