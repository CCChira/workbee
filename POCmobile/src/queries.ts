import {useQuery} from "react-query";
import {useUserStore} from "./store/userStore.ts";

interface LoginForm {
  code: string;
}
export interface TaskInstance {
  id: number;
  status: string;
  date: Date;
  hour: string;
  roomId: number;
  taskScheduleId?: number;
  taskTemplateId?: number;
  taskSchedule: {
    id: number;
    description: string;
    dayOfWeek: number[];
    frequency: number[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    hour: string;
    roomId: number;
  };
  taskTemplate: {
    id: number;
    title: string;
    necessaryWorkers: number;
    necessaryTools: string[];
    duration: string;
  };
}
export async function loginEmployee(formData: LoginForm){
  const response = await fetch(`/api/users/employee-login`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({token: formData.code}),
  });

  if (!response.ok) {
    const errorBody = await response.json();

    console.log(errorBody);
    throw new Error(errorBody.message || 'Failed to login');
  }

  return response.json();
}

export async function getTodayTaskInstances(userId: string) {
  try {
    const response = await fetch(`/api/taskinstance/instancesToday/${userId}`, {
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
export function useTaskInstancesToday(userId: string) {
  return useQuery<TaskInstance[]>('todayTaskInstances', () => getTodayTaskInstances(userId));
}

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readStatus: boolean;
};

export type Conversations = Record<
  string,
  { user: { id: string; name: string; email: string; phoneNumber: string; role: Roles }; messages: Message[] }
>;
export async function getConversationsForUser(userId: string) {
  const response = await fetch(`${import.meta.env.VITE_CHAT_URL}/conversation?senderId=${userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
}
export function useGetConversations<T>() {
  const userStore = useUserStore.getState();

  return useQuery<T>(`getConversations${userStore.user.id}`, () => getConversationsForUser(userStore.user.id));
}
