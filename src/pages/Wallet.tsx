import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Send,
  History,
  ArrowLeft,
  Banknote,
} from "lucide-react";

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

const Wallet = () => {
  const navigate = useNavigate();
  const { balance, transactions, loading, addMoney, withdraw } = useWallet();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("UPI");
  const [submitting, setSubmitting] = useState(false);

  // Withdraw dialog state
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawMethod, setWithdrawMethod] = useState<string>("UPI");
  const [withdrawDest, setWithdrawDest] = useState<string>("");
  const [withdrawing, setWithdrawing] = useState(false);

  const handleAdd = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const ref = `TXN${Date.now().toString().slice(-8)}`;
    const res = await addMoney(value, method, ref);
    setSubmitting(false);
    if (res.success) {
      toast({ title: "Money added successfully", description: `₹${value.toLocaleString()} via ${method}` });
      setOpen(false);
      setAmount("");
    } else {
      toast({ title: "Top-up failed", description: res.error, variant: "destructive" });
    }
  };

  const handleWithdraw = async () => {
    const value = Number(withdrawAmount);
    if (!value || value <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (value > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }
    if (!withdrawDest.trim()) {
      toast({ title: "Enter your account / UPI details", variant: "destructive" });
      return;
    }
    setWithdrawing(true);
    const ref = `WD${Date.now().toString().slice(-8)}`;
    const res = await withdraw(value, `${withdrawMethod} • ${withdrawDest}`, ref);
    setWithdrawing(false);
    if (res.success) {
      toast({
        title: "Withdrawal initiated",
        description: `₹${value.toLocaleString()} will be sent to ${withdrawDest}`,
      });
      setWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawDest("");
    } else {
      toast({ title: "Withdrawal failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Wallet</h1>
        </div>

        {/* Balance card */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 opacity-90 text-sm mb-2">
                  <WalletIcon className="h-4 w-4" />
                  Available Balance
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold">
                    ₹{balance.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                  Add Money
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-background/10 text-primary-foreground border-primary-foreground/30 hover:bg-background/20 hover:text-primary-foreground"
                  onClick={() => setWithdrawOpen(true)}
                >
                  <Banknote className="h-5 w-5" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setOpen(true)}>
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">Add Money</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setWithdrawOpen(true)}>
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs font-medium">Withdraw</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/account-settings/payments")}>
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">Payment Methods</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <History className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs font-medium">Statements</span>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="px-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="credit">Money In</TabsTrigger>
                  <TabsTrigger value="debit">Money Out</TabsTrigger>
                </TabsList>
              </div>

              {(["all", "credit", "debit"] as const).map((tab) => {
                const list = transactions.filter((t) => tab === "all" || t.type === tab);
                return (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    {loading ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
                    ) : list.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {list.map((tx) => {
                          const isCredit = tx.type === "credit";
                          return (
                            <div key={tx.id} className="px-6 py-3 flex items-center gap-3">
                              <div
                                className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                  isCredit ? "bg-secondary/15 text-secondary" : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {isCredit ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {tx.description || (isCredit ? "Wallet credit" : "Wallet debit")}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(tx.created_at).toLocaleString()}</span>
                                  {tx.payment_method && (
                                    <Badge variant="outline" className="text-[10px] py-0">
                                      {tx.payment_method}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-bold ${isCredit ? "text-secondary" : "text-destructive"}`}>
                                  {isCredit ? "+" : "−"}₹{Number(tx.amount).toLocaleString("en-IN")}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Bal: ₹{Number(tx.balance_after).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add money dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Top up your wallet to bid in live auctions and shop instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_AMOUNTS.map((q) => (
                  <Button
                    key={q}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setAmount(String(q))}
                  >
                    +₹{q.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Wallet">Other Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={submitting || !amount}>
              {submitting ? "Processing..." : `Add ₹${Number(amount || 0).toLocaleString()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogDescription>
              Transfer money from your wallet to your bank or UPI.
              Available balance: <span className="font-semibold text-foreground">₹{balance.toLocaleString("en-IN")}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wd-amount">Amount (₹)</Label>
              <Input
                id="wd-amount"
                type="number"
                inputMode="numeric"
                min={1}
                max={balance}
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Withdraw to</Label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer (IMPS/NEFT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wd-dest">
                {withdrawMethod === "UPI" ? "UPI ID" : "Account number"}
              </Label>
              <Input
                id="wd-dest"
                placeholder={withdrawMethod === "UPI" ? "name@bank" : "Account number"}
                value={withdrawDest}
                onChange={(e) => setWithdrawDest(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)} disabled={withdrawing}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={withdrawing || !withdrawAmount}>
              {withdrawing ? "Processing..." : `Withdraw ₹${Number(withdrawAmount || 0).toLocaleString()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
