import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, ChevronDown, Send } from "lucide-react";

const chatMessages = [
  {
    id: 1,
    user: "alexramirezjr20",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50",
    message: "Navy size 9",
    stars: 0
  },
  {
    id: 2,
    user: "joshnichols773",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    message: "WHITE CEMENT AIR JORDAN RETRO 4 SZ: 9.5. will yu run em or these AIR JORDAN RETRO 4 WNTR SZ: 9? How much ya wantin for em???",
    stars: 0
  },
  {
    id: 3,
    user: "ness_619",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    message: "",
    stars: 5
  },
  {
    id: 4,
    user: "josieNikkole",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50",
    message: "I need those green ones in a 4.5y!",
    stars: 0
  },
  {
    id: 5,
    user: "noellebar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    message: "🔥🔥🔥🔥🔥🎁🔥🔥🔥🔥",
    stars: 0
  },
  {
    id: 6,
    user: "mrkarpio91",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50",
    message: "Sz?",
    stars: 0
  },
];

const LiveStreamChat = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "watching">("chat");
  const [message, setMessage] = useState("");

  return (
    <div className="bg-card rounded-xl border border-border h-fit max-h-[calc(100vh-120px)] flex flex-col">
      {/* Giveaway Banner */}
      <div className="p-3 border-b border-border">
        <button className="w-full flex items-center justify-between text-left hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-secondary" />
            <span className="font-medium text-foreground">Giveaway with 650 entries</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Chat/Watching Tabs */}
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "text-foreground border-b-2 border-secondary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "watching"
              ? "text-foreground border-b-2 border-secondary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("watching")}
        >
          Watching
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[400px]">
        {chatMessages.map((chat) => (
          <div key={chat.id} className="flex gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.user[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{chat.user}</span>
                {chat.stars > 0 && (
                  <div className="flex items-center">
                    {[...Array(chat.stars)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
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
        <div className="relative">
          <Input
            placeholder="Say something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-10 bg-muted border-border"
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
  );
};

export default LiveStreamChat;
