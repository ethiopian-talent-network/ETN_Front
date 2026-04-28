import { useState, useEffect, useRef, useCallback } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Header } from "../talents/components/Header";
import {
  Search, Send, ArrowLeft, MessageSquare,
  Loader2, CheckCheck, Check, RefreshCw, UserPlus, X, Users,
} from "lucide-react";
import {
  getConversations,
  getRealMessages,
  sendRealMessage,
  markConversationRead,
  getTalentProfile,
  getMyConnections,
  type Conversation,
  type RealMessage,
  type Connection,
} from "../../api/talent/talentApi";

export default function MessagingPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const dm = darkMode;

  const [userImage, setUserImage] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<RealMessage[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [newMsgSearch, setNewMsgSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getTalentProfile()
      .then((p) => { if (p.data.profile_image) setUserImage(p.data.profile_image); })
      .catch(() => {});
    loadConversations();
    loadConnections();
  }, []);

  // Poll for new messages every 5s when a conversation is open
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (activeConv) {
      pollRef.current = setInterval(() => {
        loadMessages(activeConv.user_id, true);
        loadConversations(true);
      }, 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async (silent = false) => {
    if (!silent) setLoadingConvs(true);
    try {
      const res = await getConversations();
      setConversations(res.conversations || []);
    } catch {}
    finally { setLoadingConvs(false); }
  };

  const loadConnections = async () => {
    try {
      const res = await getMyConnections();
      setConnections(res.connections || []);
    } catch {}
  };

  const loadMessages = async (userId: number, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const res = await getRealMessages(userId);
      setMessages(res.messages || []);
      // Update unread count in sidebar
      setConversations((prev) =>
        prev.map((c) => c.user_id === userId ? { ...c, unread_count: 0 } : c)
      );
    } catch {}
    finally { setLoadingMsgs(false); }
  };

  const selectConversation = useCallback(async (conv: Conversation) => {
    setActiveConv(conv);
    setShowSidebar(false);
    await loadMessages(conv.user_id);
    await markConversationRead(conv.user_id).catch(() => {});
    inputRef.current?.focus();
  }, []);

  const startConversation = useCallback(async (conn: Connection) => {
    setShowNewMsg(false);
    setNewMsgSearch("");
    // Build a Conversation-like object from the connection
    const conv: Conversation = {
      user_id: conn.talent_id ?? conn.sender_id ?? 0,
      name: conn.name,
      profile_image: conn.profile_image,
      last_message: "",
      last_message_at: new Date().toISOString(),
      unread_count: 0,
    };
    setActiveConv(conv);
    setShowSidebar(false);
    await loadMessages(conv.user_id);
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!text.trim() || !activeConv || sending) return;
    const content = text.trim();
    setText("");

    // Optimistic update
    const optimistic: RealMessage = {
      id: Date.now(),
      sender_id: user?.id ?? 0,
      reciver_id: activeConv.user_id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender_name: user?.name ?? "",
      sender_image: userImage,
    };
    setMessages((prev) => [...prev, optimistic]);

    setSending(true);
    try {
      await sendRealMessage(activeConv.user_id, content);
      await loadMessages(activeConv.user_id, true);
      await loadConversations(true);
    } catch (err: any) {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setText(content);
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_message?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  const formatTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMsgTime = (d: string) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; msgs: RealMessage[] }[]>((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const last = acc[acc.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else acc.push({ date, msgs: [msg] });
    return acc;
  }, []);

  const bg = dm ? "bg-gray-900" : "bg-slate-100";
  const sidebar = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200";
  const chatBg = dm ? "bg-gray-900" : "bg-slate-50";
  const inputBg = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200";
  const text_ = dm ? "text-white" : "text-gray-900";
  const muted = dm ? "text-gray-400" : "text-gray-500";
  const hoverRow = dm ? "hover:bg-gray-700" : "hover:bg-slate-50";
  const activeRow = dm ? "bg-gray-700" : "bg-[#0084ca]/10";

  return (
    <div className={`flex flex-col h-screen ${bg} transition-colors duration-300`}>
      <Header darkMode={dm} toggleDarkMode={toggleDarkMode} userImage={userImage} onImageUpload={() => {}} />

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-4">
        <div className={`flex w-full h-full rounded-none sm:rounded-2xl overflow-hidden border ${dm ? "border-gray-700" : "border-slate-200"} shadow-lg`}>

          {/* ── Sidebar ── */}
          <div className={`${showSidebar ? "flex" : "hidden"} sm:flex flex-col w-full sm:w-80 lg:w-96 flex-shrink-0 border-r ${sidebar}`}>

            {/* Sidebar header */}
            <div className={`px-4 py-4 border-b ${dm ? "border-gray-700" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${text_}`}>
                  Messages
                  {totalUnread > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-[#0084ca] text-white rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setShowNewMsg(true); setNewMsgSearch(""); }}
                    title="New message"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0084ca] hover:bg-[#006ba6] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> New
                  </button>
                  <button onClick={() => loadConversations()} className={`p-1.5 rounded-lg transition-colors ${dm ? "hover:bg-gray-700 text-gray-400" : "hover:bg-slate-100 text-gray-500"}`}>
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${dm ? "bg-gray-700 border-gray-600" : "bg-slate-100 border-slate-200"}`}>
                <Search className={`w-4 h-4 flex-shrink-0 ${muted}`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className={`flex-1 bg-transparent outline-none text-sm ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                />
              </div>
            </div>

            {/* New Message picker */}
            {showNewMsg && (
              <div className={`border-b ${dm ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-slate-50"}`}>
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>Connected Talents</p>
                    <button onClick={() => setShowNewMsg(false)} className={`p-1 rounded ${dm ? "hover:bg-gray-700 text-gray-400" : "hover:bg-slate-200 text-gray-500"}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${dm ? "bg-gray-700 border-gray-600" : "bg-white border-slate-200"}`}>
                    <Search className={`w-3.5 h-3.5 ${muted}`} />
                    <input
                      autoFocus
                      type="text"
                      value={newMsgSearch}
                      onChange={(e) => setNewMsgSearch(e.target.value)}
                      placeholder="Search connections..."
                      className={`flex-1 bg-transparent outline-none text-sm ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                    />
                  </div>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {connections.length === 0 ? (
                    <div className={`text-center py-6 px-4 ${muted}`}>
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-25" />
                      <p className="text-xs">No connections yet</p>
                    </div>
                  ) : (
                    connections
                      .filter((c) => !newMsgSearch || c.name.toLowerCase().includes(newMsgSearch.toLowerCase()))
                      .map((conn) => (
                        <button
                          key={conn.id}
                          onClick={() => startConversation(conn)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${hoverRow}`}
                        >
                          {conn.profile_image ? (
                            <img src={conn.profile_image} alt={conn.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(conn.name)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${text_}`}>{conn.name}</p>
                            {conn.about && <p className={`text-xs truncate ${muted}`}>{conn.about}</p>}
                          </div>
                          <Send className={`w-3.5 h-3.5 flex-shrink-0 ${muted}`} />
                        </button>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0084ca]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className={`text-center py-16 px-4 ${muted}`}>
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-25" />
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-1 mb-4">Start a conversation with your connections</p>
                  <button
                    onClick={() => { setShowNewMsg(true); setNewMsgSearch(""); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0084ca] hover:bg-[#006ba6] text-white text-xs font-semibold rounded-lg transition-colors mx-auto"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> New Message
                  </button>
                </div>
              ) : (
                filtered.map((conv) => {
                  const isActive = activeConv?.user_id === conv.user_id;
                  return (
                    <button
                      key={conv.user_id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${isActive ? activeRow : hoverRow}`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {conv.profile_image ? (
                          <img src={conv.profile_image} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {getInitials(conv.name)}
                          </div>
                        )}
                        {conv.unread_count > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0084ca] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unread_count > 9 ? "9+" : conv.unread_count}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold truncate ${text_}`}>{conv.name}</p>
                          <span className={`text-xs flex-shrink-0 ml-2 ${muted}`}>{formatTime(conv.last_message_at)}</span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? (dm ? "text-gray-200 font-medium" : "text-gray-700 font-medium") : muted}`}>
                          {conv.last_message || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat area ── */}
          <div className={`${!showSidebar ? "flex" : "hidden"} sm:flex flex-col flex-1 ${chatBg}`}>
            {activeConv ? (
              <>
                {/* Chat header */}
                <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${dm ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-white shadow-sm"}`}>
                  <button
                    onClick={() => setShowSidebar(true)}
                    className={`sm:hidden p-1.5 rounded-lg mr-1 ${dm ? "hover:bg-gray-700 text-gray-400" : "hover:bg-slate-100 text-gray-500"}`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {activeConv.profile_image ? (
                    <img src={activeConv.profile_image} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {getInitials(activeConv.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${text_}`}>{activeConv.name}</p>
                    <p className={`text-xs ${muted}`}>Tap to view profile</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0084ca]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-full ${muted}`}>
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="text-xs mt-1">Say hello to {activeConv.name}!</p>
                    </div>
                  ) : (
                    groupedMessages.map(({ date, msgs }) => (
                      <div key={date}>
                        {/* Date separator */}
                        <div className="flex items-center gap-3 my-4">
                          <div className={`flex-1 h-px ${dm ? "bg-gray-700" : "bg-slate-300"}`} />
                          <span className={`text-xs px-3 py-1 rounded-full ${dm ? "bg-gray-700 text-gray-400" : "bg-slate-200 text-gray-500"}`}>{date}</span>
                          <div className={`flex-1 h-px ${dm ? "bg-gray-700" : "bg-slate-300"}`} />
                        </div>

                        <div className="space-y-1.5">
                          {msgs.map((msg, idx) => {
                            const isMe = msg.sender_id === user?.id;
                            const showAvatar = !isMe && (idx === 0 || msgs[idx - 1]?.sender_id !== msg.sender_id);
                            const showName = showAvatar;

                            return (
                              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                                {/* Other user avatar */}
                                {!isMe && (
                                  <div className="w-7 h-7 flex-shrink-0">
                                    {showAvatar ? (
                                      activeConv.profile_image ? (
                                        <img src={activeConv.profile_image} alt="" className="w-7 h-7 rounded-full object-cover" />
                                      ) : (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                          {getInitials(activeConv.name)}
                                        </div>
                                      )
                                    ) : null}
                                  </div>
                                )}

                                <div className={`max-w-[70%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                                  {showName && !isMe && (
                                    <span className={`text-xs mb-1 ml-1 ${muted}`}>{activeConv.name}</span>
                                  )}
                                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    isMe
                                      ? "bg-[#0084ca] text-white rounded-br-sm"
                                      : dm
                                      ? "bg-gray-700 text-gray-100 rounded-bl-sm"
                                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-slate-200"
                                  }`}>
                                    {msg.content}
                                  </div>
                                  <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-[10px] ${muted}`}>{formatMsgTime(msg.created_at)}</span>
                                    {isMe && (
                                      msg.is_read
                                        ? <CheckCheck className="w-3 h-3 text-[#0084ca]" />
                                        : <Check className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`px-4 py-3 border-t ${dm ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-white"}`}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${dm ? "bg-gray-700 border-gray-600" : "bg-slate-100 border-slate-300"}`}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder={`Message ${activeConv.name}...`}
                      className={`flex-1 bg-transparent outline-none text-sm ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!text.trim() || sending}
                      className="w-8 h-8 flex items-center justify-center bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full transition-colors disabled:opacity-40 flex-shrink-0"
                    >
                      {sending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className={`text-[10px] text-center mt-1.5 ${muted}`}>Press Enter to send</p>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className={`flex flex-col items-center justify-center h-full ${muted}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${dm ? "bg-gray-800" : "bg-slate-200"}`}>
                  <MessageSquare className="w-10 h-10 opacity-30" />
                </div>
                <p className={`text-lg font-semibold ${text_}`}>Your Messages</p>
                <p className="text-sm mt-1">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
