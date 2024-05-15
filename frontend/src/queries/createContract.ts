type CreateContractDataDto = {
  title: string;
  startDate: Date;
  endDate: Date;
  clientId: string;
  description: string;
};

export const createContract = async (contractData: CreateContractDataDto) => {
  console.log(contractData);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contracts?clientId=${contractData.clientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contractData),
  });
  if (!response.ok) {
    const errorBody = await response.json(); // Assuming the server returns JSON with error details

    throw new Error(errorBody.message || 'Failed to create contract');
  }
  return response.json();
};
