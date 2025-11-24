import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Video, ShoppingCart, DollarSign, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Video,
      title: "Watch Live",
      description: "Join live shopping streams from sellers around the world showcasing unique products.",
    },
    {
      icon: ShoppingCart,
      title: "Shop in Real-Time",
      description: "Interact with sellers, ask questions, and purchase items instantly during live sessions.",
    },
    {
      icon: DollarSign,
      title: "Sell Your Items",
      description: "Create your own live shopping events and connect with buyers interested in your products.",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with like-minded collectors and enthusiasts who share your passions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Vibrant animated background matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-primary/15 animate-gradient bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-secondary/20 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/50 via-primary/20 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-tr from-hero-brown/10 via-transparent to-hero-green/10 animate-gradient-shift" />
      
      <Header />
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">How It Works</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Join the future of social shopping in four simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-card/95">
                <CardHeader>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/signup">
              <Button size="lg" variant="hero" className="text-base sm:text-lg px-8 sm:px-12">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;