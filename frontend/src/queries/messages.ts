import { useQuery } from 'react-query';
import { useUserStore } from '@/store/user.ts';
import { Roles } from '@/utils/types.ts';
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
