import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import type { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search messages..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherUser = conversation.participants.find((p) => p.id !== "me");
          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                selectedId === conversation.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={otherUser?.avatar}
                    alt={otherUser?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {otherUser?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherUser?.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {otherUser?.role}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.text}
                  </p>
                </div>
                {conversation.unread && conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-[#0084ca] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {conversation.unread}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
