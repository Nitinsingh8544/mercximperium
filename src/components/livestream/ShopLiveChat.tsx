import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile } from "lucide-react";

const chatMessages = [
  {
    id: 1,
    user: "Amazon Customer",
    timestamp: "0:00:00",
    message: "Hi",
    isHighlighted: false
  },
  {
    id: 2,
    user: "Meeeee",
    timestamp: "",
    message: "",
    isHighlighted: true
  },
  {
    id: 3,
    user: "Amazon Customer",
    timestamp: "0:30:19",
    message: "Hello",
    isHighlighted: false
  },
  {
    id: 4,
    user: "StyleLover",
    timestamp: "0:31:00",
    message: "Great collection!",
    isHighlighted: false
  },
  {
    id: 5,
    user: "FashionFan",
    timestamp: "0:32:15",
    message: "What size is available?",
    isHighlighted: false
  },
  {
    id: 6,
    user: "ShopperQueen",
    timestamp: "0:33:45",
    message: "Love the colors! 🔥",
    isHighlighted: false
  },
];

const ShopLiveChat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="bg-card rounded-xl border border-border h-fit max-h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[400px]">
        {chatMessages.map((chat) => (
          <div key={chat.id} className="flex gap-2">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {chat.user.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs text-foreground">{chat.user}</span>
                {chat.timestamp && (
                  <span className="text-[10px] text-muted-foreground">• {chat.timestamp}</span>
                )}
              </div>
              {chat.message && (
                <p className="text-sm text-muted-foreground break-words">{chat.message}</p>
              )}
            </div>
          </div>
        ))}
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
              className="pr-10 bg-muted border-border text-sm h-9"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              disabled={!message.trim()}
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
