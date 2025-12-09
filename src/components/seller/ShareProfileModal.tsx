import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Twitter, MessageCircle, Mail, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const ShareProfileModal = ({ isOpen, onClose, userName }: ShareProfileModalProps) => {
  const profileUrl = `${window.location.origin}/seller/${userName.toLowerCase().replace(/\s+/g, "-")}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard.",
    });
  };

  const shareOptions = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      color: "bg-[hsl(214,89%,52%)]",
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, "_blank")
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      color: "bg-[hsl(203,89%,53%)]",
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check out ${userName}'s profile!`, "_blank")
    },
    { 
      name: "WhatsApp", 
      icon: MessageCircle, 
      color: "bg-[hsl(142,70%,49%)]",
      onClick: () => window.open(`https://wa.me/?text=Check out ${userName}'s profile! ${profileUrl}`, "_blank")
    },
    { 
      name: "Email", 
      icon: Mail, 
      color: "bg-primary",
      onClick: () => window.open(`mailto:?subject=Check out ${userName}'s profile&body=${profileUrl}`, "_blank")
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">Share Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Options */}
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`${option.color} p-3 rounded-full text-white transition-transform group-hover:scale-110`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or copy link</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Copy Link Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profileUrl}
                readOnly
                className="pl-10 bg-muted border-border text-muted-foreground text-sm"
              />
            </div>
            <Button
              onClick={handleCopyLink}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* QR Code placeholder */}
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <div className="w-24 h-24 bg-background rounded-lg flex items-center justify-center">
              <div className="w-20 h-20 bg-foreground/10 rounded grid grid-cols-3 gap-0.5 p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${[0, 2, 3, 5, 6, 8].includes(i) ? 'bg-primary' : 'bg-background'} rounded-sm`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Scan to view profile</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileModal;