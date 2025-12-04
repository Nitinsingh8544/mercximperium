import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { 
  Gift, 
  Store, 
  CreditCard, 
  Bookmark, 
  Gavel, 
  ShoppingBag, 
  Shield, 
  Users,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "Your Name";

  const menuItems = [
    { icon: Gift, label: "Refer Friends", to: "/refer" },
    { icon: Store, label: "Become a Seller", to: "/become-seller" },
    { icon: CreditCard, label: "Payments & Shipping", to: "/payments" },
    { icon: Bookmark, label: "Saved", to: "/saved" },
    { icon: Gavel, label: "Bids & Offers", to: "/bids" },
    { icon: ShoppingBag, label: "Purchases", to: "/activity" },
    { icon: Shield, label: "Account Health", to: "/account-health" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 max-w-2xl relative z-10">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary-foreground">
            {userInitial}
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
              <span>1 Following</span>
              <span>0 Followers</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.to}>
              <Card className="hover:shadow-md transition-all cursor-pointer group bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium text-foreground flex-1">
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Friends Section */}
        <Card className="hover:shadow-md transition-all cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-foreground">Friends</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
