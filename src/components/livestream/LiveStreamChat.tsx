import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useLiveComments } from "@/hooks/useLiveComments";

interface LiveStreamChatProps {
  streamId?: string;
}

const watchingUsers = [
  { name: "fauchh", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50" },
  { name: "jj3323", initial: "J", color: "bg-yellow-200 text-yellow-800" },
  { name: "shaqanda", initial: "S", color: "bg-green-500 text-white" },
  { name: "jayden2_", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=50" },
  { name: "mindofderrick", initial: "M", color: "bg-green-500 text-white" },
  { name: "terriall44706", initial: "T", color: "bg-green-500 text-white" },
];

const joinedMessages = [
  { name: "fauchh", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50" },
  { name: "jj3323", initial: "J", color: "bg-yellow-200 text-yellow-800" },
  { name: "shaqanda", initial: "S", color: "bg-green-500 text-white" },
  { name: "jayden2_", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=50" },
  { name: "mindofderrick", initial: "M", color: "bg-green-500 text-white" },
  { name: "terriall44706", initial: "T", color: "bg-green-500 text-white" },
];

const LiveStreamChat = ({ streamId = "live-default" }: LiveStreamChatProps) => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "watching">("chat");
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
      {/* Chat/Watching Tabs */}
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === "chat"
              ? "text-foreground border-b-2 border-secondary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === "watching"
              ? "text-foreground border-b-2 border-secondary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("watching")}
        >
          Watching
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Joined messages */}
            {joinedMessages.map((user, i) => (
              <div key={`joined-${i}`} className="flex items-center gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : null}
                  <AvatarFallback className={user.color || ""}>{(user.initial || user.name[0]).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-sm text-foreground">{user.name}</span>
                  <span className="text-sm text-muted-foreground ml-1">joined 🤙</span>
                </div>
              </div>
            ))}

            {/* Real comments */}
            {comments.map((chat) => (
              <div key={chat.id} className="flex items-start gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>{(chat.username || "U")[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-foreground">{chat.username || "User"}</span>
                  {chat.message && (
                    <span className="text-sm text-muted-foreground ml-1 break-words">{chat.message}</span>
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
                className="pr-10 bg-muted border-border rounded-full"
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
            {/* Emoji bar */}
            <div className="flex items-center gap-2 mt-2 justify-center">
              <button className="text-lg hover:scale-110 transition-transform">🔥</button>
              <button className="text-lg hover:scale-110 transition-transform">✏️</button>
              <button className="text-lg hover:scale-110 transition-transform">🎯</button>
              <button className="text-lg hover:scale-110 transition-transform">💰</button>
              <button className="text-lg hover:scale-110 transition-transform">⚙️</button>
            </div>
          </div>
        </>
      ) : (
        /* Watching Tab */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">{watchingUsers.length} viewers</p>
          {watchingUsers.map((user, i) => (
            <div key={`watching-${i}`} className="flex items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : null}
                <AvatarFallback className={user.color || ""}>{(user.initial || user.name[0]).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveStreamChat;
