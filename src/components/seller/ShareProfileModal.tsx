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
      color: "bg-[#1877F2]",
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, "_blank")
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      color: "bg-[#1DA1F2]",
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check out ${userName}'s profile!`, "_blank")
    },
    { 
      name: "WhatsApp", 
      icon: MessageCircle, 
      color: "bg-[#25D366]",
      onClick: () => window.open(`https://wa.me/?text=Check out ${userName}'s profile! ${profileUrl}`, "_blank")
    },
    { 
      name: "Email", 
      icon: Mail, 
      color: "bg-[#8B4513]",
      onClick: () => window.open(`mailto:?subject=Check out ${userName}'s profile&body=${profileUrl}`, "_blank")
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-[#1a3a3a] border-[#20b2aa]/30">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Share Profile</DialogTitle>
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
                <span className="text-xs text-[#a0c4c4]">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#20b2aa]/20" />
            <span className="text-xs text-[#a0c4c4]">or copy link</span>
            <div className="flex-1 h-px bg-[#20b2aa]/20" />
          </div>

          {/* Copy Link Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0c4c4]" />
              <Input
                value={profileUrl}
                readOnly
                className="pl-10 bg-[#2d5a5a] border-[#20b2aa]/30 text-[#a0c4c4] text-sm"
              />
            </div>
            <Button
              onClick={handleCopyLink}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* QR Code placeholder */}
          <div className="flex flex-col items-center gap-2 p-4 bg-[#2d5a5a] rounded-lg">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              <div className="w-20 h-20 bg-[#1a3a3a] rounded grid grid-cols-3 gap-0.5 p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${[0, 2, 3, 5, 6, 8].includes(i) ? 'bg-[#8B4513]' : 'bg-white'} rounded-sm`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#a0c4c4]">Scan to view profile</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileModal;
