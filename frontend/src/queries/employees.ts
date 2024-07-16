import { PaginationSortingState, QueryResponse, User } from '@/utils/types.ts';
import { useUserStore } from '@/store/user.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';

export async function getEmployees(pagSort: PaginationSortingState): Promise<QueryResponse<User>> {
  const user = useUserStore.getState().user;
  const fetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/users/employees`,
  );

  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    credentials: 'same-origin',
    method: 'GET',
  });

  if (!response.ok) {
    const errorBody = await response.json(); 

    throw new Error(errorBody.message || 'Failed to login');
  }

  return response.json();
}
export interface TaskInstance {
  id: number;
  taskScheduleId?: number; //Assuming you have a corresponding type for TaskSchedule
  status: string;
  date: Date;
  hour: string;
  room: {
    id: number;
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}

export async function getTasksAssisgnedToUser(pagSort: PaginationSortingState, id: string) {
  const user = useUserStore.getState().user;

  const fetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/taskinstance/assigned-to-user/${id}`,
  );

  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json(); 

    throw new Error(errorBody.message || 'Failed to fetch tasks');
  }
  return response.json() || [];
}
export async function getTasksAssignedToUserThisWeek(pagSort: PaginationSortingState, id: string) {
  const user = useUserStore.getState().user;

  const fetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/taskinstance/assigned-to-user/${id}`,
  );

  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json(); 

    throw new Error(errorBody.message || 'Failed to fetch tasks');
  }
  return response.json() || [];
}
