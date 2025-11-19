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
        {/* Ultra vibrant animated background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/20 to-primary/10 animate-gradient bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/40 via-secondary/15 to-transparent animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/40 via-primary/15 to-transparent animate-pulse-slow animation-delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-secondary/10 to-transparent animate-pulse-slower" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,hsl(var(--secondary)/0.15)_90deg,transparent_180deg,hsl(var(--primary)/0.15)_270deg,transparent_360deg)] animate-spin-slow" />
        <div className="absolute inset-0 bg-gradient-to-tr from-hero-brown/5 via-transparent to-hero-green/5 animate-gradient-shift" />
        
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