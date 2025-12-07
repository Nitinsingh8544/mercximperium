import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Copy, X } from "lucide-react";
import { toast } from "sonner";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const ShareProfileModal = ({ isOpen, onClose, userName }: ShareProfileModalProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${userName}'s profile!`);
    
    const shareUrls: Record<string, string> = {
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const shareOptions = [
    { id: "copy", label: "Copy link", icon: <Copy className="w-5 h-5" />, color: "bg-muted", onClick: handleCopyLink },
    { id: "reddit", label: "Reddit", icon: <span className="text-xl">🔴</span>, color: "bg-orange-500", onClick: () => handleShare("reddit") },
    { id: "whatsapp", label: "WhatsApp", icon: <span className="text-xl">📱</span>, color: "bg-green-500", onClick: () => handleShare("whatsapp") },
    { id: "x", label: "X", icon: <X className="w-5 h-5 text-white" />, color: "bg-black", onClick: () => handleShare("x") },
    { id: "facebook", label: "Facebook", icon: <span className="text-xl">📘</span>, color: "bg-blue-600", onClick: () => handleShare("facebook") },
    { id: "more", label: "More", icon: <span className="text-2xl text-muted-foreground">•••</span>, color: "bg-muted", onClick: () => {} },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share {userName}'s profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search users */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-10 bg-muted/50 border-border"
            />
          </div>

          {/* Sample user */}
          <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              D
            </div>
            <span className="text-foreground text-sm">domgotti30...</span>
          </div>

          {/* Share options */}
          <div className="flex justify-between pt-4 border-t border-border">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className="flex flex-col items-center gap-2 p-2 hover:opacity-80 transition-opacity"
              >
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center`}>
                  {option.icon}
                </div>
                <span className="text-xs text-muted-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileModal;
