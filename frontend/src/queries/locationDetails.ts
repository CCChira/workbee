import { useQuery } from 'react-query';

export async function getLocationsByContractId(contractId: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/byContract?contractId=${contractId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch user');
  }
  return response.json();
}
export const useGetLocationsByContract = (contractId: string) => {
  return useQuery(contractId + 'locations', () => getLocationsByContractId(contractId));
};
export async function getRoomByLocationId(locationId: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/byLocation?locationId=${locationId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to fetch user');
  }
  return response.json();
}
export const useGetRoomsByLocation = (locationId: string) => {
  return useQuery(locationId + 'rooms', () => getLocationsByContractId(locationId));
};
