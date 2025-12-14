import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAccountModal = ({ open, onOpenChange }: DeleteAccountModalProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }

    toast({ 
      title: "Account deletion request submitted", 
      description: "We'll process your request within 30 days." 
    });
    onOpenChange(false);
    setReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tell us about why you'd like to delete your account
        </p>

        <div className="space-y-4">
          <div>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a reason *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-using">Not using the service anymore</SelectItem>
                <SelectItem value="privacy">Privacy concerns</SelectItem>
                <SelectItem value="experience">Bad experience</SelectItem>
                <SelectItem value="alternatives">Found better alternatives</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us more *"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleSubmit}
          >
            Permanently Delete Account
          </Button>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
