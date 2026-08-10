import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import { Wallet as WalletIcon, Plus, ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";

const QUICK_AMOUNTS = [100, 500, 1000, 2000];
const METHODS = ["UPI", "Credit Card", "Debit Card", "Net Banking"];

interface WalletSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletSheet = ({ open, onOpenChange }: WalletSheetProps) => {
  const navigate = useNavigate();
  const { balance, transactions, addMoney } = useWallet();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const res = await addMoney(value, method, `TXN${Date.now().toString().slice(-8)}`);
    setSubmitting(false);
    if (res.success) {
      toast({ title: "Money added", description: `₹${value.toLocaleString("en-IN")} via ${method}` });
      setAmount("");
    } else {
      toast({ title: "Top-up failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent">
          <SheetTitle className="flex items-center gap-2 text-left">
            <WalletIcon className="h-5 w-5 text-secondary" />
            My Wallet
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          {/* Balance card */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
            <p className="text-xs opacity-80">Available balance</p>
            <p className="text-3xl font-bold mt-1">₹{balance.toLocaleString("en-IN")}</p>
          </div>

          {/* Add money */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Add money</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    amount === String(a)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-border hover:bg-muted/70"
                  }`}
                >
                  ₹{a.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <Input
              inputMode="numeric"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="h-10"
            />
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={submitting} className="w-full gap-2 h-11 rounded-xl">
              <Plus className="h-4 w-4" />
              {submitting ? "Adding..." : "Add money"}
            </Button>
          </div>

          {/* Recent transactions */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Recent activity</p>
            {transactions.length === 0 && (
              <p className="text-xs text-muted-foreground">No transactions yet.</p>
            )}
            {transactions.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive"}`}>
                  {t.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{t.description || (t.type === "credit" ? "Added money" : "Payment")}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleString("en-IN")}</p>
                </div>
                <span className={`text-xs font-semibold ${t.type === "credit" ? "text-secondary" : "text-destructive"}`}>
                  {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={() => navigate("/wallet")}>
            <ExternalLink className="h-4 w-4" />
            Open full wallet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WalletSheet;
