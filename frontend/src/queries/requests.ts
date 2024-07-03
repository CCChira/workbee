import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useUserStore } from '@/store/user.ts';
export type RequestType = 'TASK_SCHEDULE_CREATION' | 'TASK_INSTANCE_REDO';
interface User {
  id: string;
  email?: string;
  name?: string;
  // Include other relevant user fields if needed
}
type Status =
  | 'UNASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'INCOMPLETE'
  | 'REQUESTED_CANCEL'
  | 'VERIFIED'
  | 'PENDING';
export interface Request {
  id: number;
  type: RequestType;
  status: Status;
  details: unknown;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignedTo: User;
  assignedToId: string;
  createdById: string;
}

export interface RequestsResponse {
  data: Request[];
  dataSize: number;
  page: number;
  size: number;
}

const fetchRequests = async (page: number, size: number): Promise<RequestsResponse> => {
  const user = useUserStore.getState();
  const response = await fetch(`/api/requests?page=${page}&size=${size}&adminId=${user.user.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const useFetchRequests = (page: number, size: number) => {
  return useQuery(['requests', page, size], () => fetchRequests(page, size));
};

const approveRequest = async (requestId: number) => {
  const response = await fetch(`/api/requests/${requestId}/approve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to approve request');
  }

  return response.json();
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(approveRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('requests');
    },
  });
};
const denyRequest = async (requestId: number) => {
  const response = await fetch(`/api/requests/${requestId}/deny`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'), // Your auth token storage strategy
    },
  });

  if (!response.ok) {
    throw new Error('Failed to deny request');
  }

  return response.json();
};

export const useDenyRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(denyRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('requests');
    },
  });
};
