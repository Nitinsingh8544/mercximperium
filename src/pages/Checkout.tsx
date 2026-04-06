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

  const item = location.state as {
    title: string;
    image: string;
    price: number;
    originalPrice: number;
    currency: string;
    quantity: number;
    sellerName: string;
    color: string;
    size: string;
  } | null;

  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedEmi, setSelectedEmi] = useState("");

  // New address form
  const [newAddr, setNewAddr] = useState({ name: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India" });

  // Card form
  const [cardForm, setCardForm] = useState({ number: "", nickname: user?.email?.split("@")[0] || "", expiryMonth: "01", expiryYear: "2026" });

  if (!item) {
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
  const itemTotal = item.price * item.quantity;
  const deliveryCharge = 0;
  const orderTotal = itemTotal + deliveryCharge;
  const availableCredit = 500;

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

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast({ title: "Please select a delivery address", variant: "destructive" });
      return;
    }
    toast({ title: "Order placed successfully!", description: `Your order for ${item.title} will be delivered soon.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="pt-20 px-4 md:px-8 max-w-6xl mx-auto pb-12">
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
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Your available balance</p>
                    <p className="text-xs text-muted-foreground">Store credit & gift cards</p>
                  </div>
                  <span className="text-lg font-bold text-primary">{item.currency}{availableCredit}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Input placeholder="Enter Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="max-w-[200px] h-9 text-sm" />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>

              <p className="text-sm font-medium text-foreground mb-3">Another payment method</p>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
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

              <h3 className="text-base font-semibold text-foreground mb-3">Order Summary</h3>

              <div className="flex gap-3 mb-4">
                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Color: {item.color} | Size: {item.size}</p>
                  <p className="text-xs text-muted-foreground">Sold by: {item.sellerName}</p>
                  <p className="text-sm font-bold text-foreground mt-1">{item.currency}{item.price.toLocaleString()}</p>
                </div>
              </div>

              <Separator className="mb-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({item.quantity}):</span>
                  <span className="text-foreground">{item.currency}{itemTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
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
