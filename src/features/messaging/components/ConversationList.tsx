import { Search, MessageSquare, UserPlus, RefreshCw } from "lucide-react";
import type { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (conversation: Conversation) => void;
  onNewMessage?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  darkMode?: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onNewMessage,
  onRefresh,
  loading = false,
  darkMode = false,
}: ConversationListProps) {
  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0);
  
  const getInitials = (name: string) => 
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const bg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const hoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const activeBg = darkMode ? "bg-gray-700" : "bg-blue-50";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200";

  return (
    <div className={`w-80 lg:w-96 border-r ${bg} flex flex-col h-full`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${text}`}>Messages</h2>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-[#0084ca] text-white rounded-full">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onNewMessage && (
              <button
                onClick={onNewMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0084ca] hover:bg-[#006ba6] text-white text-xs font-medium rounded-lg transition-colors"
                title="New message"
              >
                <UserPlus className="w-3.5 h-3.5" />
                New
              </button>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border ${inputBg}`}>
          <Search className={`w-4 h-4 ${muted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0084ca]" />
          </div>
        ) : conversations.length === 0 ? (
          <div className={`text-center py-16 px-4 ${muted}`}>
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="text-sm font-medium mb-1">No conversations yet</p>
            <p className="text-xs mb-4">Start a conversation with your connections</p>
            {onNewMessage && (
              <button
                onClick={onNewMessage}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0084ca] hover:bg-[#006ba6] text-white text-xs font-medium rounded-lg transition-colors mx-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                New Message
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {conversations.map((conversation) => {
              const otherUser = conversation.participants?.find(p => p.id !== "me");
              const isSelected = selectedId === conversation.id;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelect(conversation)}
                  className={`w-full p-4 transition-colors text-left group ${
                    isSelected ? activeBg : hoverBg
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {otherUser?.avatar ? (
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(otherUser?.name || "Unknown")}
                        </div>
                      )}
                      {otherUser?.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {conversation.unread && conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#0084ca] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {conversation.unread > 9 ? "9+" : conversation.unread}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${text} group-hover:text-[#0084ca] transition-colors`}>
                          {otherUser?.name || "Unknown User"}
                        </h3>
                        <span className={`text-xs ${muted} flex-shrink-0 ml-2`}>
                          {formatTime(conversation.timestamp || conversation.lastMessage?.createdAt || "")}
                        </span>
                      </div>
                      
                      {otherUser?.role && (
                        <p className={`text-xs ${muted} mb-1 truncate`}>
                          {otherUser.role}
                        </p>
                      )}
                      
                      <p className={`text-sm truncate ${
                        conversation.unread && conversation.unread > 0
                          ? darkMode ? "text-gray-200 font-medium" : "text-gray-700 font-medium"
                          : muted
                      }`}>
                        {conversation.lastMessage?.text || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
