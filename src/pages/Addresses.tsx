import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  CreditCard, 
  MapPin, 
  User,
  AlertTriangle,
  MessageSquare,
  MoreHorizontal,
  ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddAddressModal from "@/components/account/AddAddressModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isReturn: boolean;
}

const Addresses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "User";

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      isDefault: true,
      isReturn: true,
    }
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const sidebarItems = [
    { label: "General", isHeader: true },
    { icon: Settings, label: "Preferences", path: "/account-settings" },
    { icon: CreditCard, label: "Payments", path: "/account-settings/payments" },
    { icon: MapPin, label: "Addresses", path: "/addresses", active: true },
    { icon: User, label: "Account", path: "/account" },
    { label: "Help & Legal", isHeader: true },
    { icon: AlertTriangle, label: "User Reports", path: "/user-reports" },
    { icon: MessageSquare, label: "Contact Us", path: "/contact" },
  ];

  const handleAddAddress = (address: Omit<Address, "id">) => {
    const newAddress = { ...address, id: Date.now().toString() };
    setAddresses(prev => [...prev, newAddress]);
    toast({ title: "Address added successfully" });
  };

  const handleEditAddress = (address: Address) => {
    setAddresses(prev => prev.map(a => a.id === address.id ? address : a));
    toast({ title: "Address updated successfully" });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast({ title: "Address removed" });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast({ title: "Default address updated" });
  };

  const handleSetReturn = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isReturn: a.id === id })));
    toast({ title: "Return address updated" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="flex flex-col md:flex-row pt-32 sm:pt-28 md:pt-16">
        {/* Mobile Header Navigation */}
        <div className="md:hidden px-4 py-3 border-b border-border bg-card/50">
          <Link to="/profile-view" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {userInitial}
            </div>
            <div>
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-primary">View Profile</p>
            </div>
          </Link>
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
            {sidebarItems.filter(item => !item.isHeader).map((item, index) => (
              <Link
                key={index}
                to={item.path || "#"}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
                  item.active 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-border bg-card/50 p-4 hidden md:block">
          <Link to="/profile-view" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {userInitial}
            </div>
            <div>
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-primary">View Profile</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              item.isHeader ? (
                <p key={index} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4 pb-2 first:pt-0">
                  {item.label}
                </p>
              ) : (
                <Link
                  key={index}
                  to={item.path || "#"}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          <div className="mt-8">
            <Button 
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate("/become-seller")}
            >
              <span className="text-lg">🏪</span>
              Seller Hub
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Addresses</h1>
          </div>

          {/* Saved Addresses */}
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Saved Addresses</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your shipping address details</p>
              </div>
              <Button 
                className="bg-foreground text-background hover:bg-foreground/90 text-sm w-full sm:w-auto"
                onClick={() => {
                  setEditingAddress(null);
                  setIsAddModalOpen(true);
                }}
              >
                Add
              </Button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-muted-foreground text-sm">No addresses saved yet.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start justify-between gap-2 py-3 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm sm:text-base text-foreground">{address.name}</p>
                        {address.isReturn && (
                          <span className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 rounded text-muted-foreground">Return</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{address.addressLine1}</p>
                      {address.addressLine2 && (
                        <p className="text-xs sm:text-sm text-muted-foreground">{address.addressLine2}</p>
                      )}
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postalCode}, {address.country}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingAddress(address);
                          setIsAddModalOpen(true);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveAddress(address.id)}>
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                          Set as Default
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetReturn(address.id)}>
                          Set as Return
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      <AddAddressModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={editingAddress ? handleEditAddress : handleAddAddress}
        address={editingAddress}
      />
    </div>
  );
};

export default Addresses;
