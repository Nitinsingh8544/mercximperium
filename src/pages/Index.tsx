import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import AnimatedItems from "@/components/AnimatedItems";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated shopping items */}
        <AnimatedItems />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Video */}
            <div className="animate-fade-in-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card">
                <video
                  className="w-full aspect-video object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-person-adding-products-to-an-online-shopping-cart-46634-large.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="text-6xl font-bold leading-tight mb-6">
                  The Live Shopping{" "}
                  <span className="text-primary">Marketplace</span>
                </h1>
                <p className="text-2xl text-muted-foreground mb-8">
                  Shop, sell, and connect around the things you love.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="hero" className="text-lg px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="hero-outline" className="text-lg px-8">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Download our app</p>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg">
                    App Store
                  </Button>
                  <Button variant="outline" size="lg">
                    Google Play
                  </Button>
                </div>
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