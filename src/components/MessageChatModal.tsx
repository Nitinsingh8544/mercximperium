import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Send } from "lucide-react";

interface MessageChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userInitial: string;
}

const MessageChatModal = ({ isOpen, onClose, userName, userInitial }: MessageChatModalProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col p-0 bg-background border-border">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {userInitial}
          </div>
          <span className="font-semibold text-foreground">{userName}</span>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">
            {userInitial}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{userName}</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Profile
          </Button>
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Image className="w-5 h-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-muted/50 border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSend}
              className="text-primary hover:text-primary/80"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageChatModal;
