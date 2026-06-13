import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "@/hooks/use-toast";

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: () => void;
}

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

const AddPaymentMethodModal = ({ open, onOpenChange, onAdded }: AddPaymentMethodModalProps) => {
  const { addMethod } = usePaymentMethods();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("India");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCountry("India");
  };

  const handleConfirm = async () => {
    const cleanedNum = cardNumber.replace(/\s/g, "");
    if (cleanedNum.length < 13) {
      toast({ title: "Invalid card number", variant: "destructive" });
      return;
    }
    const [mm, yy] = expiry.split("/");
    const month = parseInt(mm || "", 10);
    const year = parseInt(yy || "", 10);
    if (!month || month < 1 || month > 12 || !year) {
      toast({ title: "Invalid expiration date", variant: "destructive" });
      return;
    }
    if (cvv.length < 3) {
      toast({ title: "Invalid security code", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await addMethod({
      cardNumber: cleanedNum,
      expMonth: month,
      expYear: 2000 + year,
      country,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Could not save card", description: (error as Error).message, variant: "destructive" });
      return;
    }
    toast({ title: "Payment method added" });
    reset();
    onAdded?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-bold">Add Payment Method</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-3">
          <div className="relative bg-muted/60 rounded-xl px-4 py-3">
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="Card number"
              inputMode="numeric"
              className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0 placeholder:text-muted-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-blue-700 border">VISA</span>
              <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-red-600 border">MC</span>
              <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-blue-900 border">AMEX</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/60 rounded-xl px-4 py-3">
              <Input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                inputMode="numeric"
                className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0"
              />
            </div>
            <div className="bg-muted/60 rounded-xl px-4 py-3 relative">
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="CVV"
                inputMode="numeric"
                className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0 pr-10"
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-muted/60 rounded-xl px-4 py-2">
            <p className="text-[10px] text-muted-foreground">Country</p>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-transparent border-0 px-0 h-auto text-base focus:ring-0 [&>svg]:opacity-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-[11px] text-muted-foreground leading-snug pt-1">
            By providing your card information, you allow MercxImperium to charge your card for future payments in accordance with their terms.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              className="rounded-full h-11"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Back
            </Button>
            <Button
              className="rounded-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleConfirm}
              disabled={saving}
            >
              {saving ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodModal;
