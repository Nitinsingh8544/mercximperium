import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary-foreground" />
          </div>
          <span>ShopLive</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/how-it-works">
            <Button variant="ghost">How it works</Button>
          </Link>
          <Link to="/signin">
            <Button variant="hero-outline" size="lg">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="lg">Sign up</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;