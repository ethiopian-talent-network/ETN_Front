import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Header } from "../talents/components/Header";
import { MessagingLayout } from "./components/MessagingLayout";
import {
  getConversations,
  getRealMessages,
  sendRealMessage,
  getMyConnections,
  type Conversation as APIConversation,
  type RealMessage,
  type Connection as APIConnection,
} from "../../api/talent/talentApi";
import type { Conversation, Message, User, Connection } from "./types";

// Transform API data to component types
const transformConversation = (apiConv: APIConversation): Conversation => ({
  id: apiConv.user_id.toString(),
  participants: [
    { id: "me", name: "Me" },
    {
      id: apiConv.user_id.toString(),
      name: apiConv.name,
      avatar: apiConv.profile_image,
      online: false, // You can add online status logic here
    }
  ],
  lastMessage: apiConv.last_message ? {
    id: Date.now().toString(),
    senderId: "unknown",
    text: apiConv.last_message,
    createdAt: apiConv.last_message_at,
    status: "delivered" as const,
  } : undefined,
  unread: apiConv.unread_count,
  timestamp: apiConv.last_message_at,
});

const transformMessage = (apiMsg: RealMessage, currentUserId: string): Message => ({
  id: apiMsg.id.toString(),
  senderId: apiMsg.sender_id.toString(),
  text: apiMsg.content,
  createdAt: apiMsg.created_at,
  status: apiMsg.is_read ? "read" : "delivered",
  timestamp: apiMsg.created_at,
});

const transformConnection = (apiConn: APIConnection): Connection => ({
  id: apiConn.id.toString(),
  name: apiConn.name,
  avatar: apiConn.profile_image,
  role: apiConn.about,
  about: apiConn.about,
  online: false,
  talent_id: apiConn.talent_id,
  sender_id: apiConn.sender_id,
});

export default function ImprovedMessagingPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  const [userImage, setUserImage] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState({
    conversations: true,
    messages: false,
    sending: false,
  });

  // Load initial data
  useEffect(() => {
    loadConversations();
    loadConnections();
  }, []);

  const loadConversations = async () => {
    setLoading(prev => ({ ...prev, conversations: true }));
    try {
      const res = await getConversations();
      const transformedConversations = (res.conversations || []).map(transformConversation);
      setConversations(transformedConversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  };

  const loadConnections = async () => {
    try {
      const res = await getMyConnections();
      const transformedConnections = (res.connections || []).map(transformConnection);
      setConnections(transformedConnections);
    } catch (error) {
      console.error("Failed to load connections:", error);
    }
  };

  const loadMessages = async (userId: number) => {
    setLoading(prev => ({ ...prev, messages: true }));
    try {
      const res = await getRealMessages(userId);
      const transformedMessages = (res.messages || []).map(msg => 
        transformMessage(msg, user?.id?.toString() || "")
      );
      setMessages(transformedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    const userId = parseInt(conversation.id);
    await loadMessages(userId);
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation || !text.trim()) return;

    setLoading(prev => ({ ...prev, sending: true }));
    try {
      const userId = parseInt(selectedConversation.id);
      await sendRealMessage(userId, text.trim());
      
      // Reload messages and conversations
      await loadMessages(userId);
      await loadConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  const handleStartNewConversation = async (connection: Connection) => {
    const userId = connection.talent_id || connection.sender_id || parseInt(connection.id);
    
    // Create a conversation object from the connection
    const newConversation: Conversation = {
      id: userId.toString(),
      participants: [
        { id: "me", name: "Me" },
        {
          id: userId.toString(),
          name: connection.name,
          avatar: connection.avatar,
          online: connection.online,
          role: connection.role,
        }
      ],
      timestamp: new Date().toISOString(),
    };
    
    setSelectedConversation(newConversation);
    await loadMessages(userId);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} transition-colors duration-300`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        userImage={userImage} 
        onImageUpload={() => {}} 
      />
      
      <div className="flex-1 overflow-hidden max-w-7xl w-full mx-auto px-4 lg:px-6 py-4">
        <MessagingLayout
          conversations={conversations}
          messages={messages}
          currentUserId={user?.id?.toString() || ""}
          selectedConversation={selectedConversation}
          connections={connections}
          loading={loading}
          darkMode={darkMode}
          onSelectConversation={handleSelectConversation}
          onSendMessage={handleSendMessage}
          onRefreshConversations={loadConversations}
          onStartNewConversation={handleStartNewConversation}
        />
      </div>
    </div>
  );
}