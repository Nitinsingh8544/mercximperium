import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile } from "lucide-react";
import { useLiveComments } from "@/hooks/useLiveComments";

interface ShopLiveChatProps {
  streamId?: string;
}

const ShopLiveChat = ({ streamId = "shop-live-default" }: ShopLiveChatProps) => {
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
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50">
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No messages yet. Be the first to chat!
          </p>
        )}
        {comments.map((chat) => (
          <div key={chat.id} className="flex gap-2">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {(chat.username || "U")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs text-foreground">{chat.username || "User"}</span>
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="relative flex-1">
            <Input
              placeholder="Say something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10 bg-muted border-border text-sm h-9"
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
    </div>
  );
};

export default ShopLiveChat;
