
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
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to fetch task templates');
  }
  return response.json();
}


export function useGetTaskTemplates(pagSort: PaginationSortingState, contractId: string) {
  return useQuery(
    [`taskTemplates${contractId}`, pagSort, contractId],
    () => getTaskTemplates(pagSort, contractId),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    },
  );
}
