import { useState, useEffect, useRef } from "react";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";
import { ChatHeader } from "./components/ChatHeader";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import { ConnectionsList } from "./components/ConnectionsList";
import type { Conversation, Message, User } from "./types";

interface MessagingLayoutProps {
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string;
  selectedConversation: Conversation | null;
  connections?: any[];
  loading?: {
    conversations?: boolean;
    messages?: boolean;
    sending?: boolean;
  };
  darkMode?: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onSendMessage: (text: string) => void;
  onRefreshConversations?: () => void;
  onStartNewConversation?: (connection: any) => void;
}

export function MessagingLayout({
  conversations,
  messages,
  currentUserId,
  selectedConversation,
  connections = [],
  loading = {},
  darkMode = false,
  onSelectConversation,
  onSendMessage,
  onRefreshConversations,
  onStartNewConversation,
}: MessagingLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants?.find(p => p.id !== currentUserId);
    return !searchQuery || 
           otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get other user from selected conversation
  const otherUser = selectedConversation?.participants?.find(p => p.id !== currentUserId);

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation);
    setShowSidebar(false); // Hide sidebar on mobile when conversation is selected
  };

  const handleNewMessage = () => {
    setShowNewMessage(true);
  };

  const handleStartConversation = (connection: any) => {
    setShowNewMessage(false);
    if (onStartNewConversation) {
      onStartNewConversation(connection);
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const containerBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

  return (
    <div className={`flex h-full ${bg}`}>
      <div className={`flex w-full h-full rounded-lg overflow-hidden border shadow-lg ${containerBg}`}>
        
        {/* Sidebar - Conversations List */}
        <div className={`${showSidebar ? "flex" : "hidden"} sm:flex flex-col w-full sm:w-80 lg:w-96 flex-shrink-0`}>
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedConversation?.id || null}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelectConversation}
            onNewMessage={handleNewMessage}
            onRefresh={onRefreshConversations}
            loading={loading.conversations}
            darkMode={darkMode}
          />
          
          {/* New Message Panel */}
          {showNewMessage && (
            <ConnectionsList
              connections={connections}
              onSelect={handleStartConversation}
              onClose={() => setShowNewMessage(false)}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Main Chat Area */}
        <div className={`${!showSidebar ? "flex" : "hidden"} sm:flex flex-col flex-1`}>
          {selectedConversation && otherUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                user={otherUser}
                conversationId={selectedConversation.id}
                onBack={handleBack}
                showBackButton={true}
                darkMode={darkMode}
              />

              {/* Messages */}
              <ChatWindow
                messages={messages}
                currentUserId={currentUserId}
                loading={loading.messages}
                darkMode={darkMode}
                otherUserName={otherUser.name}
              />

              {/* Message Input */}
              <MessageInput
                onSend={onSendMessage}
                placeholder={`Message ${otherUser.name}...`}
                disabled={loading.sending}
                loading={loading.sending}
                darkMode={darkMode}
              />
            </>
          ) : (
            /* Empty State */
            <EmptyState 
              darkMode={darkMode} 
              onNewMessage={connections.length > 0 ? handleNewMessage : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}