import { User } from "lucide-react";

interface EmptyStateProps {
  darkMode?: boolean;
}

export function EmptyState({ darkMode }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <User className="w-16 h-16 mx-auto mb-4" />
        <p>Select a conversation to start messaging</p>
      </div>
    </div>
  );
}
