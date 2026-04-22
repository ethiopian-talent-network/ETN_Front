import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
}

export function ChatWindow({ messages, currentUserId }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId || message.sender === "me"}
        />
      ))}
    </div>
  );
}
