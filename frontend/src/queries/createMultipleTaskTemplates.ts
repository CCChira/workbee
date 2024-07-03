import { useMutation } from 'react-query';
interface CreateMultipleTaskTemplatesDto {
  taskTemplates: {
    title: string;
    necessaryWorkers: number;
    necessaryTools: string[];
    contractId?: number;
  }[];
}
export async function createMultipleTaskTemplates(data: CreateMultipleTaskTemplatesDto) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/task-templates/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.taskTemplates),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error('Failed to create multiple task templates.');
  }

  return response.json();
}

export function useCreateMultipleTaskTemplates() {
  return useMutation({
    mutationFn: (data: CreateMultipleTaskTemplatesDto) => createMultipleTaskTemplates(data),
    onError: (error) => {
      console.error('Error creating multiple task templates:', error);
    },
  });
}
