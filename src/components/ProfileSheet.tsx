import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Store, 
  CreditCard, 
  Bookmark, 
  Gavel, 
  ShoppingBag, 
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSheet = ({ isOpen, onClose }: ProfileSheetProps) => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userInitial = profile?.username?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || "U";
  const userName = profile?.name || profile?.username || "User";

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    onClose();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const quickActions = [
    { icon: Users, label: "Refer Friends", onClick: () => handleNavigation("/refer") },
    { icon: Store, label: "Complete Seller Setup", onClick: () => handleNavigation("/become-seller") },
    { icon: CreditCard, label: "Payments & Shipping", onClick: () => handleNavigation("/payments") },
    { icon: Bookmark, label: "Saved", onClick: () => handleNavigation("/saved") },
    { icon: Gavel, label: "Bids & Offers", onClick: () => handleNavigation("/bids") },
    { icon: ShoppingBag, label: "Purchases", onClick: () => handleNavigation("/activity") },
    { icon: Shield, label: "Account Health", onClick: () => handleNavigation("/account-health") },
  ];

  const menuItems = [
    { icon: Users, label: "Friends", onClick: () => handleNavigation("/friends"), hasArrow: true },
    { icon: Settings, label: "Account Settings", onClick: () => handleNavigation("/account-settings"), hasArrow: true },
    { icon: HelpCircle, label: "Help & Legal", onClick: () => handleNavigation("/help"), hasArrow: true },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[340px] sm:w-[380px] bg-background border-border p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b border-border">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation("/profile-view")}
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
              {userInitial}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-left">{userName}</h3>
              <p className="text-sm text-muted-foreground text-left">
                1 Following | 0 Followers
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </SheetHeader>

        {/* Quick Actions Grid */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-3 gap-3">
            {quickActions.slice(0, 6).map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <action.icon className="w-5 h-5 text-foreground" />
                <span className="text-xs text-center text-foreground leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={quickActions[6].onClick}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors mt-3 w-[calc(33.33%-0.5rem)]"
          >
            <Shield className="w-5 h-5 text-foreground" />
            <span className="text-xs text-center text-foreground leading-tight">Account Health</span>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-foreground" />
              <span className="flex-1 text-left text-foreground font-medium">{item.label}</span>
              {item.hasArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
            </button>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="p-4 mt-auto">
          <Button
            variant="outline"
            className="w-full gap-2 border-border"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
