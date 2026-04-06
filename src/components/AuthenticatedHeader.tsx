import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import appLogo from "@/assets/app-logo.jpg";
import { Search, Heart, MessageSquare, Bell, Home, ShoppingBag, Settings, CreditCard, User, Video, Tag, Users, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSheet from "@/components/ProfileSheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const AuthenticatedHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits } = useCredits();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  const pages = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Browse Categories", icon: ShoppingBag, path: "/browse" },
    { name: "Activity", icon: Heart, path: "/activity" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Account Settings", icon: Settings, path: "/account-settings" },
    { name: "Addresses", icon: Settings, path: "/addresses" },
    { name: "Account", icon: User, path: "/account" },
    { name: "Payment Methods", icon: CreditCard, path: "/account-settings/payments" },
    { name: "My Profile", icon: User, path: "/profile-view" },
  ];

  const sellers = [
    { name: "sneakerhub", category: "Sneakers", followers: "12.5K" },
    { name: "streetwearking", category: "Streetwear", followers: "8.2K" },
    { name: "collectibles_pro", category: "Collectibles", followers: "5.1K" },
    { name: "fashionfinds", category: "Fashion", followers: "15.3K" },
    { name: "vintagevault", category: "Vintage", followers: "9.8K" },
    { name: "techgadgets", category: "Electronics", followers: "20.1K" },
    { name: "jewelryqueen", category: "Jewelry", followers: "7.4K" },
    { name: "gamingzone", category: "Gaming", followers: "18.9K" },
  ];

  const categories = [
    { name: "Sneakers & Streetwear", icon: "👟" },
    { name: "Home & Garden", icon: "🌿" },
    { name: "Toys & Hobbies", icon: "🎮" },
    { name: "Trading Card Games", icon: "🃏" },
    { name: "Electronics", icon: "🎧" },
    { name: "Women's Fashion", icon: "👗" },
    { name: "Men's Fashion", icon: "👔" },
    { name: "Jewelry", icon: "💎" },
  ];

  const liveStreams = [
    { id: 1, host: "sneakerhub", title: "Premium Sneakers Drop", viewers: 177 },
    { id: 2, host: "streetwearking", title: "Limited Edition Streetwear", viewers: 291 },
    { id: 3, host: "collectibles_pro", title: "Rare Collectibles + Giveaway", viewers: 122 },
    { id: 4, host: "techgadgets", title: "Latest Tech Gadgets", viewers: 203 },
    { id: 5, host: "gamingzone", title: "Gaming Setup Sale", viewers: 245 },
  ];

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return { pages: [], sellers: [], categories: [], liveStreams: [] };
    }

    return {
      pages: pages.filter(p => p.name.toLowerCase().includes(query)),
      sellers: sellers.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.category.toLowerCase().includes(query)
      ),
      categories: categories.filter(c => c.name.toLowerCase().includes(query)),
      liveStreams: liveStreams.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.host.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  const hasResults = 
    filteredResults.pages.length > 0 || 
    filteredResults.sellers.length > 0 || 
    filteredResults.categories.length > 0 || 
    filteredResults.liveStreams.length > 0;

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity">
              <img src={appLogo} alt="MercxImperium Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md object-cover" />
              <span className="hidden md:inline text-base lg:text-lg xl:text-xl font-bold text-foreground">
                MercxImperium
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
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

          {/* Search Bar with inline dropdown - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search MercxImperium..." 
                className="pl-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
            </div>
            
            {/* Search Dropdown */}
            {showDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                {!hasResults ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <Command className="border-none">
                    <CommandList>
                      {filteredResults.pages.length > 0 && (
                        <CommandGroup heading="Pages">
                          {filteredResults.pages.map((page) => (
                            <CommandItem
                              key={page.path}
                              onSelect={() => handleSelect(page.path)}
                              className="cursor-pointer"
                            >
                              <page.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{page.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      
                      {filteredResults.liveStreams.length > 0 && (
                        <CommandGroup heading="Live Streams">
                          {filteredResults.liveStreams.map((stream) => (
                            <CommandItem
                              key={stream.id}
                              onSelect={() => handleSelect(`/live/${stream.id}`)}
                              className="cursor-pointer"
                            >
                              <Video className="mr-2 h-4 w-4 text-destructive" />
                              <div className="flex flex-col">
                                <span>{stream.title}</span>
                                <span className="text-xs text-muted-foreground">by {stream.host} · {stream.viewers} viewers</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      
                      {filteredResults.sellers.length > 0 && (
                        <CommandGroup heading="Sellers">
                          {filteredResults.sellers.map((seller) => (
                            <CommandItem
                              key={seller.name}
                              onSelect={() => handleSelect(`/seller/${seller.name}`)}
                              className="cursor-pointer"
                            >
                              <Users className="mr-2 h-4 w-4 text-primary" />
                              <div className="flex flex-col">
                                <span>{seller.name}</span>
                                <span className="text-xs text-muted-foreground">{seller.category} · {seller.followers} followers</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      
                      {filteredResults.categories.length > 0 && (
                        <CommandGroup heading="Categories">
                          {filteredResults.categories.map((category) => (
                            <CommandItem
                              key={category.name}
                              onSelect={() => handleSelect("/browse")}
                              className="cursor-pointer"
                            >
                              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{category.icon} {category.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                )}
              </div>
            )}
          </div>

          {/* Right Actions - Compact on mobile */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            <Button variant="ghost" className="hidden lg:flex text-sm">
              Become a Seller
            </Button>

            <Link to="/activity" className="hidden sm:block">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 sm:h-9 sm:w-9 ${location.pathname === "/activity" ? "bg-primary/10" : ""}`}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>

            <Link to="/messages" className="hidden sm:block">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 sm:h-9 sm:w-9 ${location.pathname === "/messages" ? "bg-primary/10" : ""}`}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 sm:h-9 px-2 sm:px-3 gap-1 text-muted-foreground hover:text-foreground"
            >
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              <span className="text-xs sm:text-sm font-medium">{credits.toLocaleString()}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsProfileOpen(true)}
              className={`h-8 w-8 sm:h-9 sm:w-9 ${location.pathname === "/profile" || location.pathname === "/profile-view" ? "bg-primary/10" : ""}`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-xs sm:text-sm font-semibold text-primary-foreground">
                {userInitial}
              </div>
            </Button>

            <ProfileSheet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-2 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-3 h-9 text-sm bg-muted/50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
          </div>
          
          {/* Mobile Search Dropdown */}
          {showDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[250px] overflow-y-auto">
              {!hasResults ? (
                <div className="p-3 text-center text-muted-foreground text-xs">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <Command className="border-none">
                  <CommandList>
                    {filteredResults.pages.length > 0 && (
                      <CommandGroup heading="Pages">
                        {filteredResults.pages.slice(0, 3).map((page) => (
                          <CommandItem
                            key={page.path}
                            onSelect={() => handleSelect(page.path)}
                            className="cursor-pointer text-sm py-2"
                          >
                            <page.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{page.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {filteredResults.liveStreams.length > 0 && (
                      <CommandGroup heading="Live Streams">
                        {filteredResults.liveStreams.slice(0, 3).map((stream) => (
                          <CommandItem
                            key={stream.id}
                            onSelect={() => handleSelect(`/live/${stream.id}`)}
                            className="cursor-pointer text-sm py-2"
                          >
                            <Video className="mr-2 h-3.5 w-3.5 text-destructive" />
                            <span className="truncate">{stream.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {filteredResults.sellers.length > 0 && (
                      <CommandGroup heading="Sellers">
                        {filteredResults.sellers.slice(0, 2).map((seller) => (
                          <CommandItem
                            key={seller.name}
                            onSelect={() => handleSelect(`/seller/${seller.name}`)}
                            className="cursor-pointer text-sm py-2"
                          >
                            <Users className="mr-2 h-3.5 w-3.5 text-primary" />
                            <span>{seller.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="sm:hidden flex items-center justify-around py-2 mt-2 border-t border-border/40">
          <Link to="/dashboard" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/browse" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === "/browse" ? "text-primary" : "text-muted-foreground"}`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px]">Browse</span>
          </Link>
          <Link to="/activity" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === "/activity" ? "text-primary" : "text-muted-foreground"}`}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">Activity</span>
          </Link>
          <Link to="/messages" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === "/messages" ? "text-primary" : "text-muted-foreground"}`}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Inbox</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
