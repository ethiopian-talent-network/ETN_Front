import { ArrowLeft, MoreVertical, Phone, Video, Info } from "lucide-react";
import { Link } from "react-router";
import type { User } from "../types";

interface ChatHeaderProps {
  user: User | undefined;
  conversationId?: string;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
  darkMode?: boolean;
  showBackButton?: boolean;
}

export function ChatHeader({
  user,
  conversationId,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
  darkMode = false,
  showBackButton = false,
}: ChatHeaderProps) {
  if (!user) return null;

  const getInitials = (name: string) => 
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const bg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const buttonHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b ${bg} shadow-sm`}>
      {/* Back button (mobile) */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors ${buttonHover} ${muted} sm:hidden`}
          title="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* User avatar */}
      <div className="relative flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(user.name)}
          </div>
        )}
        {user.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate ${text}`}>{user.name}</h3>
        <p className={`text-sm truncate ${muted}`}>
          {user.online ? "Active now" : user.role || "Offline"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {conversationId && (
          <Link to={`/freelancer-public-profile/${conversationId}`}>
            <button
              className={`px-3 py-1.5 text-xs font-medium bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-lg transition-colors`}
            >
              View Profile
            </button>
          </Link>
        )}
        
        {onCall && (
          <button
            onClick={onCall}
            className={`p-2 rounded-lg transition-colors ${buttonHover} ${muted}`}
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
        )}
        
        {onVideoCall && (
          <button
            onClick={onVideoCall}
            className={`p-2 rounded-lg transition-colors ${buttonHover} ${muted}`}
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
        )}
        
        {onInfo && (
          <button
            onClick={onInfo}
            className={`p-2 rounded-lg transition-colors ${buttonHover} ${muted}`}
            title="User info"
          >
            <Info className="w-5 h-5" />
          </button>
        )}
        
        <button
          className={`p-2 rounded-lg transition-colors ${buttonHover} ${muted}`}
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
