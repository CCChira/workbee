import { useQuery } from 'react-query';

export async function getTopEmployees() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/topEmployees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (e) {
    console.log(e);
  }
}

export function useGetTopEmployees() {
  return useQuery('topEmployees', getTopEmployees);
}
