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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/15 animate-gradient bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-secondary/20 to-transparent animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/50 via-primary/20 to-transparent animate-pulse-slow animation-delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-secondary/15 to-transparent animate-pulse-slower" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,hsl(var(--secondary)/0.25)_90deg,transparent_180deg,hsl(var(--primary)/0.25)_270deg,transparent_360deg)] animate-spin-slow" />
        <div className="absolute inset-0 bg-gradient-to-tr from-hero-brown/10 via-transparent to-hero-green/10 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-hero-green/30 via-transparent to-transparent animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-hero-brown/30 via-transparent to-transparent animate-pulse-slower" />
        
        {/* Animated shopping items */}
        <AnimatedItems />

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                <p className="text-lg text-muted-foreground mb-4">
                  Live shopping. Exclusive deals. Imperial experience.
                </p>
                <p className="text-base text-muted-foreground">
                  Shop in real-time with thousands of buyers.
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