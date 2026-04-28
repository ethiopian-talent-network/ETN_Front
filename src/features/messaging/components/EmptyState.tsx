import { MessageSquare, Users, Send } from "lucide-react";

interface EmptyStateProps {
  darkMode?: boolean;
  onNewMessage?: () => void;
}

export function EmptyState({ darkMode = false, onNewMessage }: EmptyStateProps) {
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const bg = darkMode ? "bg-gray-800" : "bg-gray-100";

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 rounded-full ${bg} flex items-center justify-center mx-auto mb-6`}>
          <MessageSquare className={`w-10 h-10 ${muted} opacity-50`} />
        </div>
        
        <h3 className={`text-xl font-semibold mb-2 ${text}`}>Your Messages</h3>
        <p className={`text-sm mb-6 ${muted} leading-relaxed`}>
          Select a conversation to start chatting with talents and employers.
          Build connections and collaborate on amazing projects.
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-3 justify-center items-center ${muted}`}>
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-4 h-4" />
            <span>Connect with professionals</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Send className="w-4 h-4" />
            <span>Share ideas and collaborate</span>
          </div>
        </div>
        
        {onNewMessage && (
          <button
            onClick={onNewMessage}
            className="mt-6 px-6 py-2.5 bg-[#0084ca] hover:bg-[#006ba6] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start New Conversation
          </button>
        )}
      </div>
    </div>
  );
}
