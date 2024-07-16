import { PaginationSortingState, Roles } from '@/utils/types.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';

export interface TaskTemplate {
  id: number;
  title: string;
  necessaryWorkers: number;
  necessaryTools: string[];
  contractId?: number; // The template may be linked to a contract or not
  _count: {
    TaskSchedule: number;
  };
}

export interface ClientData {
  name: string;
  id: string;
  email: string;
  role: Roles;
  createdAt: string;
}
export interface GetMultiple<T> {
  data: T[];
  dataSize: number;
  page: number;
  size: 100;
}
export interface ContractData {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  taskTemplates: any[];
  clientId: string;
}
export interface LocationData {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contractId: number;
}
export async function getClientDetails(id: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
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
}
export async function getClientContract(pagSort: PaginationSortingState, clientId: string) {
  const paginationFetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/contracts/all`,
  );
  const fetchURL = `${paginationFetchURL}&clientId=${clientId}`;
  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json();

    throw new Error(errorBody.message || 'Failed to fetch contracts');
  }
  return response.json();
}
export async function getClientLocations(pagSort: PaginationSortingState, clientId: string) {
  console.log(pagSort.search);
  const paginationFetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/locations`,
  );
  const fetchURL = `${paginationFetchURL}&clientId=${clientId}`;
  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json();

    throw new Error(errorBody.message || 'Failed to fetch contracts');
  }
  return response.json();
}
