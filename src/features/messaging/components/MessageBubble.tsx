import { CheckCheck } from "lucide-react";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md ${
          isOwn
            ? "bg-[#0084ca] text-white"
            : "bg-gray-100 text-gray-900"
        } rounded-2xl px-4 py-2`}
      >
        <p className="text-sm mb-1">{message.text}</p>
        <div className="flex items-center justify-end gap-1 text-xs opacity-70">
          <span>{message.timestamp}</span>
          {isOwn && (
            <CheckCheck
              className={`w-4 h-4 ${
                message.read ? "text-blue-200" : "text-white"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
