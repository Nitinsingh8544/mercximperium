import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, Wifi } from "lucide-react";
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

const detectBrand = (n: string) => {
  const c = n.replace(/\s/g, "");
  if (/^4/.test(c)) return "VISA";
  if (/^5[1-5]/.test(c) || /^2[2-7]/.test(c)) return "MC";
  if (/^3[47]/.test(c)) return "AMEX";
  if (/^6(?:011|5)/.test(c)) return "DISC";
  return "";
};

const AddPaymentMethodModal = ({ open, onOpenChange, onAdded }: AddPaymentMethodModalProps) => {
  const { addMethod } = usePaymentMethods();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("India");
  const [focus, setFocus] = useState<"num" | "exp" | "cvv" | null>(null);
  const [saving, setSaving] = useState(false);

  const brand = useMemo(() => detectBrand(cardNumber), [cardNumber]);

  const reset = () => {
    setCardNumber(""); setExpiry(""); setCvv(""); setCountry("India");
  };

  const handleConfirm = async () => {
    const cleanedNum = cardNumber.replace(/\s/g, "");
    if (cleanedNum.length < 13) return toast({ title: "Invalid card number", variant: "destructive" });
    const [mm, yy] = expiry.split("/");
    const month = parseInt(mm || "", 10);
    const year = parseInt(yy || "", 10);
    if (!month || month < 1 || month > 12 || !year) return toast({ title: "Invalid expiration date", variant: "destructive" });
    if (cvv.length < 3) return toast({ title: "Invalid security code", variant: "destructive" });
    setSaving(true);
    const { error } = await addMethod({ cardNumber: cleanedNum, expMonth: month, expYear: 2000 + year, country });
    setSaving(false);
    if (error) return toast({ title: "Could not save card", description: (error as Error).message, variant: "destructive" });
    toast({ title: "Payment method added" });
    reset();
    onAdded?.();
    onOpenChange(false);
  };

  const display = cardNumber || "•••• •••• •••• ••••";
  const padded = display.padEnd(19, "•").slice(0, 19);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-2xl overflow-hidden border-primary/20 bg-gradient-to-b from-background to-muted/40">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="text-xl font-bold tracking-tight">Add Payment Method</DialogTitle>
          <p className="text-xs text-muted-foreground">Securely stored. Used only when you win or buy.</p>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Live card preview */}
          <div className="relative h-44 rounded-2xl p-5 text-white overflow-hidden shadow-xl bg-gradient-to-br from-[#3b2415] via-[#5a3a23] to-[#2c7a6b]">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-black/20 blur-2xl" />
            <div className="relative flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-inner" />
                <Wifi className="h-4 w-4 rotate-90 opacity-80" />
              </div>
              <span className="text-[11px] font-extrabold tracking-widest bg-white/15 backdrop-blur px-2 py-1 rounded">
                {brand || "CARD"}
              </span>
            </div>
            <div
              className={`relative mt-6 font-mono text-lg tracking-[0.18em] transition-all ${
                focus === "num" ? "text-white" : "text-white/90"
              }`}
            >
              {padded}
            </div>
            <div className="relative mt-4 flex justify-between text-[10px] uppercase tracking-widest text-white/70">
              <div>
                <p className="text-[9px]">Cardholder</p>
                <p className="text-white text-xs tracking-wider">MercxImperium Member</p>
              </div>
              <div className="text-right">
                <p className="text-[9px]">Expires</p>
                <p className="text-white text-xs tracking-wider">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* Card number */}
          <div className={`relative bg-card rounded-xl px-4 py-3 border transition-all ${focus === "num" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Card number</p>
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onFocus={() => setFocus("num")}
              onBlur={() => setFocus(null)}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${brand === "VISA" ? "bg-blue-700 text-white border-blue-700 scale-110" : "bg-white text-blue-700"}`}>VISA</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${brand === "MC" ? "bg-red-600 text-white border-red-600 scale-110" : "bg-white text-red-600"}`}>MC</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${brand === "AMEX" ? "bg-blue-900 text-white border-blue-900 scale-110" : "bg-white text-blue-900"}`}>AMEX</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`bg-card rounded-xl px-4 py-3 border transition-all ${focus === "exp" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expiry</p>
              <Input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                onFocus={() => setFocus("exp")}
                onBlur={() => setFocus(null)}
                placeholder="MM/YY"
                inputMode="numeric"
                className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </div>
            <div className={`bg-card rounded-xl px-4 py-3 border relative transition-all ${focus === "cvv" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">CVV</p>
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onFocus={() => setFocus("cvv")}
                onBlur={() => setFocus(null)}
                placeholder="123"
                inputMode="numeric"
                className="bg-transparent border-0 px-0 h-auto text-base focus-visible:ring-0 pr-7 placeholder:text-muted-foreground/50"
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card rounded-xl px-4 py-2 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</p>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-transparent border-0 px-0 h-auto text-base focus:ring-0">
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

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3 text-primary" />
            <span>Encrypted end-to-end. MercxImperium never stores your full card.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button variant="outline" className="rounded-full h-11" onClick={() => onOpenChange(false)} disabled={saving}>
              Back
            </Button>
            <Button
              className="rounded-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30"
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
