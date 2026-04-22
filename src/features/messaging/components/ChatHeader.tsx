import { Link } from "react-router";
import { MoreVertical } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { User } from "../types";

interface ChatHeaderProps {
  user: User | undefined;
  conversationId: string;
}

export function ChatHeader({ user, conversationId }: ChatHeaderProps) {
  if (!user) return null;

  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {user.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600">
            {user.online ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/freelancer-public-profile/${conversationId}`}>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
