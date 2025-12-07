import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Image, Smile, MoreVertical } from "lucide-react";

interface MessageChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userInitial: string;
  userImage?: string;
}

const MessageChatModal = ({ 
  isOpen, 
  onClose, 
  userName, 
  userInitial,
  userImage 
}: MessageChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "seller", text: "Hi! Thanks for checking out my store 👋", time: "2:30 PM" },
    { id: 2, sender: "seller", text: "Let me know if you have any questions about the products!", time: "2:30 PM" },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "user", text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-[#1a3a3a] border-[#20b2aa]/30 overflow-hidden h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 bg-[#2d5a5a] border-b border-[#20b2aa]/20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-[#a0c4c4] hover:text-white hover:bg-[#20b2aa]/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-[#20b2aa]">
            <AvatarImage src={userImage} />
            <AvatarFallback className="bg-[#8B4513] text-white font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{userName}</h3>
            <p className="text-xs text-[#20b2aa]">● Online</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-[#a0c4c4] hover:text-white hover:bg-[#20b2aa]/20"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#1a3a3a] to-[#2d5a5a]/50">
          {/* Date Separator */}
          <div className="flex justify-center">
            <span className="text-xs text-[#a0c4c4] bg-[#2d5a5a] px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.sender === "user" 
                    ? "bg-[#8B4513] text-white rounded-br-md" 
                    : "bg-[#2d5a5a] text-white rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-white/60" : "text-[#a0c4c4]"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-[#20b2aa]/20 bg-[#2d5a5a]/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Is this available?", "What's the lowest?", "Can you ship today?"].map((quick) => (
              <button
                key={quick}
                onClick={() => setMessage(quick)}
                className="flex-shrink-0 px-3 py-1.5 bg-[#2d5a5a] text-[#20b2aa] text-xs rounded-full border border-[#20b2aa]/30 hover:bg-[#20b2aa]/20 transition-colors"
              >
                {quick}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#2d5a5a] border-t border-[#20b2aa]/20">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#a0c4c4] hover:text-[#20b2aa] hover:bg-[#20b2aa]/10"
            >
              <Image className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#a0c4c4] hover:text-[#20b2aa] hover:bg-[#20b2aa]/10"
            >
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-[#1a3a3a] border-[#20b2aa]/30 text-white placeholder:text-[#a0c4c4] focus-visible:ring-[#20b2aa]"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white disabled:opacity-50"
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
