import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import miLogo from "@/assets/mi-logo.png";
import { Search, Heart, MessageSquare, Bell, Gift, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AuthenticatedHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={miLogo} alt="MercxImperium Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
              <span className="hidden sm:inline text-base md:text-lg lg:text-xl font-bold text-foreground">
                MercxImperium
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  className={`text-sm ${
                    location.pathname === "/dashboard" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : ""
                  }`}
                >
                  Home
                </Button>
              </Link>
              <Link to="/browse">
                <Button 
                  variant="ghost" 
                  className={`text-sm ${
                    location.pathname === "/browse" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : ""
                  }`}
                >
                  Browse
                </Button>
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search MercxImperium" 
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" className="hidden sm:flex text-sm">
              Become a Seller
            </Button>

            <Link to="/activity">
              <Button 
                variant="ghost" 
                size="icon"
                className={location.pathname === "/activity" ? "bg-primary/10" : ""}
              >
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/messages">
              <Button 
                variant="ghost" 
                size="icon"
                className={location.pathname === "/messages" ? "bg-primary/10" : ""}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/notifications">
              <Button 
                variant="ghost" 
                size="icon"
                className={location.pathname === "/notifications" ? "bg-primary/10" : ""}
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon">
              <Gift className="w-5 h-5" />
            </Button>

            <Link to="/profile">
              <Button 
                variant="ghost" 
                size="icon"
                className={`${location.pathname === "/profile" ? "bg-primary/10" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {userInitial}
                </div>
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search MercxImperium" 
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
