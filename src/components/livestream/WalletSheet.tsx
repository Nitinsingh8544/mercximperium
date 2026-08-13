import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "@/hooks/use-toast";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Landmark,
  Check,
  Loader2,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];
const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"];

type Step = "home" | "method" | "review" | "processing" | "success";
type MethodKind = "upi" | "card" | "netbanking";

interface SelectedMethod {
  kind: MethodKind;
  label: string;
  detail: string;
}

interface WalletSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletSheet = ({ open, onOpenChange }: WalletSheetProps) => {
  const navigate = useNavigate();
  const { balance, transactions, addMoney } = useWallet();
  const { methods: savedCards } = usePaymentMethods();

  const [step, setStep] = useState<Step>("home");
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selected, setSelected] = useState<SelectedMethod | null>(null);
  const [reference, setReference] = useState("");

  const value = Number(amount) || 0;
  const fee = useMemo(() => (value > 0 ? Math.round(value * 0.002) : 0), [value]);
  const total = value + fee;

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("home");
        setAmount("");
        setSelected(null);
        setUpiId("");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const goMethod = () => {
    if (value < 10) {
      toast({ title: "Minimum top-up is ₹10", variant: "destructive" });
      return;
    }
    setStep("method");
  };

  const pick = (m: SelectedMethod) => {
    setSelected(m);
    setStep("review");
  };

  const pay = async () => {
    if (!selected) return;
    setStep("processing");
    const ref = `MX${Date.now().toString().slice(-10)}`;
    setReference(ref);
    await new Promise((r) => setTimeout(r, 1600));
    const res = await addMoney(value, selected.label, ref);
    if (res.success) {
      setStep("success");
    } else {
      setStep("review");
      toast({ title: "Payment failed", description: res.error, variant: "destructive" });
    }
  };

  const header = (title: string, sub?: string, back?: () => void) => (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/60">
      {back && (
        <button onClick={back} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="min-w-0">
        <p className="text-base font-bold leading-tight text-foreground">{title}</p>
        {sub && <p className="text-[11px] text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );

  const methodRow = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onClick: () => void,
    badge?: string,
  ) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/40 transition-colors text-left"
    >
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">{badge}</span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] sm:h-[88vh] p-0 flex flex-col sm:max-w-lg sm:mx-auto rounded-t-3xl overflow-hidden">
        {/* HOME */}
        {step === "home" && (
          <>
            {header("My Wallet", "Instant top-ups, bids & purchases")}
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 space-y-5">
              <div className="relative rounded-3xl p-5 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground shadow-xl overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-foreground/10" />
                <div className="absolute -right-2 bottom--6 h-20 w-20 rounded-full bg-primary-foreground/5" />
                <div className="flex items-center gap-2 text-xs opacity-85">
                  <WalletIcon className="h-4 w-4" /> Available balance
                </div>
                <p className="text-4xl font-bold mt-2 tracking-tight">₹{balance.toLocaleString("en-IN")}</p>
                <p className="text-[11px] opacity-75 mt-1">Usable for bids, buy now & checkout</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Add money</p>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(String(a))}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        amount === String(a)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-foreground border-border hover:bg-muted/70"
                      }`}
                    >
                      ₹{a.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">₹</span>
                  <Input
                    inputMode="numeric"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    className="h-14 pl-9 text-2xl font-bold rounded-2xl"
                  />
                </div>
                <Button onClick={goMethod} className="w-full h-12 rounded-2xl gap-2 text-base font-semibold">
                  <Plus className="h-4 w-4" /> Continue
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> 100% secure payments · PCI-DSS compliant
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Recent activity</p>
                  <button className="text-xs text-primary font-medium" onClick={() => { onOpenChange(false); navigate("/wallet"); }}>
                    View all
                  </button>
                </div>
                {transactions.length === 0 && <p className="text-xs text-muted-foreground">No transactions yet.</p>}
                {transactions.slice(0, 6).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive"}`}>
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
            </div>
          </>
        )}

        {/* METHOD */}
        {step === "method" && (
          <>
            {header(`Pay ₹${value.toLocaleString("en-IN")}`, "Choose a payment method", () => setStep("home"))}
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 space-y-5">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">UPI</p>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app}
                      onClick={() => pick({ kind: "upi", label: "UPI", detail: app })}
                      className="rounded-2xl border border-border bg-card p-2.5 hover:border-primary/50 transition-colors flex flex-col items-center gap-1.5"
                    >
                      <Smartphone className="h-5 w-5 text-primary" />
                      <span className="text-[10px] font-medium text-foreground leading-tight text-center">{app}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() => {
                      if (!upiId.includes("@")) {
                        toast({ title: "Enter a valid UPI ID", variant: "destructive" });
                        return;
                      }
                      pick({ kind: "upi", label: "UPI", detail: upiId });
                    }}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cards</p>
                {savedCards.map((c) =>
                  methodRow(
                    <CreditCard className="h-5 w-5" />,
                    `${c.brand} •••• ${c.last4}`,
                    `Expires ${String(c.exp_month).padStart(2, "0")}/${String(c.exp_year).slice(-2)}`,
                    () => pick({ kind: "card", label: c.brand, detail: `•••• ${c.last4}` }),
                    c.is_default ? "Default" : undefined,
                  ),
                )}
                {methodRow(
                  <Plus className="h-5 w-5" />,
                  "Add a new card",
                  "Credit or debit · Visa, Mastercard, RuPay",
                  () => { onOpenChange(false); navigate("/account/payments"); },
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Net banking</p>
                {BANKS.slice(0, 3).map((b) =>
                  methodRow(<Landmark className="h-5 w-5" />, b, "Redirects to your bank", () =>
                    pick({ kind: "netbanking", label: "Net Banking", detail: b }),
                  ),
                )}
              </div>
            </div>
          </>
        )}

        {/* REVIEW */}
        {step === "review" && selected && (
          <>
            {header("Confirm payment", selected.detail, () => setStep("method"))}
            <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
              <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wallet top-up</span>
                  <span className="font-semibold text-foreground">₹{value.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing fee (0.2%)</span>
                  <span className="font-semibold text-foreground">₹{fee.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total payable</span>
                  <span className="text-xl font-bold text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center text-primary">
                  {selected.kind === "upi" ? <Smartphone className="h-5 w-5" /> : selected.kind === "card" ? <CreditCard className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{selected.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{selected.detail}</p>
                </div>
                <button className="text-xs text-primary font-medium" onClick={() => setStep("method")}>Change</button>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <p>Your payment is encrypted end-to-end. MercxImperium never stores your full card or UPI credentials.</p>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-card/80 backdrop-blur">
              <Button onClick={pay} className="w-full h-12 rounded-2xl text-base font-semibold">
                Pay ₹{total.toLocaleString("en-IN")}
              </Button>
            </div>
          </>
        )}

        {/* PROCESSING */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-9 w-9 text-primary animate-spin" />
              </div>
            </div>
            <p className="text-lg font-bold text-foreground">Processing payment</p>
            <p className="text-xs text-muted-foreground">Do not close this window while we confirm ₹{total.toLocaleString("en-IN")} with your bank.</p>
          </div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="h-20 w-20 rounded-full bg-secondary/15 flex items-center justify-center">
                <Check className="h-10 w-10 text-secondary" />
              </div>
              <p className="text-xl font-bold text-foreground">₹{value.toLocaleString("en-IN")} added</p>
              <p className="text-xs text-muted-foreground">Paid via {selected?.label} · {selected?.detail}</p>
              <div className="mt-2 w-full rounded-2xl border border-border bg-card p-3 space-y-2 text-left">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Transaction ID</span><span className="font-medium text-foreground">{reference}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">New balance</span><span className="font-semibold text-secondary">₹{balance.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{new Date().toLocaleString("en-IN")}</span></div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-secondary mt-1">
                <Sparkles className="h-3.5 w-3.5" /> You're ready to bid & buy instantly
              </div>
            </div>
            <div className="p-4 border-t border-border space-y-2">
              <Button className="w-full h-12 rounded-2xl font-semibold" onClick={() => onOpenChange(false)}>Done</Button>
              <Button variant="outline" className="w-full h-11 rounded-2xl gap-2" onClick={() => { onOpenChange(false); navigate("/wallet"); }}>
                <ExternalLink className="h-4 w-4" /> Open full wallet
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WalletSheet;
