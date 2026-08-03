import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Users } from "lucide-react";
import { useLiveComments } from "@/hooks/useLiveComments";
import { useAuth } from "@/hooks/useAuth";

const QUICK_REACTIONS = ["🔥", "😍", "👏", "💰", "🙌", "❤️"];

const avatarTones = [
  "bg-primary/15 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-destructive/15 text-destructive",
  "bg-muted text-foreground",
];

const toneFor = (name: string) =>
  avatarTones[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTones.length];

interface LiveChatPanelProps {
  streamId: string;
  viewers?: number;
}

const LiveChatPanel = ({ streamId, viewers }: LiveChatPanelProps) => {
  const { comments, sendComment } = useLiveComments(streamId);
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async (text?: string) => {
    const value = (text ?? message).trim();
    if (!value) return;
    if (!text) setMessage("");
    await sendComment(value);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/15 via-secondary/15 to-transparent border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
            </span>
            <p className="text-sm font-semibold text-foreground">Live Chat</p>
          </div>
          {viewers != null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {viewers}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {comments.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 py-10">
            <Sparkles className="h-7 w-7 text-secondary" />
            <p className="text-sm font-medium text-foreground">It's quiet in here</p>
            <p className="text-xs text-muted-foreground">Be the first to say hello to the host.</p>
          </div>
        )}
        {comments.map((c) => {
          const mine = c.user_id === user?.id;
          const name = c.username || "User";
          return (
            <div
              key={c.id}
              className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 ${
                mine ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className={`text-[11px] font-semibold ${toneFor(name)}`}>
                  {name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[75%] ${mine ? "items-end text-right" : ""} flex flex-col`}>
                <span className="text-[10px] font-medium text-muted-foreground px-1">
                  {mine ? "You" : name}
                </span>
                <div
                  className={`rounded-2xl px-3 py-1.5 text-sm break-words ${
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {c.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Quick reactions */}
      <div className="px-3 pb-1 flex items-center gap-1.5 overflow-x-auto">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSend(emoji)}
            className="h-8 w-8 shrink-0 rounded-full bg-muted hover:bg-muted/70 text-base leading-none transition-transform active:scale-90"
            aria-label={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 pt-2 border-t border-border">
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Say something nice..."
            className="h-11 pr-11 rounded-full bg-muted border-border text-sm"
          />
          <Button
            size="icon"
            disabled={!message.trim()}
            onClick={() => handleSend()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatPanel;
