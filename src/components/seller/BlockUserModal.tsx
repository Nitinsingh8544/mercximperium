import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onBlocked?: () => void;
}

const consequences = [
  "Prevent their stories from being shown to you",
  "Prevent them from messaging you",
  "Prevent them from joining your future shows",
  "Prevent their messages from displaying during a show",
  "Prevent them from seeing your listings and making future purchases from you",
];

const BlockUserModal = ({ isOpen, onClose, username, onBlocked }: Props) => {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleBlock = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("user_blocks")
      .insert({ user_id: user.id, blocked_username: username });
    setBusy(false);
    if (error && !error.message.includes("duplicate")) {
      toast({ title: "Could not block", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Blocked", description: `@${username} has been blocked.` });
    onBlocked?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-foreground pr-6">
          Blocking <span className="text-primary">{username}</span> will:
        </h3>
        <ul className="space-y-3 mt-2">
          {consequences.map((c) => (
            <li key={c} className="flex items-start gap-3 text-sm text-foreground">
              <Ban className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={handleBlock}
            disabled={busy}
          >
            Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
