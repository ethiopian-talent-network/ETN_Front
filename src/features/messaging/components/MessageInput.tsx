import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
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
          disabled={!text.trim()}
          className="bg-[#0084ca] hover:bg-[#006ba6] text-white h-11 px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
}
