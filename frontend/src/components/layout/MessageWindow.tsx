import { Input } from '@/components/ui/input.tsx';
import { Message } from '@/queries/messages.ts';
import { UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator.tsx';
import { useUserStore } from '@/store/user.ts';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
type MessageWindowProps = {
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, message: string) => void;
  joinRoom: (senderId: string, receiverId: string) => void;
  readMessage: (senderId: string, receiverId: string, messageId: string) => void;
  receiverId: string;
};
export default function MessageWindow({
  messages,
  sendMessage,
  joinRoom,
  receiverId,
  readMessage,
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
    <div className="w-full test-primary flex flex-col items-center">
      <div className="flex flex-col-reverse overflow-auto max-h-[calc(100vh-210px)] w-full px-5">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`${index % 2 ? 'self-end bg-primary text-white font-medium' : 'self-start bg-accent-foreground text-accent font-medium'} rounded-full bg-primary p-2 m-2`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <Input
          className="self-end"
          onChange={(event) => {
            const msg = event.target.value;
            debouncedSetMessage(msg);
          }}
          onFocus={() => readMessage(user.id, receiverId, messages[0].id)}
        />
        <button
          onClick={() => {
            sendMessage(user.id, receiverId, message);
            setMessage('');
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
}
