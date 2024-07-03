import { Conversations, useGetConversations } from '@/queries/messages.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/user.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { HardHat, UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator.tsx';
import MessageWindow from '@/components/layout/MessageWindow.tsx';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useQueryClient } from 'react-query';

export default function Messages() {
  const queryClient = useQueryClient();
  const {
    data: conversationData,
    error: conversationError,
    isLoading: conversationIsLoading,
  } = useGetConversations<Conversations>();
  const { user } = useUserStore();
  const [conversations, setConversations] = useState<Conversations | null>(null);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  useEffect(() => {
    if (conversationData) {
      const clonedData = JSON.parse(JSON.stringify(conversationData));
      setConversations(clonedData);
    }
  }, [conversationData]);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_CHAT_WS_URL}`);
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on(
      'message',
      (wsMessage: {
        senderId: string;
        receiverId: string;
        content: string;
        id: string;
        readStatus: boolean;
        createdAt: string;
      }) => {
        setConversations((prev) => {
          const newConversations = { ...prev };
          const bucketId = wsMessage.senderId === user.id ? wsMessage.receiverId : wsMessage.senderId;

          if (newConversations[bucketId]) {
            newConversations[bucketId].messages = [wsMessage, ...newConversations[bucketId].messages];
          } else {
            newConversations[bucketId].messages = [wsMessage];
          }
          return newConversations;
        });
      },
    );
    return () => {
      socket.disconnect();
    };
  }, [user.id]);
  useEffect(() => {}, [conversations]);

  const [activeUser, setActiveUser] = useState<string>('');
  const sendMessage = useCallback((senderId: string, receiverId: string, message: string) => {
    socketRef.current &&
      socketRef.current.connected &&
      socketRef.current.emit('message', { senderId, receiverId, content: message });
  }, []);
  const readMessage = useCallback((senderId: string, receiverId: string, messageId: string) => {
    console.log('read');
    socketRef.current &&
      socketRef.current.connected &&
      socketRef.current.emit('readMessage', { senderId, receiverId, messageId });
  }, []);
  const joinRoom = useCallback(async (senderId: string, receiverId: string) => {
    socketRef.current && socketRef.current.connected && socketRef.current.emit('joinRoom', { senderId, receiverId });
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your conversations</CardTitle>
      </CardHeader>
      <CardContent className="h-full flex">
        <aside className="h-full w-1/5 overflow-auto max-h-[calc(100vh-180px)]">
          {conversations &&
            Object.entries(conversations).map(([user, messages]) => {
              return (
                <div
                  key={user}
                  className={`border-b last:border-b-0 w-full flex items-center h-24 gap-4 ${activeUser === user ? 'bg-primary font-medium text-white' : 'bg-white'}`}
                  onClick={() => setActiveUser(user)}
                >
                  <div className="bg-primary text-white flex items-center rounded-full p-2">{<UserIcon />}</div>
                  <div className="flex flex-col h-full justify-center">
                    <div className="pr-3">
                      <div className="line-clamp-1 font-medium self-start text-lg">
                        {messages.user.name ? messages.user.name : 'Dummy user'}
                      </div>
                    </div>
                    <div className={`${!messages.messages[0].readStatus ? '' : 'text-black'} line-clamp-2`}>
                      {messages.messages[0].content}
                    </div>
                  </div>
                </div>
              );
            })}
        </aside>
        <section className="w-4/5">
          {activeUser != '' && conversations && (
            <MessageWindow
              messages={conversations[activeUser].messages}
              receiverId={activeUser}
              sendMessage={sendMessage}
              joinRoom={joinRoom}
              readMessage={readMessage}
            />
          )}
        </section>
      </CardContent>
    </Card>
  );
}
