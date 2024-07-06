export async function updateTaskInstanceStatus(taskInstanceId: number, status: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/taskinstance/${taskInstanceId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task instance status');
  }

  return response.json();
}
