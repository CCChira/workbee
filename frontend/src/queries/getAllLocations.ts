import { PaginationSortingState, QueryResponse } from '@/utils/types.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';
export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  Contract: {
    title: string;
    user: {
      name: string;
    };
  };
}
export async function getLocations(pagSort?: PaginationSortingState): Promise<QueryResponse<Location>> {
  const fetchURL =
    pagSort && pagSort.sortOrder
      ? addPagSortParams(
          pagSort.page,
          pagSort.size,
          `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
          pagSort.search?.field ?? '',
          pagSort.search?.searchParam ?? '',
          `${import.meta.env.VITE_API_URL}/locations/withContractAndClient`,
        )
      : `${import.meta.env.VITE_API_URL}/locations/withContractAndClient`;
  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'same-origin',
    method: 'GET',
  });

  if (!response.ok) {
    const errorBody = await response.json(); 
    throw new Error(errorBody.message || 'Failed to fetch locations');
  }

  return response.json();
}
