import { useState, useCallback } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useMessages } from "./hooks/useMessages";
import { Header } from "./components/Header";
import { ConversationList } from "./components/ConversationList";
import { ChatHeader } from "./components/ChatHeader";
import { ChatWindow } from "./components/ChatWindow";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import type { Conversation } from "./types";

export default function MessagingPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  
  const {
    filteredConversations,
    messages,
    searchQuery,
    setSearchQuery,
    sendMessage,
    markAsRead,
  } = useMessages();

  const currentUserId = "me";

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setActiveConversation(conversation);
    markAsRead(conversation.id);
  }, [markAsRead]);

  const handleSend = useCallback((text: string) => {
    if (activeConversation) {
      sendMessage(activeConversation.id, text, currentUserId);
    }
  }, [activeConversation, sendMessage]);

  const otherUser = activeConversation?.participants.find((p) => p.id !== "me");

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex">
          <ConversationList
            conversations={filteredConversations}
            selectedId={activeConversation?.id || null}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelectConversation}
          />

          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                <ChatHeader
                  user={otherUser}
                  conversationId={activeConversation.id}
                />
                <ChatWindow
                  messages={messages[activeConversation.id] || []}
                  currentUserId={currentUserId}
                />
                <MessageInput onSend={handleSend} />
              </>
            ) : (
              <EmptyState darkMode={darkMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
