import { CheckCheck, Check } from "lucide-react";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  darkMode?: boolean;
  otherUserName?: string;
}

export function MessageBubble({ 
  message, 
  isOwn, 
  showAvatar = false, 
  darkMode = false,
  otherUserName = "User"
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getInitials = (name: string) => 
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {/* Other user avatar */}
      {!isOwn && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(otherUserName)}
            </div>
          )}
        </div>
      )}

      <div className={`max-w-[70%] sm:max-w-[60%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {/* Message bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isOwn
            ? "bg-[#0084ca] text-white rounded-br-md"
            : darkMode
            ? "bg-gray-700 text-gray-100 rounded-bl-md border border-gray-600"
            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
        }`}>
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        
        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${
          isOwn ? "justify-end" : "justify-start"
        }`}>
          <span className={`text-xs ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}>
            {formatTime(message.timestamp || message.createdAt)}
          </span>
          {isOwn && (
            <div className="flex items-center">
              {message.status === "read" || message.read ? (
                <CheckCheck className="w-3 h-3 text-[#0084ca]" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="w-3 h-3 text-gray-400" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
