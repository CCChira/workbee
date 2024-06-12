export async function deleteMultipleUsers(userIds: string[]) {
  const url = `${import.meta.env.VITE_API_URL}/users/delete-multiple`; // Replace with your actual backend URL
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ users: userIds }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to delete users: ' + response.statusText);
    }
    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow or handle error as needed
  }
}
