import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useDarkMode } from "../contexts/DarkModeContext";
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  CheckCheck,
  User,
  Moon,
  Sun,
} from "lucide-react";

export default function Messages() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Yohannes Tadesse",
      role: "Full Stack Developer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      lastMessage: "I'll have the first draft ready by tomorrow",
      timestamp: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Meron Alemayehu",
      role: "UI/UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      lastMessage:
        "The designs look great! Let me know if you need any changes",
      timestamp: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Daniel Haile",
      role: "Mobile Developer",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      lastMessage: "Thanks for the feedback. I've updated the app",
      timestamp: "3h ago",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "Sara Mohammed",
      role: "Graphic Designer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      lastMessage: "I can start on Monday. Does that work for you?",
      timestamp: "1d ago",
      unread: 1,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "them",
      text: "Hi! Thank you for reaching out. I'd love to work on your project.",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: 2,
      sender: "me",
      text: "Great! I reviewed your portfolio and I'm impressed with your work. Can you tell me more about your experience with React?",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: 3,
      sender: "them",
      text: "I've been working with React for over 5 years. I've built everything from small business websites to large-scale SaaS applications.",
      timestamp: "10:40 AM",
      read: true,
    },
    {
      id: 4,
      sender: "them",
      text: "I'm particularly experienced with Next.js, TypeScript, and integrating with various APIs.",
      timestamp: "10:41 AM",
      read: true,
    },
    {
      id: 5,
      sender: "me",
      text: "Perfect! That's exactly what we need. What's your availability like? We're hoping to start next week.",
      timestamp: "11:00 AM",
      read: true,
    },
    {
      id: 6,
      sender: "them",
      text: "I can definitely start next week. I have availability for a full-time commitment if needed.",
      timestamp: "11:15 AM",
      read: true,
    },
    {
      id: 7,
      sender: "them",
      text: "I'll have the first draft ready by tomorrow",
      timestamp: "2m ago",
      read: false,
    },
  ];

  const currentChat = conversations.find((c) => c.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/talent-profile"
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </Link>
            <Link to="/talent-profile" className="etn-brand-fancy text-2xl">
              ETN
            </Link>
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    selectedChat === conversation.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {conversation.role}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-[#0084ca] text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentChat.avatar}
                        alt={currentChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {currentChat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {currentChat.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentChat.online ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/freelancer-public-profile/${selectedChat}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md ${
                          message.sender === "me"
                            ? "bg-[#0084ca] text-white"
                            : "bg-gray-100 text-gray-900"
                        } rounded-2xl px-4 py-2`}
                      >
                        <p className="text-sm mb-1">{message.text}</p>
                        <div className="flex items-center justify-end gap-1 text-xs opacity-70">
                          <span>{message.timestamp}</span>
                          {message.sender === "me" && (
                            <CheckCheck
                              className={`w-4 h-4 ${
                                message.read ? "text-blue-200" : "text-white"
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2"
                  >
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#0084ca] focus:border-transparent"
                      ></textarea>
                    </div>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <Button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="bg-[#0084ca] hover:bg-[#006ba6] text-white h-11 px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <User className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
