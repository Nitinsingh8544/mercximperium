import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import AnimatedItems from "@/components/AnimatedItems";
import ImageCarousel from "@/components/ImageCarousel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Vibrant animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/15 to-primary/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/30 via-secondary/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/30 via-primary/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,hsl(var(--secondary)/0.1)_90deg,transparent_180deg,hsl(var(--primary)/0.1)_270deg,transparent_360deg)] animate-spin-slow" />
        
        {/* Animated shopping items */}
        <AnimatedItems />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image Carousel */}
            <div className="animate-fade-in-up">
              <ImageCarousel />
            </div>

            {/* Right side - Content */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Your Imperial{" "}
                  <span className="text-primary">Marketplace</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Reign over commerce.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="hero" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="hero-outline" className="px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How it works indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Link to="/how-it-works">
            <Button variant="ghost" className="flex flex-col items-center gap-2">
              <span className="text-sm">How it works</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;