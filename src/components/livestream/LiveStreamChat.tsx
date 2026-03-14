import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Send } from "lucide-react";
import { useLiveComments } from "@/hooks/useLiveComments";

interface LiveStreamChatProps {
  streamId?: string;
}

const LiveStreamChat = ({ streamId = "live-default" }: LiveStreamChatProps) => {
  const [message, setMessage] = useState("");
  const { comments, sendComment } = useLiveComments(streamId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendComment(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border h-fit max-h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex border-b border-border">
        <div className="flex-1 py-3 text-sm font-medium text-foreground border-b-2 border-secondary text-center">
          Chat
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[400px]">
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No messages yet. Be the first to chat!
          </p>
        )}
        {comments.map((chat) => (
          <div key={chat.id} className="flex gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>{(chat.username || "U")[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{chat.username || "User"}</span>
              </div>
              {chat.message && (
                <p className="text-sm text-muted-foreground break-words">{chat.message}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-border">
        <div className="relative">
          <Input
            placeholder="Say something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10 bg-muted border-border"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            disabled={!message.trim()}
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamChat;
