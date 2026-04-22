import { useState, useCallback } from "react";
import type { Conversation, Message, User } from "../types";

const initialUsers: User[] = [
  {
    id: "1",
    name: "Yohannes Tadesse",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    online: true,
  },
  {
    id: "2",
    name: "Meron Alemayehu",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    online: true,
  },
  {
    id: "3",
    name: "Daniel Haile",
    role: "Mobile Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    online: false,
  },
  {
    id: "4",
    name: "Sara Mohammed",
    role: "Graphic Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    online: false,
  },
];

const initialConversations: Conversation[] = [
  {
    id: "1",
    participants: [{ id: "me", name: "Me" }, initialUsers[0]],
    lastMessage: {
      id: "7",
      senderId: "1",
      text: "I'll have the first draft ready by tomorrow",
      createdAt: new Date().toISOString(),
      status: "sent",
      timestamp: "2m ago",
    },
    unread: 2,
    timestamp: "2m ago",
  },
  {
    id: "2",
    participants: [{ id: "me", name: "Me" }, initialUsers[1]],
    lastMessage: {
      id: "2",
      senderId: "2",
      text: "The designs look great! Let me know if you need any changes",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: "read",
      timestamp: "1h ago",
    },
    unread: 0,
    timestamp: "1h ago",
  },
  {
    id: "3",
    participants: [{ id: "me", name: "Me" }, initialUsers[2]],
    lastMessage: {
      id: "3",
      senderId: "3",
      text: "Thanks for the feedback. I've updated the app",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      status: "read",
      timestamp: "3h ago",
    },
    unread: 0,
    timestamp: "3h ago",
  },
  {
    id: "4",
    participants: [{ id: "me", name: "Me" }, initialUsers[3]],
    lastMessage: {
      id: "4",
      senderId: "4",
      text: "I can start on Monday. Does that work for you?",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "delivered",
      timestamp: "1d ago",
    },
    unread: 1,
    timestamp: "1d ago",
  },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      text: "Hi! Thank you for reaching out. I'd love to work on your project.",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      status: "read",
      timestamp: "10:30 AM",
      sender: "them",
      read: true,
    },
    {
      id: "2",
      senderId: "me",
      text: "Great! I reviewed your portfolio and I'm impressed with your work. Can you tell me more about your experience with React?",
      createdAt: new Date(Date.now() - 6900000).toISOString(),
      status: "read",
      timestamp: "10:35 AM",
      sender: "me",
      read: true,
    },
    {
      id: "3",
      senderId: "1",
      text: "I've been working with React for over 5 years. I've built everything from small business websites to large-scale SaaS applications.",
      createdAt: new Date(Date.now() - 6600000).toISOString(),
      status: "read",
      timestamp: "10:40 AM",
      sender: "them",
      read: true,
    },
    {
      id: "4",
      senderId: "1",
      text: "I'm particularly experienced with Next.js, TypeScript, and integrating with various APIs.",
      createdAt: new Date(Date.now() - 6540000).toISOString(),
      status: "read",
      timestamp: "10:41 AM",
      sender: "them",
      read: true,
    },
    {
      id: "5",
      senderId: "me",
      text: "Perfect! That's exactly what we need. What's your availability like? We're hoping to start next week.",
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      status: "read",
      timestamp: "11:00 AM",
      sender: "me",
      read: true,
    },
    {
      id: "6",
      senderId: "1",
      text: "I can definitely start next week. I have availability for a full-time commitment if needed.",
      createdAt: new Date(Date.now() - 4500000).toISOString(),
      status: "read",
      timestamp: "11:15 AM",
      sender: "them",
      read: true,
    },
    {
      id: "7",
      senderId: "1",
      text: "I'll have the first draft ready by tomorrow",
      createdAt: new Date(Date.now() - 120000).toISOString(),
      status: "sent",
      timestamp: "2m ago",
      sender: "them",
      read: false,
    },
  ],
};

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const otherUser = c.participants.find((p) => p.id !== "me");
    return (
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sendMessage = useCallback((conversationId: string, text: string, senderId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      text,
      createdAt: new Date().toISOString(),
      status: "sent",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      read: false,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMessage,
              timestamp: "Just now",
            }
          : c
      )
    );
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
    );
  }, []);

  return {
    conversations,
    filteredConversations,
    messages,
    searchQuery,
    setSearchQuery,
    sendMessage,
    markAsRead,
    setConversations,
  };
}
