import { PaginationSortingState } from '@/utils/types.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';

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
  console.log('response');
  if (!response.ok) {
    const errorBody = await response.json(); 

    throw new Error(errorBody.message || 'Failed to fetch contracts');
  }
  return response.json();
}
export async function getContractLocations(contractId: string, pagSort?: PaginationSortingState) {
  const paginationFetchURL = addPagSortParams(
    pagSort?.page ?? 1,
    pagSort?.size ?? 10,
    `${pagSort?.sortOrder.property ?? 'id'}:${pagSort?.sortOrder.direction ?? 'asc'}`,
    pagSort?.search?.field ?? '',
    pagSort?.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/locations`,
  );
  const fetchURL = `${paginationFetchURL}&contractId=${contractId}`;
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
