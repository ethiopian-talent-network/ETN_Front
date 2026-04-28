import { Search, Users, X, Send } from "lucide-react";
import { useState } from "react";

interface Connection {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  about?: string;
  online?: boolean;
}

interface ConnectionsListProps {
  connections: Connection[];
  onSelect: (connection: Connection) => void;
  onClose: () => void;
  darkMode?: boolean;
  loading?: boolean;
}

export function ConnectionsList({
  connections,
  onSelect,
  onClose,
  darkMode = false,
  loading = false,
}: ConnectionsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const bg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200";
  const hoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={`border-b ${bg}`}>
      {/* Header */}
      <div className={`px-4 pt-3 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold uppercase tracking-wide ${muted}`}>
            Start New Conversation
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputBg}`}>
          <Search className={`w-4 h-4 ${muted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections..."
            className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
            autoFocus
          />
        </div>
      </div>

      {/* Connections List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0084ca]"></div>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className={`text-center py-8 px-4 ${muted}`}>
            <Users className="w-8 h-8 mx-auto mb-2 opacity-25" />
            <p className="text-sm">
              {searchQuery ? "No connections found" : "No connections yet"}
            </p>
            {!searchQuery && (
              <p className="text-xs mt-1">Connect with talents to start messaging</p>
            )}
          </div>
        ) : (
          <div>
            {filteredConnections.map((connection) => (
              <button
                key={connection.id}
                onClick={() => onSelect(connection)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${hoverBg}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {connection.avatar ? (
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(connection.name)}
                    </div>
                  )}
                  {connection.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${text}`}>
                    {connection.name}
                  </h4>
                  {connection.role && (
                    <p className={`text-sm truncate ${muted}`}>
                      {connection.role}
                    </p>
                  )}
                  {connection.about && (
                    <p className={`text-xs truncate ${muted} mt-0.5`}>
                      {connection.about}
                    </p>
                  )}
                </div>

                {/* Send icon */}
                <Send className={`w-4 h-4 flex-shrink-0 ${muted}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}