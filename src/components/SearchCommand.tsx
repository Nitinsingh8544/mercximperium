import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Home, Users, ShoppingBag, Settings, CreditCard, Heart, 
  MessageSquare, Bell, User, Video, Tag, Sparkles
} from "lucide-react";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const navigate = useNavigate();

  const pages = [
    { name: "Home", icon: Home, path: "/dashboard", category: "Pages" },
    { name: "Browse Categories", icon: ShoppingBag, path: "/browse", category: "Pages" },
    { name: "Activity", icon: Heart, path: "/activity", category: "Pages" },
    { name: "Messages", icon: MessageSquare, path: "/messages", category: "Pages" },
    { name: "Notifications", icon: Bell, path: "/notifications", category: "Pages" },
    { name: "Account Settings", icon: Settings, path: "/account-settings", category: "Pages" },
    { name: "Payment Methods", icon: CreditCard, path: "/account-settings/payments", category: "Pages" },
    { name: "My Profile", icon: User, path: "/profile", category: "Pages" },
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
    { id: 1, host: "sneakerhub", title: "Premium Sneakers Drop 🔥", viewers: 177 },
    { id: 2, host: "streetwearking", title: "Limited Edition Streetwear", viewers: 291 },
    { id: 3, host: "collectibles_pro", title: "Rare Collectibles + Giveaway", viewers: 122 },
    { id: 4, host: "techgadgets", title: "Latest Tech Gadgets 📱", viewers: 203 },
    { id: 5, host: "gamingzone", title: "Gaming Setup Sale", viewers: 245 },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, sellers, categories, streams..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              onSelect={() => handleSelect(page.path)}
              className="cursor-pointer"
            >
              <page.icon className="mr-2 h-4 w-4 text-secondary" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Live Streams">
          {liveStreams.map((stream) => (
            <CommandItem
              key={stream.id}
              onSelect={() => handleSelect(`/live/${stream.id}`)}
              className="cursor-pointer"
            >
              <Video className="mr-2 h-4 w-4 text-red-500" />
              <div className="flex flex-col">
                <span>{stream.title}</span>
                <span className="text-xs text-muted-foreground">by {stream.host} · {stream.viewers} viewers</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Sellers">
          {sellers.map((seller) => (
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
        
        <CommandSeparator />
        
        <CommandGroup heading="Categories">
          {categories.map((category) => (
            <CommandItem
              key={category.name}
              onSelect={() => handleSelect("/browse")}
              className="cursor-pointer"
            >
              <Tag className="mr-2 h-4 w-4 text-secondary" />
              <span>{category.icon} {category.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Features">
          <CommandItem onSelect={() => handleSelect("/dashboard")} className="cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4 text-secondary" />
            <span>Become a Seller</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/how-it-works")} className="cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4 text-secondary" />
            <span>How It Works</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
