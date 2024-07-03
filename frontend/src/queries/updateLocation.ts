import { useMutation } from 'react-query';
export interface UpdateLocationType {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}
async function updateLocation(id: number, data: UpdateLocationType) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useUpdateLocation() {
  return useMutation((params: { id: number; data: UpdateLocationType }) => {
    return updateLocation(params.id, params.data);
  });
}
