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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-xl text-muted-foreground">
              Join the future of social shopping in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/signup">
              <Button size="lg" variant="hero" className="text-lg px-12">
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