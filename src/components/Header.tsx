import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import miLogo from "@/assets/mi-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
          <img src={miLogo} alt="Mi Logo" className="w-10 h-10" />
          <span>MercxImperium</span>
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