export interface User {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
  role?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
  timestamp?: string;
  sender?: "me" | "them";
  read?: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  jobTitle?: string;
  unread?: number;
  timestamp?: string;
}

export interface Connection {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  about?: string;
  online?: boolean;
  talent_id?: number;
  sender_id?: number;
}
