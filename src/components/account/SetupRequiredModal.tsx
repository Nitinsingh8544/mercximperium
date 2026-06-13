import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SetupRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: () => void;
}

const SetupRequiredModal = ({ open, onOpenChange, onAddPayment }: SetupRequiredModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-bold">Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-1">
          <div className="flex items-center gap-3 py-4">
            <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Payment Method</p>
              <p className="text-xs text-muted-foreground">Add a payment method for bids and purchases</p>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
              onClick={() => {
                onOpenChange(false);
                onAddPayment();
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-center gap-3 py-4">
            <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Shipping Address</p>
              <p className="text-xs text-muted-foreground">Add and manage your shipping address.</p>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
              onClick={() => {
                onOpenChange(false);
                navigate("/addresses");
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetupRequiredModal;
