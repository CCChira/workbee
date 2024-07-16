import {useCallback, useEffect, useRef, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Conversations, useGetConversations} from "../queries.ts";
import {useUserStore} from "../store/userStore.ts";
import { io, Socket } from 'socket.io-client';
import {debounce} from "lodash";
import {Input} from "../components/ui/input.tsx";
import {UserIcon} from "lucide-react";
import React from "react";
import {Button} from "../components/ui/button.tsx";
export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readStatus: boolean;
  show?: boolean;
};
type MessageWindowProps = {
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, message: string) => void;
  joinRoom: (senderId: string, receiverId: string) => void;
  readMessage: (senderId: string, receiverId: string, messageId: string) => void;
  receiverId: string;
};
export function MessageWindow({
                                        messages,
                                        sendMessage,
                                        joinRoom,
                                        receiverId,
                                        readMessage,
                                        show,
                                      }: MessageWindowProps) {
  const { user } = useUserStore();
  const [message, setMessage] = useState('');
  const debouncedSetMessage = useCallback(
    debounce((msg: string) => {
      setMessage(msg);
    }, 300),
    [],
  );

  useEffect(() => {
    joinRoom(user.id, receiverId);
  }, [joinRoom, receiverId, user.id]);
  return (
    <div className={`w-full test-primary flex flex-col items-center${show ? 'h-40' : 'h-0 hidden'} transition ease-in-out duration-200 relative`}>
      <div className="flex flex-col-reverse overflow-auto max-h-[calc(100vh-210px)] w-full mb-10">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`${message.senderId === user.id ? 'self-end bg-primary text-white font-medium rounded-tr-none' : 'self-start bg-accent-foreground text-accent font-medium rounded-tl-none'} rounded-full text-sm p-2 m-2`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className='absolute bottom-1 w-full flex'>
        <Input
          className="self-end "
          onChange={(event) => {
            const msg = event.target.value;
            debouncedSetMessage(msg);
          }}
          onFocus={() => readMessage(user.id, receiverId, messages[0].id)}
        />
        <Button
          onClick={() => {
            sendMessage(user.id, receiverId, message);
            setMessage('');
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}


export default function Messages() {
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
        <div className="h-full w-full overflow-auto max-h-[calc(100vh-180px)] px-3">
          {conversations &&
            Object.entries(conversations).map(([user, messages]) => {
              return (
                <React.Fragment key={user}>
                  <div
                  key={user}
                  className={`border-b last:border-b-0 w-full flex items-center h-24 gap-4 ${activeUser === user ? 'bg-primary font-medium text-white' : 'bg-white'}`}
                  onClick={() => {
                    setActiveUser(prevState => user === prevState ? '' : user)
                  }}
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
                  {activeUser === user && conversationData && (
                    <MessageWindow
                      messages={conversations[activeUser].messages}
                      receiverId={activeUser}
                      sendMessage={sendMessage}
                      joinRoom={joinRoom}
                      readMessage={readMessage}
                      show={activeUser === user}
                    />
                  )}
                </React.Fragment>

              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
