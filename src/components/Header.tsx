import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import miLogo from "@/assets/mi-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
          <img src={miLogo} alt="Mi Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
          <span className="hidden xs:inline text-sm sm:text-base md:text-lg lg:text-xl">MercxImperium</span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <Link to="/how-it-works" className="hidden md:block">
            <Button variant="ghost" className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4">How it works</Button>
          </Link>
          <Link to="/signin">
            <Button variant="hero-outline" size="sm" className="text-xs sm:text-sm md:text-base px-2.5 sm:px-3 md:px-4 lg:px-6">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="sm" className="text-xs sm:text-sm md:text-base px-2.5 sm:px-3 md:px-4 lg:px-6">Sign up</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;