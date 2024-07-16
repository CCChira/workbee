import { useUserStore } from '@/store/user.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';
import { PaginationSortingState, QueryResponse, User } from '@/utils/types.ts';

export async function getClients(pagSort: PaginationSortingState): Promise<QueryResponse<User>> {
  const user = useUserStore.getState().user;
  const fetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    pagSort.search?.field ?? '',
    pagSort.search?.searchParam ?? '',
    `${import.meta.env.VITE_API_URL}/users/clients`,
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

// export async function deleteClients(clients: string[]): Promise<DeletionResponse> {
//   const fetchUrl = `${import.meta.env.VITE_API_URL}/users`;
// }
