import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  CreditCard,
  MapPin,
  User,
  AlertTriangle,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import AddPaymentMethodModal from "@/components/account/AddPaymentMethodModal";

const brandColor: Record<string, string> = {
  Visa: "text-blue-700",
  Mastercard: "text-red-600",
  Amex: "text-blue-900",
  Discover: "text-orange-600",
  Card: "text-foreground",
};

const AccountPayments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { methods, loading, setDefault, removeMethod } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "User";

  const sidebarItems = [
    { label: "General", isHeader: true },
    { icon: Settings, label: "Preferences", path: "/account-settings" },
    { icon: CreditCard, label: "Payments", path: "/account-settings/payments", active: true },
    { icon: MapPin, label: "Addresses", path: "/addresses" },
    { icon: User, label: "Account", path: "/account" },
    { label: "Help & Legal", isHeader: true },
    { icon: AlertTriangle, label: "User Reports", path: "/user-reports" },
    { icon: MessageSquare, label: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />

      <div className="flex pt-16">
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
            {sidebarItems.map((item, index) =>
              item.isHeader ? (
                <p
                  key={index}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4 pb-2 first:pt-0"
                >
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
              ),
            )}
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

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Payments</h1>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Payment Methods</h2>
                <p className="text-sm text-muted-foreground">
                  A default payment method is required to place bids or purchase products in live shows. For bids placed in live auctions, you'll be charged only if you win.
                </p>
              </div>
              <Button
                className="gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full shrink-0"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            {!loading && methods.length > 0 && (
              <div className="mt-6 border-t border-border">
                {methods.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 py-4 border-b border-border last:border-b-0"
                  >
                    <div className="w-14 h-9 rounded border border-border bg-white flex items-center justify-center">
                      <span className={`text-[11px] font-extrabold ${brandColor[m.brand] || ""}`}>
                        {m.brand.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">
                          {m.brand} • {m.last4}
                        </p>
                        {m.is_default && (
                          <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expiration: {m.exp_month}/{m.exp_year}
                      </p>
                    </div>
                    {!m.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setDefault(m.id)}
                      >
                        Set default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeMethod(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddPaymentMethodModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default AccountPayments;
