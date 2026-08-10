import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Plus, CreditCard, Building2, Smartphone, Wallet, Banknote, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { useWallet } from "@/hooks/useWallet";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const defaultAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    addressLine1: "1237, Hardev Nagar, Sardar Pura",
    addressLine2: "",
    city: "LALRU",
    state: "PUNJAB",
    postalCode: "140501",
    country: "India",
  },
];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "Yes Bank",
];

const emiOptions = [
  { months: 3, interest: "No Cost EMI" },
  { months: 6, interest: "No Cost EMI" },
  { months: 9, interest: "₹120/month" },
  { months: 12, interest: "₹95/month" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { credits, creditsToRupees, applyCredits, earnCredits } = useCredits();
  const { balance: walletBalance, spend: spendWallet } = useWallet();

  type CheckoutItem = {
    title: string;
    image: string;
    price: number;
    originalPrice: number;
    currency: string;
    quantity: number;
    sellerName: string;
    color: string;
    size: string;
  };

  const rawState = location.state as (CheckoutItem | { items: CheckoutItem[] }) | null;
  const items: CheckoutItem[] | null = rawState
    ? "items" in rawState
      ? rawState.items
      : [rawState as CheckoutItem]
    : null;
  const item = items?.[0] ?? null;

  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [appliedCredits, setAppliedCredits] = useState(0);
  const [creditInput, setCreditInput] = useState("");
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedEmi, setSelectedEmi] = useState("");

  // New address form
  const [newAddr, setNewAddr] = useState({ name: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India" });

  // Card form
  const [cardForm, setCardForm] = useState({ number: "", nickname: user?.email?.split("@")[0] || "", expiryMonth: "01", expiryYear: "2026" });

  if (!item || !items) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
          <p className="text-muted-foreground">No item selected for checkout.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const itemTotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const deliveryCharge = 0;
  const creditDiscount = creditsToRupees(appliedCredits);
  const orderTotal = itemTotal + deliveryCharge - creditDiscount;
  const hasCredits = credits > 0;

  const handleApplyCredits = () => {
    const requestedCredits = parseInt(creditInput);
    if (isNaN(requestedCredits) || requestedCredits <= 0) {
      toast({ title: "Please enter a valid credit amount", variant: "destructive" });
      return;
    }
    const maxCreditsForOrder = Math.min(requestedCredits, credits, itemTotal * 5); // can't exceed order total
    setAppliedCredits(maxCreditsForOrder);
    toast({ title: `${maxCreditsForOrder} credits applied`, description: `You save ₹${creditsToRupees(maxCreditsForOrder).toLocaleString()}` });
  };

  const handleRemoveCredits = () => {
    setAppliedCredits(0);
    setCreditInput("");
    toast({ title: "Credits removed" });
  };

  const handleAddAddress = () => {
    if (!newAddr.name || !newAddr.addressLine1 || !newAddr.city || !newAddr.state || !newAddr.postalCode) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const addr: Address = { ...newAddr, id: Date.now().toString() };
    setAddresses((p) => [...p, addr]);
    setSelectedAddressId(addr.id);
    setIsAddAddressOpen(false);
    setNewAddr({ name: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India" });
    toast({ title: "Address added" });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({ title: "Please select a delivery address", variant: "destructive" });
      return;
    }

    // Apply credits if any were selected
    if (appliedCredits > 0) {
      const success = await applyCredits(appliedCredits);
      if (!success) {
        toast({ title: "Failed to apply credits", variant: "destructive" });
        return;
      }
    }

    // If user chose Wallet, deduct from wallet balance
    if (paymentMethod === "wallet") {
      if (walletBalance < orderTotal) {
        toast({
          title: "Insufficient wallet balance",
          description: `You have ₹${walletBalance.toLocaleString("en-IN")}. Add money to your wallet or pick another method.`,
          variant: "destructive",
        });
        return;
      }
      const desc = items.length > 1 ? `Order payment for ${items.length} items` : `Order payment: ${item.title}`;
      const res = await spendWallet(orderTotal, desc, `ORD${Date.now().toString().slice(-8)}`);
      if (!res.success) {
        toast({ title: "Wallet payment failed", description: res.error, variant: "destructive" });
        return;
      }
    }

    // Earn credits based on the final order amount (1 credit per ₹5 spent)
    const earned = await earnCredits(orderTotal);

    // Persist orders via secure edge function (server validates & inserts)
    if (user) {
      const addrText = selectedAddress
        ? `${selectedAddress.name}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.country}`
        : null;
      const { supabase } = await import("@/integrations/supabase/client");
      const rows = items.map((it) => ({
        product_title: it.title,
        product_image: it.image || null,
        product_price: it.price,
        product_currency: it.currency || "₹",
        quantity: it.quantity,
        seller_name: it.sellerName || null,
        total_amount: it.price * it.quantity,
        payment_method: paymentMethod,
        shipping_address: addrText,
      }));
      await supabase.functions.invoke("orders-operations", {
        body: { action: "create", orders: rows },
      });
    }

    const orderDesc = items.length > 1 ? `${items.length} items` : item.title;
    toast({
      title: "Order placed successfully!",
      description: `Your order for ${orderDesc} will be delivered soon.${earned > 0 ? ` You earned ${earned} credits!` : ""}`,
    });
    navigate("/activity");
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="pt-[100px] md:pt-20 px-4 md:px-8 max-w-6xl mx-auto pb-12">
        <Button variant="ghost" className="mb-4 gap-2 text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                </h2>
                <Button variant="link" className="text-primary text-sm p-0 h-auto" onClick={() => setIsAddAddressOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add New
                </Button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No addresses saved. Please add one.</p>
              ) : (
                <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="mt-1" />
                      <Label htmlFor={`addr-${addr.id}`} className="flex-1 cursor-pointer">
                        <p className="font-medium text-sm text-foreground">{addr.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>

              {/* Available Credit */}
              <div className={`rounded-lg p-4 mb-4 ${hasCredits ? 'bg-muted/50' : 'bg-muted/30 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-primary" /> Your available credits
                    </p>
                    <p className="text-xs text-muted-foreground">5 credits = ₹1</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{credits.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">≈ ₹{creditsToRupees(credits).toLocaleString()}</p>
                  </div>
                </div>
                {hasCredits ? (
                  appliedCredits > 0 ? (
                    <div className="flex items-center justify-between mt-3 bg-primary/10 rounded-md px-3 py-2">
                      <span className="text-sm text-foreground">{appliedCredits} credits applied (-₹{creditDiscount.toLocaleString()})</span>
                      <Button variant="ghost" size="sm" className="text-destructive h-auto p-0 text-xs" onClick={handleRemoveCredits}>Remove</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        placeholder="Enter credits to use"
                        type="number"
                        value={creditInput}
                        onChange={(e) => setCreditInput(e.target.value)}
                        className="max-w-[200px] h-9 text-sm"
                        max={credits}
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCredits}>Apply</Button>
                    </div>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground mt-2">No credits available</p>
                )}
              </div>

              <p className="text-sm font-medium text-foreground mb-3">Another payment method</p>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {/* MercxImperium Wallet */}
                  <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="wallet" id="pay-wallet" />
                      <Label htmlFor="pay-wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium text-foreground">Pay with Wallet</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Bal: <span className="font-semibold text-foreground">₹{walletBalance.toLocaleString("en-IN")}</span>
                          </span>
                        </div>
                      </Label>
                    </div>
                    {paymentMethod === "wallet" && (
                      <div className="mt-3 ml-7">
                        {walletBalance >= orderTotal ? (
                          <p className="text-xs text-muted-foreground">
                            ₹{orderTotal.toLocaleString("en-IN")} will be deducted from your wallet.
                          </p>
                        ) : (
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-xs text-destructive">
                              Insufficient balance. Need ₹{(orderTotal - walletBalance).toLocaleString("en-IN")} more.
                            </p>
                            <Button variant="link" className="text-primary text-xs p-0 h-auto" onClick={() => navigate("/wallet")}>
                              Add money →
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Card */}
                <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="pay-card" />
                    <Label htmlFor="pay-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Credit or debit card</span>
                      </div>
                    </Label>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-3 ml-7">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {["VISA", "MasterCard", "Amex", "Maestro", "RuPay"].map((c) => (
                          <span key={c} className="text-[10px] bg-muted px-2 py-1 rounded font-medium text-muted-foreground">{c}</span>
                        ))}
                      </div>
                      <Button variant="link" className="text-primary text-sm p-0 h-auto" onClick={() => setIsCardModalOpen(true)}>
                        <Plus className="w-3 h-3 mr-1" /> Add a new credit or debit card
                      </Button>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "netbanking" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="netbanking" id="pay-nb" />
                    <Label htmlFor="pay-nb" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Net Banking</span>
                      </div>
                    </Label>
                  </div>
                  {paymentMethod === "netbanking" && (
                    <div className="mt-3 ml-7">
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger className="max-w-[280px]">
                          <SelectValue placeholder="Choose an Option" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="upi" id="pay-upi" />
                    <Label htmlFor="pay-upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Scan and Pay with UPI</span>
                      </div>
                    </Label>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="mt-3 ml-7">
                      <Input placeholder="Enter UPI ID (e.g. name@upi)" className="max-w-[280px] h-9 text-sm" />
                    </div>
                  )}
                </div>

                {/* EMI */}
                <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "emi" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="emi" id="pay-emi" />
                    <Label htmlFor="pay-emi" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">EMI</span>
                      </div>
                    </Label>
                  </div>
                  {paymentMethod === "emi" && (
                    <div className="mt-3 ml-7 space-y-2">
                      {emiOptions.map((opt) => (
                        <label key={opt.months} className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-colors ${selectedEmi === String(opt.months) ? "border-primary bg-primary/5" : "border-border"}`}>
                          <input type="radio" name="emi" value={opt.months} checked={selectedEmi === String(opt.months)} onChange={(e) => setSelectedEmi(e.target.value)} className="accent-[hsl(var(--primary))]" />
                          <span className="text-sm text-foreground">{opt.months} Months</span>
                          <span className="text-xs text-muted-foreground ml-auto">{opt.interest}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className={`p-4 rounded-lg border transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cod" id="pay-cod" />
                    <Label htmlFor="pay-cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Cash on Delivery / Pay on Delivery</span>
                      </div>
                    </Label>
                  </div>
                  {paymentMethod === "cod" && (
                    <p className="mt-2 ml-7 text-xs text-muted-foreground">Pay with cash when your order is delivered. Additional ₹40 charge applies.</p>
                  )}
                </div>
              </RadioGroup>

              <div className="mt-5">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={handlePlaceOrder}>
                  Use this payment method
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-5 sticky top-24">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mb-4" onClick={handlePlaceOrder}>
                Use this payment method
              </Button>

              <Separator className="mb-4" />

              <h3 className="text-base font-semibold text-foreground mb-3">
                Order Summary {items.length > 1 && <span className="text-xs font-normal text-muted-foreground">({items.length} items)</span>}
              </h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img src={it.image} alt={it.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{it.title}</p>
                      {(it.color || it.size) && (
                        <p className="text-xs text-muted-foreground">
                          {it.color && `Color: ${it.color}`}{it.color && it.size && " | "}{it.size && `Size: ${it.size}`}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">Sold by: {it.sellerName}</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        {it.currency}{(it.price * it.quantity).toLocaleString()}
                        {it.quantity > 1 && <span className="text-xs font-normal text-muted-foreground ml-1">(x{it.quantity})</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({totalQuantity}):</span>
                  <span className="text-foreground">{item.currency}{itemTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                {appliedCredits > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Credits ({appliedCredits}):</span>
                    <span>-{item.currency}{creditDiscount.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">Order Total:</span>
                  <span className="text-foreground">{item.currency}{orderTotal.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[10px] text-primary mt-3">FREE Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input value={newAddr.name} onChange={(e) => setNewAddr((p) => ({ ...p, name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Address Line 1 *</Label>
              <Input value={newAddr.addressLine1} onChange={(e) => setNewAddr((p) => ({ ...p, addressLine1: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Address Line 2</Label>
              <Input value={newAddr.addressLine2} onChange={(e) => setNewAddr((p) => ({ ...p, addressLine2: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">City *</Label>
                <Input value={newAddr.city} onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">State *</Label>
                <Input value={newAddr.state} onChange={(e) => setNewAddr((p) => ({ ...p, state: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Postal Code *</Label>
                <Input value={newAddr.postalCode} onChange={(e) => setNewAddr((p) => ({ ...p, postalCode: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Input value={newAddr.country} onChange={(e) => setNewAddr((p) => ({ ...p, country: e.target.value }))} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAddressOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAddress}>Add Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Card Modal */}
      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a new credit or debit card</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
            <Label className="text-sm text-right">Card number</Label>
            <Input value={cardForm.number} onChange={(e) => setCardForm((p) => ({ ...p, number: e.target.value }))} placeholder="XXXX XXXX XXXX XXXX" />
            <Label className="text-sm text-right">Nickname</Label>
            <Input value={cardForm.nickname} onChange={(e) => setCardForm((p) => ({ ...p, nickname: e.target.value }))} />
            <Label className="text-sm text-right">Expiry date</Label>
            <div className="flex gap-2">
              <Select value={cardForm.expiryMonth} onValueChange={(v) => setCardForm((p) => ({ ...p, expiryMonth: v }))}>
                <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cardForm.expiryYear} onValueChange={(v) => setCardForm((p) => ({ ...p, expiryYear: v }))}>
                <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => String(2025 + i)).map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <p className="text-xs text-muted-foreground mr-2">Accepted:</p>
            {["VISA", "MasterCard", "Amex", "Maestro", "RuPay"].map((c) => (
              <span key={c} className="text-[10px] bg-muted px-2 py-1 rounded font-medium text-muted-foreground">{c}</span>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCardModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsCardModalOpen(false); toast({ title: "Card added successfully" }); }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
