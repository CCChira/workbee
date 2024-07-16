export async function getClientDetails(id: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'GET',
  });
  if (!response.ok) {
    const errorBody = await response.json(); 

    throw new Error(errorBody.message || 'Failed to fetch user');
  }
  return response.json();
}
