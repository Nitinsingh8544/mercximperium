import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const REPORT_REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "fake", label: "Fake or counterfeit products" },
  { value: "violence", label: "Violence or dangerous acts" },
  { value: "copyright", label: "Copyright infringement" },
  { value: "other", label: "Other" },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamName?: string;
}

const ReportModal = ({ isOpen, onClose, streamName }: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    if (!reason) return;
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe. We'll review this shortly.",
    });
    setReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Report {streamName ? `"${streamName}"` : "this stream"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">Why are you reporting this?</p>
          <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <div key={r.value} className="flex items-center space-x-2">
                <RadioGroupItem value={r.value} id={r.value} />
                <Label htmlFor={r.value} className="text-sm text-foreground cursor-pointer">{r.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {reason === "other" && (
            <Textarea
              placeholder="Please describe the issue..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[80px]"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!reason || (reason === "other" && !customReason.trim())}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
