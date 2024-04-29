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
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch contracts');
  }
  return response.json();
}
export async function getContractLocations(pagSort: PaginationSortingState, contractId: string) {
  const paginationFetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
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
  console.log('response');
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch contracts');
  }
  return response.json();
}
