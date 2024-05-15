import { useMutation } from 'react-query';

type CreateLocationDto = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};
const postLocations = async (locations: CreateLocationDto[], contractId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/multiple?contractId=${contractId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locations),
  });

  if (!response.ok) {
    const errorBody = await response.json(); // Assuming error is returned in JSON format
    throw new Error(errorBody.message || 'Failed to create multiple locations');
  }

  return response.json();
};
export const useCreateMultipleLocationsMutation = () => {
  return useMutation((data: { locations: CreateLocationDto[]; contractId: string }) =>
    postLocations(data.locations, data.contractId),
  );
};
