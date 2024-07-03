import { useQuery } from 'react-query';
import { PaginationSortingState, QueryResponse } from '@/utils/types';

export interface Room {
  id: number;
  name: string;
  locationId: number;
  accessMode: string;
  images: { id: number; url: string }[];
}

export async function fetchRoomsByLocation(locationId: number, pagSort: PaginationSortingState) {
  try {
    const fetchURL = `${import.meta.env.VITE_API_URL}/rooms/byLocation/${locationId}?page=${pagSort.page}&size=${pagSort.size}&property=${pagSort.sortOrder.property}&direction=${pagSort.sortOrder.direction}`;

    const response = await fetch(fetchURL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (e) {
    console.log(e);
  }
}

export function useRoomsByLocation(locationId: number, pagSort: PaginationSortingState) {
  return useQuery(['rooms', locationId, pagSort], () => fetchRoomsByLocation(locationId, pagSort));
}
