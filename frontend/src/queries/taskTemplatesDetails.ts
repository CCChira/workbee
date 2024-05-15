// src/queries/getTaskTemplates.ts
import { PaginationSortingState } from '@/utils/types.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';
import { useQuery } from 'react-query';

export async function getTaskTemplates(pagSort: PaginationSortingState, contractId?: string) {
  const paginationFetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property ?? 'title'}:${pagSort.sortOrder.direction ?? 'asc'}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/task-templates`,
  );
  const fetchURL = `${paginationFetchURL}${contractId ? `&contractId=${contractId}` : ''}`;

  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });

  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details
    throw new Error(errorBody.message || 'Failed to fetch task templates');
  }
  return response.json();
}
// src/hooks/useGetTaskTemplates.ts

export function useGetTaskTemplates(pagSort: PaginationSortingState, contractId: string) {
  return useQuery(
    [`taskTemplates${contractId}`, pagSort, contractId], // Query key
    () => getTaskTemplates(pagSort, contractId), // Fetch function with parameters
    {
      keepPreviousData: true, // Keep previous data during refetch
      staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    },
  );
}
