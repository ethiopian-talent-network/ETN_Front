import { useEffect, useRef } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
  darkMode?: boolean;
  otherUserName?: string;
}

export function ChatWindow({ 
  messages, 
  currentUserId, 
  loading = false, 
  darkMode = false,
  otherUserName = "User"
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    });
    const last = acc[acc.length - 1];
    if (last && last.date === date) {
      last.msgs.push(msg);
    } else {
      acc.push({ date, msgs: [msg] });
    }
    return acc;
  }, []);

  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const bg = darkMode ? "bg-gray-700" : "bg-gray-200";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#0084ca]" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center ${muted}`}>
        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium mb-1">No messages yet</p>
        <p className="text-sm">Say hello to {otherUserName}!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {groupedMessages.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center gap-4 my-6">
              <div className={`flex-1 h-px ${bg}`} />
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"}`}>
                {date}
              </span>
              <div className={`flex-1 h-px ${bg}`} />
            </div>

            {/* Messages for this date */}
            <div className="space-y-2">
              {msgs.map((message, idx) => {
                const isOwn = message.senderId === currentUserId || message.sender === "me";
                const showAvatar = !isOwn && (idx === 0 || msgs[idx - 1]?.senderId !== message.senderId);
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    darkMode={darkMode}
                    otherUserName={otherUserName}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
