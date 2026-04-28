import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Paperclip, Smile, Loader2, Image, X } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  darkMode?: boolean;
}

export function MessageInput({ 
  onSend, 
  placeholder = "Type a message...", 
  disabled = false,
  loading = false,
  darkMode = false
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled && !loading) {
      onSend(text.trim());
      setText("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const bg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200";
  const text_ = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const buttonHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className={`p-4 border-t ${bg}`}>
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputBg}`}>
              <Image className="w-4 h-4 text-[#0084ca]" />
              <span className={`text-sm truncate max-w-32 ${text_}`}>{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className={`p-0.5 rounded ${buttonHover}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Attachment button */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <button
            type="button"
            disabled={disabled}
            className={`p-2.5 rounded-xl transition-colors ${buttonHover} ${muted} disabled:opacity-50`}
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Message input */}
        <div className={`flex-1 relative border rounded-2xl ${inputBg}`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`w-full px-4 py-3 bg-transparent resize-none outline-none ${text_} placeholder:${muted} max-h-32`}
            style={{
              minHeight: '44px',
              height: 'auto',
              overflowY: text.split('\n').length > 3 ? 'scroll' : 'hidden'
            }}
          />
        </div>

        {/* Emoji button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className={`p-2.5 rounded-xl transition-colors ${buttonHover} ${muted} disabled:opacity-50`}
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Simple emoji picker */}
          {showEmojiPicker && (
            <div className={`absolute bottom-full right-0 mb-2 p-3 rounded-xl border shadow-lg ${bg} z-10`}>
              <div className="grid grid-cols-6 gap-1">
                {['😀', '😊', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setText(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() || disabled || loading}
          className="w-11 h-11 flex items-center justify-center bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Send message"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      {/* Helper text */}
      <p className={`text-xs text-center mt-2 ${muted}`}>
        Press Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
}
