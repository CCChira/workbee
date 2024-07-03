import { useQuery } from 'react-query';

export async function getEmployeeUtils() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/employeeUtil`, {
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
export function useGetEmployeeUtils() {
  return useQuery('getEmployeeUtils', getEmployeeUtils);
}
