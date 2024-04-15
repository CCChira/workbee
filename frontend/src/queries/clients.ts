import { useUserStore } from '@/store/user.ts';
import addPagSortParams from '@/queries/addPagSortParams.ts';
import { PaginationSortingState, QueryResponse, User } from '@/utils/types.ts';

export async function getClients(pagSort: PaginationSortingState): Promise<QueryResponse<User>> {
  console.log(pagSort);
  const user = useUserStore.getState().user;
  const fetchURL = addPagSortParams(
    pagSort.page,
    pagSort.size,
    `${pagSort.sortOrder.property}:${pagSort.sortOrder.direction}`,
    `${import.meta.env.VITE_API_URL}/users`,
  );

  const response = await fetch(fetchURL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    method: 'GET',
  });

  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to login');
  }

  return response.json();
}
